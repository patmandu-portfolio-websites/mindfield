const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "..", "activity-games.js"), "utf8");
const context = vm.createContext({});
const api = vm.runInContext(`${source}
  ({ sudokuPuzzles, cubeFaces, makeCube, turnCube, cubeSolved, makeCheckersBoard, checkersMoves, applyCheckersMove, tileWords, tileRacks, canMakeWord, wordGuessAnswers, scoreWordGuess })`, context);

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

test("Word Tiles accepts TASER in round two and reports rejected words", () => {
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
    shuffleActivity = (items) => items[0] === "STARES"
      ? ["STONER", "STARES", "SCARET", "DREAMT", "SLATER"]
      : [...items];
    renderWordTiles();`, testContext);
  const submit = (word) => {
    element("tileInput").value = word;
    element("tileForm").onsubmit({ preventDefault() {} });
  };
  submit("note");
  assert.equal(element("tileRound").textContent, "Round 2 of 5");
  assert.equal(element("tileRack").attributes["aria-label"], "Available letters: S, T, A, R, E, S");
  submit("tas");
  assert.match(element("tileError").textContent, /not in the built-in word list/);
  assert.equal(element("tileRound").textContent, "Round 2 of 5");
  submit("taser");
  assert.equal(element("tileRound").textContent, "Round 3 of 5");
  assert.equal(element("score").textContent, 9);
  submit("xyz");
  assert.match(element("tileError").textContent, /cannot be made/);
  assert.equal(element("tileInput").attributes["aria-invalid"], "true");
  submit("sac");
  assert.equal(element("tileRound").textContent, "Round 4 of 5");
  assert.equal(element("tileError").textContent, "");
  assert.equal(element("tileInput").attributes["aria-invalid"], undefined);
  submit(" ");
  assert.match(element("tileError").textContent, /Enter a word/);
  assert.equal(element("tileRound").textContent, "Round 4 of 5");
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
