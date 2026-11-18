const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = ["tile-words.js", "activity-games.js"]
  .map((file) => fs.readFileSync(path.join(__dirname, "..", file), "utf8"))
  .join("\n");
const context = vm.createContext({});
const api = vm.runInContext(`${source}
  ({ sudokuPuzzles, cubeFaces, makeCube, turnCube, cubeSolved, makeCheckersBoard, checkersMoves, applyCheckersMove, tileWords, tileRacks, canMakeWord, tileMove, bestTileMove, wordGuessAnswers, scoreWordGuess })`, context);

test("Sudoku clues agree with valid solutions", () => {
  for (const [sizeText, puzzles] of Object.entries(api.sudokuPuzzles)) {
    const size = Number(sizeText), box = Math.sqrt(size);
    for (const { given, solution } of puzzles) {
      assert.equal(given.length, size * size);
      assert.equal(solution.length, size * size);
      [...given].forEach((value, i) => assert.ok(value === "0" || value === solution[i]));
      for (let i = 0; i < size; i++) {
        const row = [...solution.slice(i * size, (i + 1) * size)];
        const column = Array.from({ length: size }, (_, j) => solution[j * size + i]);
        const block = Array.from({ length: size }, (_, j) =>
          solution[(Math.floor(i / box) * box + Math.floor(j / box)) * size + (i % box) * box + j % box]);
        for (const group of [row, column, block]) assert.equal(new Set(group).size, size);
      }
    }
  }
});

test("cube rotations preserve stickers and have inverses", () => {
  for (const face of api.cubeFaces) {
    const cube = api.makeCube();
    api.turnCube(cube, face);
    assert.equal(api.cubeSolved(cube), false);
    api.turnCube(cube, face, false);
    assert.equal(api.cubeSolved(cube), true);
    for (let i = 0; i < 4; i++) api.turnCube(cube, face);
    assert.equal(api.cubeSolved(cube), true);
  }
});

test("checkers enforces captures and continued jumps", () => {
  const board = Array(64).fill(null);
  board[42] = { side: "player", king: false };
  board[46] = { side: "player", king: false };
  board[35] = { side: "computer", king: false };
  board[19] = { side: "computer", king: false };
  const moves = api.checkersMoves(board, "player");
  assert.equal(moves.length, 1);
  assert.equal(moves[0].from, 42);
  assert.equal(moves[0].to, 28);
  api.applyCheckersMove(board, moves[0]);
  assert.equal(board[35], null);
  const next = api.checkersMoves(board, "player", 28);
  assert.equal(next.length, 1);
  assert.equal(next[0].to, 10);
});

test("checkers promotion and king backward capture", () => {
  const board = Array(64).fill(null);
  board[10] = { side: "player", king: false };
  assert.equal(api.applyCheckersMove(board, { from: 10, to: 1, captured: null }), true);
  assert.equal(board[1].king, true);
  board[10] = { side: "computer", king: false };
  const moves = api.checkersMoves(board, "player");
  assert.equal(moves.length, 1);
  assert.equal(moves[0].to, 19);
});

test("every word rack has at least 50 distinct playable words", () => {
  for (const rack of api.tileRacks) {
    const words = new Set(api.tileWords.filter((word) => word.length >= 3 && word.length <= 5 && api.canMakeWord(word, rack)));
    assert.ok(words.size >= 50, `${rack} has only ${words.size} words`);
  }
  assert.equal(api.canMakeWord("STARES", "STARE"), false);
});

test("Word Tiles Classic restores five rounds, validation, passing and restart", () => {
  const elements = new Map(), formButtons = [{ disabled: false }, { disabled: false }];
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      textContent: "", innerHTML: "", value: "", disabled: false, attributes: {},
      setAttribute(name, value) { this.attributes[name] = value; },
      removeAttribute(name) { delete this.attributes[name]; },
      querySelectorAll() { return id === "tileForm" ? formButtons : []; },
    });
    return elements.get(id);
  }
  const testContext = vm.createContext({ $: element });
  vm.runInContext(`${source}
    Math.random = () => 0;
    shuffleActivity = (items) => items[0] === "STARES"
      ? ["STONER", "STARES", "SCARET", "DREAMT", "SLATER"]
      : [...items];
    renderActivityGame("Word Tiles Classic");`, testContext);
  const submit = (word) => {
    element("tileInput").value = word;
    element("tileForm").onsubmit({ preventDefault() {} });
  };
  assert.match(element("activity").innerHTML, /Word Tiles Classic/);
  submit("note");
  assert.equal(element("tileRound").textContent, "Round 2 of 5");
  assert.equal(element("tileRack").attributes["aria-label"], "Available letters: S, T, A, R, E, S");
  submit("ta");
  assert.match(element("tileError").textContent, /3–5 letters/);
  submit("tas");
  assert.match(element("tileError").textContent, /not in the built-in word list/);
  submit("taser");
  assert.equal(element("score").textContent, 9);
  assert.equal(element("tileRound").textContent, "Round 3 of 5");
  submit("xyz");
  assert.match(element("tileError").textContent, /cannot be made/);
  for (let i = 0; i < 3; i++) element("tilePass").onclick();
  assert.equal(element("tileRound").textContent, "Game complete");
  assert.equal(element("tileInput").disabled, true);
  assert.ok(formButtons.every((button) => button.disabled));
  assert.match(element("tileScores").textContent, /^You: 9 · Computer: \d+$/);
  element("tileRestart").onclick();
  assert.equal(element("tileRound").textContent, "Round 1 of 5");
  assert.equal(element("score").textContent, "0");
});

test("Word Tiles accepts common new words and extensions", () => {
  for (const word of ["MOST", "ANT", "ANTS", "LESS", "TEST", "TESTS", "SCAM", "SCAMS", "CANDLE", "RESCUE", "CURE", "QUEUE", "QUIZ", "FUNGUS"]) {
    const move = api.tileMove(Array(100).fill(null), word, word, 4, 3, "across");
    assert.equal(move.error, undefined, word);
  }
  const board = Array(100).fill(null);
  [..."ANT"].forEach((letter, i) => { board[43 + i] = letter; });
  const move = api.tileMove(board, "S", "ANTS", 4, 3, "across");
  assert.equal(move.error, undefined);
  assert.equal(move.placed.length, 1);
  const testBoard = Array(100).fill(null);
  [..."TEST"].forEach((letter, i) => { testBoard[43 + i] = letter; });
  assert.equal(api.tileMove(testBoard, "S", "TESTS", 4, 3, "across").error, undefined);
});

test("indexed computer search finds the same best score as exhaustive search", () => {
  const results = vm.runInContext(`(() => {
    function exhaustive(board, rack) {
      let best = null;
      const available = rack + board.filter(Boolean).join("");
      for (const word of tileDictionary) {
        if (!canMakeWord(word, available)) continue;
        for (const direction of ["across", "down"]) {
          for (let row = 0; row < tileBoardSize; row++) {
            for (let col = 0; col < tileBoardSize; col++) {
              const move = tileMove(board, rack, word, row, col, direction);
              if (!move.error && (best === null || move.score > best)) best = move.score;
            }
          }
        }
      }
      return best;
    }
    const empty = Array(100).fill(null), board = Array(100).fill(null);
    [..."STAR"].forEach((letter, i) => { board[43 + i] = letter; });
    return [[empty, "STARES"], [board, "CANDLE"], [board, "SSSTEE"], [board, "RESCUE"], [board, "QUIZZY"]].map(([grid, rack]) => {
      const move = bestTileMove(grid, rack);
      return { indexed: move ? move.score : null, exhaustive: exhaustive(grid, rack) };
    });
  })()`, context);
  for (const result of results) assert.equal(result.indexed, result.exhaustive);
});

test("Word Tiles supports full racks, board connections and letter bonuses", () => {
  for (const rack of api.tileRacks) {
    assert.ok(api.tileWords.some((word) => word.length === rack.length && api.canMakeWord(word, rack)), rack);
  }
  const board = Array(100).fill(null);
  assert.match(api.tileMove(board, "STARES", "STARES", 0, 0, "across").error, /center/);
  const opening = api.tileMove(board, "STARES", "STARES", 4, 2, "across");
  assert.equal(opening.placed.length, 6);
  assert.equal(opening.score, 6);
  for (const tile of opening.placed) board[tile.index] = tile.letter;
  assert.match(api.tileMove(board, "NOTE", "NOTE", 0, 0, "across").error, /Connect/);
  assert.match(api.tileMove(board, "NOTE", "NOTE", 3, 4, "down").error, /conflicts/);
  assert.match(api.tileMove(board, "N", "SON", 4, 2, "down").error, /letters needed/);
  const crossing = api.tileMove(board, "ON", "SON", 4, 2, "down");
  assert.equal(crossing.score, 5);
  assert.equal(crossing.placed.length, 2);
  assert.ok(api.bestTileMove(board, "STONER"));
  const extensionBoard = Array(100).fill(null);
  [..."STAR"].forEach((letter, i) => { extensionBoard[42 + i] = letter; });
  const extension = api.tileMove(extensionBoard, "TLE", "STARTLE", 4, 2, "across");
  assert.equal(extension.score, 7);
  assert.equal(extension.placed.length, 3);
  const edgeBoard = Array(100).fill(null);
  edgeBoard[96] = "S";
  assert.equal(api.tileMove(edgeBoard, "TAR", "STAR", 9, 6, "across").score, 18);
  assert.match(api.tileMove(edgeBoard, "STAR", "STAR", 9, 7, "across").error, /does not fit/);
});

test("Word Tiles validates cross words and scores premiums only for new tiles", () => {
  const board = Array(100).fill(null);
  board[2] = "A";
  board[4] = "E";
  const move = api.tileMove(board, "TAR", "TAR", 1, 2, "across");
  assert.equal(move.error, undefined);
  assert.deepEqual([...move.crossWords].map((cross) => cross.word), ["AT", "ER"]);
  assert.equal(move.score, 9);
  board[12] = "S";
  board[2] = null;
  board[4] = null;
  assert.equal(api.tileMove(board, "TAR", "STAR", 1, 2, "across").score, 4);
  board[3] = "B";
  assert.match(api.tileMove(board, "TAR", "STAR", 1, 2, "across").error, /Cross word/);
});

test("Word Tiles scores word bonuses, cross words and reused squares", () => {
  const doubleBoard = Array(100).fill(null);
  doubleBoard[10] = "S";
  assert.equal(api.tileMove(doubleBoard, "TAR", "STAR", 1, 0, "across").score, 10);
  doubleBoard[11] = "T";
  assert.equal(api.tileMove(doubleBoard, "AR", "STAR", 1, 0, "across").score, 5);

  const tripleBoard = Array(100).fill(null);
  tripleBoard[0] = "S";
  assert.equal(api.tileMove(tripleBoard, "TAR", "STAR", 0, 0, "across").score, 15);

  const stackedBoard = Array(100).fill(null);
  stackedBoard[0] = "E";
  const move = api.tileMove(stackedBoard, "STAR", "STAR", 0, 1, "down");
  assert.equal(move.score, 54);
  assert.deepEqual([...move.crossWords].map((cross) => [cross.word, cross.score]), [["ES", 6]]);
  stackedBoard[1] = "S";
  assert.equal(api.tileMove(stackedBoard, "TAR", "STAR", 0, 1, "down").score, 16);
});

test("Word Tiles refills unused tiles, plays the computer and restarts", () => {
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      textContent: "", innerHTML: "", value: "", disabled: false, attributes: {},
      setAttribute(name, value) { this.attributes[name] = value; },
      removeAttribute(name) { delete this.attributes[name]; },
      querySelectorAll() {
        if (id !== "tileBoard") return [];
        return Array.from({ length: 100 }, (_, index) => {
          const button = { dataset: { index }, focus() {} };
          elements.set(`square${index}`, button);
          return button;
        });
      },
      querySelector() { return { focus() {} }; },
    });
    return elements.get(id);
  }
  const testContext = vm.createContext({ $: element });
  vm.runInContext(`${source}
    let capturedBag;
    shuffleActivity = (items) => {
      if (items.length > 10) capturedBag = [...items];
      return [...items];
    };
    renderWordTiles();`, testContext);
  const capturedBag = vm.runInContext("capturedBag", testContext);
  assert.equal([...new Set(capturedBag)].sort().join(""), "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  assert.ok(capturedBag.filter((letter) => letter === "U").length >= 2);
  element("tileDirection").value = "across";
  assert.equal((element("tileBoard").innerHTML.match(/data-index=/g) || []).length, 100);
  assert.match(element("tileBoard").innerHTML, /Row 10, column 10/);
  assert.match(element("tileBoard").innerHTML, /Row 2, column 2, double word/);
  assert.match(element("tileBoard").innerHTML, /Row 1, column 2, triple word/);
  element("tileInput").value = "star";
  element("tileForm").onsubmit({ preventDefault() {} });
  assert.equal(element("score").textContent, 4);
  assert.match(element("tileRack").attributes["aria-label"], /^Available letters: E, S,/);
  assert.match(element("tileFeedback").textContent, /You played STAR for 4 points\. Computer played/);
  assert.match(element("tileBag").textContent, /tiles left/);
  vm.runInContext("bestTileMove = () => null", testContext);
  element("tilePass").onclick();
  assert.match(element("activityStatus").textContent, /Game over/);
  assert.equal(element("tileInput").disabled, true);
  element("tileRestart").onclick();
  assert.equal(element("score").textContent, 0);
  assert.equal(element("tileRack").attributes["aria-label"], "Available letters: S, T, A, R, E, S");
});

test("Word Tiles can start with the computer and remembers the selection for new games", () => {
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      textContent: "", innerHTML: "", value: "", disabled: false, attributes: {},
      setAttribute(name, value) { this.attributes[name] = value; },
      removeAttribute(name) { delete this.attributes[name]; },
      querySelectorAll() { return []; },
    });
    return elements.get(id);
  }
  const testContext = vm.createContext({ $: element });
  vm.runInContext(`${source}
    shuffleActivity = (items) => [...items];
    renderWordTiles();`, testContext);
  assert.equal(element("tileFirst").value, "player");
  assert.equal(element("tileScores").textContent, "You: 0 · Computer: 0");
  element("tileFirst").value = "computer";
  assert.equal(element("tileScores").textContent, "You: 0 · Computer: 0");
  element("tileRestart").onclick();
  assert.equal(element("tileFirst").value, "computer");
  assert.match(element("tileBoard").innerHTML, /class="tile-square occupied[^"]*" data-index="44"/);
  assert.match(element("tileFeedback").textContent, /^Computer played .+ for \d+ points\.$/);
  assert.match(element("tileScores").textContent, /^You: 0 · Computer: [1-9]\d*$/);
  assert.match(element("activityStatus").textContent, /^Your turn/);
  element("tileRestart").onclick();
  assert.equal(element("tileFirst").value, "computer");
  assert.match(element("tileFeedback").textContent, /^Computer played/);
  element("tileFirst").value = "player";
  element("tileRestart").onclick();
  assert.equal(element("tileScores").textContent, "You: 0 · Computer: 0");
  assert.doesNotMatch(element("tileBoard").innerHTML, /tile-square occupied/);
  vm.runInContext("bestTileMove = () => null", testContext);
  element("tileFirst").value = "computer";
  element("tileRestart").onclick();
  assert.equal(element("tileFeedback").textContent, "Computer passed.");
  assert.match(element("activityStatus").textContent, /^Your turn/);
  element("tilePass").onclick();
  assert.match(element("activityStatus").textContent, /^Game over/);
});

test("Word Guess handles repeated letters without overcounting", () => {
  assert.deepEqual([...api.scoreWordGuess("APPLE", "ALLEY")], ["correct", "present", "absent", "present", "absent"]);
  assert.deepEqual([...api.scoreWordGuess("SHEEP", "EERIE")], ["present", "present", "absent", "absent", "absent"]);
  assert.deepEqual([...api.scoreWordGuess("SHEEP", "SHEEP")], Array(5).fill("correct"));
  assert.ok(api.wordGuessAnswers.length >= 50);
  assert.ok(api.wordGuessAnswers.every((word) => /^[A-Z]{5}$/.test(word)));
});

test("Word Guess supports invalid input, six guesses, win, loss, and restart", () => {
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      textContent: "", innerHTML: "", value: "", disabled: false, attributes: {},
      setAttribute(name, value) { this.attributes[name] = value; },
      removeAttribute(name) { delete this.attributes[name]; },
      focus() {},
    });
    return elements.get(id);
  }
  const testContext = vm.createContext({ $: element });
  vm.runInContext(`${source}; Math.random = () => 0; renderWordGuess();`, testContext);
  const submit = (word) => {
    element("guessInput").value = word;
    element("guessForm").onsubmit({ preventDefault() {} });
  };
  submit("a1");
  assert.match(element("guessError").textContent, /exactly five letters/);
  assert.equal(element("score").textContent, "0");
  submit("apple");
  assert.match(element("activityStatus").textContent, /found APPLE in 1 guess/);
  assert.equal(element("guessInput").disabled, true);
  element("guessNew").onclick();
  assert.equal(element("score").textContent, "0");
  assert.equal(element("guessInput").disabled, false);
  for (let i = 0; i < 6; i++) submit("zzzzz");
  assert.equal(element("score").textContent, 6);
  assert.match(element("activityStatus").textContent, /Out of guesses/);
  assert.equal(element("guessSubmit").disabled, true);
  submit("beach");
  assert.equal(element("score").textContent, 6);
});
