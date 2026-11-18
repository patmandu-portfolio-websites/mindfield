const activityGameNames = [
  "Sudoku", "Word Tiles", "Word Tiles Classic", "Jigsaw", "Color Cube",
  "Spot the Difference", "Card Matching", "Checkers", "Word Guess",
];

function activityShell(title, instructions, label) {
  $("scoreLabel").textContent = label;
  $("score").textContent = "0";
  $("scoreTotal").textContent = "";
  $("activity").innerHTML = `
    <div class="puzzle-panel">
      <div class="section-label">Interactive game</div>
      <h2 class="question">${title}</h2>
      <p class="activity-intro">${instructions}</p>
      <div class="activity-status" id="activityStatus" role="status" aria-live="polite"></div>
      <div id="activityContent"></div>
    </div>`;
}

function shuffleActivity(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function renderActivityGame(name) {
  const renderers = {
    Sudoku: renderSudoku,
    "Word Tiles": renderWordTiles,
    "Word Tiles Classic": renderWordTilesClassic,
    Jigsaw: renderJigsaw,
    "Color Cube": renderColorCube,
    "Spot the Difference": renderDifferences,
    "Card Matching": renderMatching,
    Checkers: renderCheckers,
    "Word Guess": renderWordGuess,
  };
  renderers[name]();
}

const sudokuPuzzles = {
  "4": [
    { given: "1004041020030320", solution: "1234341221434321" },
    { given: "2040402010300402", solution: "2143432112343412" },
  ],
  "9": [
    {
      given: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
      solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179",
    },
    {
      given: "000260701680070090190004500820100040004602900050003028009300074040050036703018000",
      solution: "435269781682571493197834562826195347374682915951743628519326874248957136763418259",
    },
  ],
};

function renderSudoku() {
  activityShell("Sudoku", "Fill every row, column and outlined box with each number once. Choose a smaller or larger grid, then check your answer.", "Puzzles solved");
  let size = 4, puzzleIndex = 0, solved = 0;
  $("activityContent").innerHTML = `
    <div class="puzzle-controls">
      <label for="sudokuSize">Grid size</label>
      <select id="sudokuSize"><option value="4">4 × 4</option><option value="9">9 × 9</option></select>
      <button id="sudokuNew">New puzzle</button><button id="sudokuCheck">Check answer</button>
    </div><div id="sudokuGrid" class="puzzle-grid sudoku-grid"></div>`;
  function draw() {
    const puzzle = sudokuPuzzles[size][puzzleIndex], box = Math.sqrt(size);
    const grid = $("sudokuGrid");
    delete grid.dataset.solved;
    grid.style.setProperty("--columns", size);
    grid.innerHTML = [...puzzle.given].map((digit, i) => {
      const row = Math.floor(i / size), col = i % size;
      return `<input class="puzzle-cell ${(col + 1) % box === 0 && col < size - 1 ? "box-right" : ""} ${(row + 1) % box === 0 && row < size - 1 ? "box-bottom" : ""}" type="text" inputmode="numeric" maxlength="1" aria-label="Row ${row + 1}, column ${col + 1}${digit !== "0" ? ", given" : ""}" value="${digit === "0" ? "" : digit}" ${digit !== "0" ? "readonly" : ""}>`;
    }).join("");
    grid.querySelectorAll("input:not([readonly])").forEach((input) => {
      input.addEventListener("input", () => {
        if (input.value && !new RegExp(`^[1-${size}]$`).test(input.value)) {
          input.value = "";
          $("activityStatus").textContent = `Enter a number from 1 to ${size}.`;
        }
      });
    });
    $("activityStatus").textContent = `Fill the ${size} × ${size} grid.`;
  }
  $("sudokuSize").onchange = (event) => {
    size = Number(event.target.value);
    puzzleIndex = 0;
    draw();
  };
  $("sudokuNew").onclick = () => {
    puzzleIndex = (puzzleIndex + 1) % sudokuPuzzles[size].length;
    draw();
  };
  $("sudokuCheck").onclick = () => {
    const values = [...$("sudokuGrid").querySelectorAll("input")].map((input) => input.value);
    if (values.some((value) => !value)) {
      $("activityStatus").textContent = "Fill every empty square before checking.";
      return;
    }
    const box = Math.sqrt(size);
    const valid = (group) => new Set(group).size === size;
    for (let i = 0; i < size; i++) {
      const row = values.slice(i * size, (i + 1) * size);
      const col = Array.from({ length: size }, (_, r) => values[r * size + i]);
      const block = Array.from({ length: size }, (_, j) =>
        values[(Math.floor(i / box) * box + Math.floor(j / box)) * size + (i % box) * box + j % box],
      );
      if (!valid(row) || !valid(col) || !valid(block)) {
        $("activityStatus").textContent = "Some numbers repeat in a row, column or box. Try again.";
        return;
      }
    }
    if (!$("sudokuGrid").dataset.solved) {
      solved++;
      $("score").textContent = solved;
      $("sudokuGrid").dataset.solved = "true";
    }
    $("activityStatus").textContent = "Correct! Every row, column and box is complete.";
  };
  draw();
}

const tileWords = [
  "ART", "RAT", "TAR", "TEAR", "RATE", "TARE", "STAR", "TARS", "STARE", "RATES", "TEARS", "TARES", "ASTER", "TASER",
  "REST", "SEAT", "EAST", "EATS", "TEAS", "SATE", "SALT", "SALE", "SEAL", "TALES", "STALE", "STEAL", "LEAST", "SLATE",
  "SAT", "SET", "SEA", "TEA", "ATE", "EAT", "LET", "LATE", "TALE", "TEAL", "ALES",
  "NOTE", "TONE", "STONE", "TONES", "NOTES", "NEST", "SENT", "TEN", "NET", "ONE", "SON", "TOE",
  "ONES", "NOSE", "EONS", "TENS", "TOES", "TON", "NOT", "SOT", "EON", "ONSET",
  "CARE", "RACE", "ACRE", "CAR", "ARC", "ARE", "EAR", "ACE", "CARS", "RACES", "SCARE", "ACRES",
  "CASE", "EARS", "ERAS", "SEAR", "SCAR", "ACES", "ARCS", "SEC", "SAC", "SERA", "CARES",
  "READ", "DEAR", "DARE", "RED", "ERA", "READS", "DARES", "DEARS", "DREAM", "MARE",
  "ARM", "DAM", "MAD", "RAM", "MAR", "RAD", "MADE", "MEAD", "DAME", "DRAM", "REAM",
  "ARTS", "RATS", "TSAR", "ERST", "RESAT", "RASE", "RASES", "EASE", "EASES", "ASSET", "ASS", "ASSES", "TASE", "TASES",
  "SEAS", "SEATS", "SEARS", "STARS", "TASTE", "TEASE", "SATES", "SETS",
  "NOSES", "NESTS", "NETS", "SONS", "SOTS", "TONS", "TOSS", "TENSE", "SENSE",
  "SNORE", "SNORT", "ROSE", "ROSES", "ROTE", "ROTES", "SORE",
  "SORT", "SORTS", "STORE", "STERN", "TENOR", "TONER",
  "ORE", "ORES", "ROE", "ROES", "ROT", "ROTS", "SON", "NOR", "TOR", "TORE",
  "SEER", "SEEN", "SOON", "NEON", "RENT", "RENTS", "REST", "RESTS", "TERN", "TERNS",
  "CARS", "CARES", "CASES", "SCARS", "SACS", "SECS", "CRESS",
  "CAST", "CASTE", "CATER", "CRATE", "TRACE", "REACT", "CARTE", "CARET", "CREST",
  "CATS", "CARS", "CART", "CARTS", "CARE", "COST", "SCAT", "SECT", "ACT", "ACTS", "CAT",
  "ARMED", "TRADE", "TREAD", "DREAM", "TAMED", "MATED", "RATED", "DATER", "TAMER",
  "DART", "DARTS", "DATE", "DATED", "MATE", "MEAT", "TEAM", "TAME", "TRAM", "MART", "TERM", "DRAT", "TARED",
  "MAT", "MET", "TAD", "TAR", "ART", "RAT", "TEA", "EAT", "ATE", "TEAR", "RATE",
  "SALES", "SEALS", "SALTS", "SLATS", "LAST", "LASE", "LETS", "TEALS",
  "ALERT", "ALTER", "LATER", "LASER", "STALE", "STEAL", "STARE", "TALES", "TEALS",
  "REAL", "EARL",
  "STARES", "STRESS", "STONES", "STONER", "TENORS", "TONERS", "TRACES", "CRATES",
  "CASTER", "REACTS", "RECAST", "CARETS", "CATERS", "CARTES", "DREAMT", "TRADES", "TREADS",
  "SLATER", "ALERTS", "ALTERS", "LASTER", "SALTER", "SLATES", "STEALS", "STALER",
  "ASSERT", "ASTERS", "TASERS", "ARTELS", "RATELS", "TALERS",
  "STARTLE", "SLATERS", "SALTERS", "RESTART", "STERNAL", "STARTLES", "RESTARTS", "RESTARTED",
  "MOST", "ANT", "ANTS", "ACTOR", "ACTORS", "ACORN", "ACORNS", "ACROSS", "ALSO", "ALONE",
  "ALMOST", "AMEND", "AMENDS", "AMASS", "ANTE", "ANTES", "ANTLER", "ANTLERS", "ANCESTOR", "ADO",
  "ADORE", "ADORES", "ADORED", "ADORN", "ADORNS", "ATOM", "ATOMS", "ATONE", "ATTEND", "ATTENDS",
  "SOLE", "SOLES", "SOLO", "SOLOS", "SOME", "SORTED", "SLOT", "SLOTS", "SMALL", "SMALLER",
  "SMART", "SMARTER", "SMELT", "SMELL", "SMELLS", "SMOTE", "MOLT", "MOLTS", "MOAN", "MOANS",
  "MOAT", "MOATS", "MOON", "MOONS", "MOOR", "MOORS", "MORTAL", "MORTALS", "MOSS", "MESS",
  "MAST", "MASTS", "MASTER", "MASTERS", "MATTER", "MATTERS", "METAL", "METALS", "MELT", "MELTS",
  "MELTED", "MEND", "MENDS", "MENTAL", "MENTOR", "MENTORS", "MEET", "MEETS", "MERE", "METER",
  "METERS", "METRE", "METRES", "MODEL", "MODELS", "MODEM", "MODEMS", "MODE", "MODES", "MODERN",
  "ADD", "ADDS", "ADDED", "ADDER", "DAD", "DADS", "DANCE", "DANCES", "DANCED", "DANCER",
  "DANCERS", "DENT", "DENTS", "DENSE", "DEN", "DENS", "DEMAND", "DEMANDS", "DOME", "DOMES",
  "DONE", "DONOR", "DONORS", "DOOR", "DOORS", "DOSE", "DOSES", "DOT", "DOTS", "DOTTED",
  "DRONE", "DRONES", "DRAMA", "DRAMAS", "DREAMS", "DREAMED", "DRESS", "DRESSES", "DRESSED", "LEMON",
  "LEMONS", "LAND", "LANDS", "LANDED", "LANE", "LANES", "LASTED", "LASS", "LASSO", "LEAD",
  "LEADS", "LEAN", "LEANS", "LEASE", "LEASES", "LEND", "LENDS", "LENT", "LENS", "LENSES",
  "LONE", "LONER", "LONERS", "LOAN", "LOANS", "LOAD", "LOADS", "LOCAL", "LOCALS", "LOCATE",
  "LOOM", "LOOMS", "LOOSE", "LOOSEN", "LORD", "LORDS", "LOSS", "LOSSES", "LOST", "LOT",
  "LOTS", "LOSE", "LOSES", "LOSER", "LOSERS", "COAST", "COASTS", "COAL", "COALS", "COAT",
  "COATS", "COASTAL", "CODE", "CODES", "CODED", "COD", "COLD", "COLON", "COLOR", "COLORS",
  "COME", "COMES", "COMET", "COMETS", "COMMA", "CONE", "CONES", "CONSOLE", "CONSTANT", "CONTACT",
  "CONTEST", "COSTS", "COT", "COTS", "COTTON", "CRAM", "CRAMS", "CRANE", "CRANES", "CRATER",
  "CRATERS", "CREASE", "CREAM", "CROSS", "CROSSES",
  "LESS", "LESSER", "LESSEN", "LESSENS", "LESSENED", "LESSON", "LESSONS",
  "TEST", "TESTS", "TESTED", "TESTER", "TESTERS", "TESTAMENT", "TESTAMENTS",
  "TELL", "TELLS", "TELLER", "TELLERS", "TOLD", "TOLL", "TOLLS", "TOLLED",
  "SCAM", "SCAMS", "SCAMMED", "SCAMMER", "SCAMMERS", "SCRAM", "SCRAMS",
  "SCREAM", "SCREAMS", "SCREAMED", "MASCOT", "MASCOTS", "SCORE", "SCORES", "SCORED",
  "AA", "AB", "AD", "AE", "AG", "AH", "AI", "AL", "AM", "AN", "AR", "AS", "AT", "AW", "AX", "AY",
  "BA", "BE", "BI", "BO", "BY", "DA", "DE", "DO", "EA", "ED", "EE", "EF", "EH", "EL", "EM",
  "EN", "ER", "ES", "ET", "EX", "FA", "FE", "GI", "GO", "HA", "HE", "HI", "HM", "HO", "ID",
  "IF", "IN", "IO", "IS", "IT", "JO", "KA", "KI", "LA", "LI", "LO", "MA", "ME", "MI", "MM",
  "MO", "MU", "MY", "NA", "NE", "NO", "NU", "OD", "OE", "OF", "OH", "OI", "OK", "OM", "ON",
  "OP", "OR", "OS", "OU", "OW", "OX", "OY", "PA", "PE", "PI", "PO", "QI", "RE", "SH", "SI",
  "SO", "ST", "TA", "TE", "TI", "TO", "UH", "UM", "UN", "UP", "US", "UT", "WE", "WO", "XI",
  "XU", "YA", "YE", "YO", "ZA",
];
const tileRacks = ["STARES", "STONER", "SCARET", "DREAMT", "SLATER"];
const tileBagLetters =
  "AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ";
function canMakeWord(word, rack) {
  const letters = [...rack];
  return [...word].every((letter) => {
    const i = letters.indexOf(letter);
    if (i < 0) return false;
    letters.splice(i, 1);
    return true;
  });
}

function renderWordTilesClassic() {
  activityShell("Word Tiles Classic", "Build a word of 3–5 letters from the shared six-letter rack. Each round has new letters. You and the computer each score one point per letter over five rounds. Only words in the built-in list count.", "Your points");
  let round = 0, player = 0, computer = 0, rack = "", finished = false;
  let options = [];
  const racks = shuffleActivity(tileRacks);
  $("activityContent").innerHTML = `
    <div id="tileRound"></div><div class="tile-rack" id="tileRack" aria-label="Available letters"></div>
    <details><summary>Show accepted words for this rack</summary><p id="tileDictionary"></p></details>
    <form class="puzzle-controls" id="tileForm">
      <label for="tileInput">Your word</label><input id="tileInput" autocomplete="off" maxlength="5" required aria-describedby="tileError">
      <button type="submit">Play word</button><button type="button" id="tilePass">Pass</button>
    </form><div id="tileError" role="alert"></div><div id="tileScores"></div><div id="tileFeedback"></div>
    <div class="puzzle-controls"><button id="tileRestart">New game</button></div>`;
  function showRound() {
    $("tileRound").textContent = `Round ${round + 1} of 5`;
    rack = shuffleActivity([...racks[round]]).join("");
    $("tileRack").innerHTML = [...rack].map((letter) => `<span>${letter}</span>`).join("");
    $("tileRack").setAttribute("aria-label", `Available letters: ${[...rack].join(", ")}`);
    options = [...new Set(tileWords)].filter((word) => word.length >= 3 && word.length <= 5 && canMakeWord(word, rack));
    $("tileDictionary").textContent = [...options].sort().join(", ");
    $("tileInput").value = "";
    $("tileInput").removeAttribute("aria-invalid");
    $("tileError").textContent = "";
    $("tileScores").textContent = `You: ${player} · Computer: ${computer}`;
    $("activityStatus").textContent = `Round ${round + 1}: make a word from the new letters.`;
  }
  function play(word) {
    if (finished) return;
    if (word && !options.includes(word)) {
      $("tileInput").setAttribute("aria-invalid", "true");
      $("tileError").textContent = word.length < 3 || word.length > 5
        ? "Enter a word of 3–5 letters."
        : canMakeWord(word, rack)
        ? `"${word}" is not in the built-in word list. Open the accepted words list or try another word.`
        : `"${word}" cannot be made from the current letters. Try another word.`;
      return;
    }
    const computerOptions = [...options].sort((a, b) => b.length - a.length || a.localeCompare(b));
    const computerWord = computerOptions[Math.floor(Math.random() * Math.min(4, computerOptions.length))];
    player += word.length;
    computer += computerWord.length;
    $("score").textContent = player;
    $("tileFeedback").textContent = `You played ${word || "nothing"}; computer played ${computerWord}.`;
    round++;
    if (round === 5) {
      finished = true;
      $("tileRound").textContent = "Game complete";
      $("tileScores").textContent = `You: ${player} · Computer: ${computer}`;
      $("activityStatus").textContent = player === computer ? "A tie!" : player > computer ? "You win!" : "The computer wins. Try again!";
      $("tileInput").disabled = true;
      $("tileForm").querySelectorAll("button").forEach((button) => { button.disabled = true; });
    } else showRound();
  }
  $("tileForm").onsubmit = (event) => {
    event.preventDefault();
    const word = $("tileInput").value.trim().toUpperCase();
    if (!word) {
      $("tileInput").setAttribute("aria-invalid", "true");
      $("tileError").textContent = "Enter a word, or choose Pass.";
      return;
    }
    play(word);
  };
  $("tilePass").onclick = () => play("");
  $("tileRestart").onclick = renderWordTilesClassic;
  showRound();
}

const tileBoardSize = 10;
const tileCenter = 4 * tileBoardSize + 4;
const tileValues = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
  N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
};
const tileDouble = new Set([3, 6, 12, 17, 30, 39, 60, 69, 82, 87, 93, 96]);
const tileTriple = new Set([0, 9, 22, 27, 32, 37, 62, 67, 72, 77, 90, 99]);
const tileDoubleWord = new Set([11, 18, 21, 28, 71, 78, 81, 88]);
const tileTripleWord = new Set([1, 8, 91, 98]);
const tileDictionary = new Set([...tileWords, ...tileAdditionalWords]);
let tileWordTrie;

function getTileWordTrie() {
  if (tileWordTrie) return tileWordTrie;
  tileWordTrie = {};
  for (const word of tileDictionary) {
    let node = tileWordTrie;
    for (const letter of word) {
      if (!node[letter]) node[letter] = {};
      node = node[letter];
    }
    node.word = word;
  }
  return tileWordTrie;
}

function tileMove(board, rack, word, row, col, direction) {
  if (!tileDictionary.has(word) || word.length < 2) return { error: "That word is not in the built-in word list." };
  const dr = direction === "down" ? 1 : 0, dc = direction === "across" ? 1 : 0;
  const inside = (r, c) => r >= 0 && r < tileBoardSize && c >= 0 && c < tileBoardSize;
  const at = (r, c) => inside(r, c) ? board[r * tileBoardSize + c] : null;
  const endRow = row + dr * (word.length - 1), endCol = col + dc * (word.length - 1);
  if (!inside(row, col) || !inside(endRow, endCol)) return { error: "The word does not fit on the board." };
  if (at(row - dr, col - dc) || at(endRow + dr, endCol + dc)) {
    return { error: "Enter the complete word, including the letters already on the board." };
  }
  const placed = [], crossWords = [];
  let connected = false, mainScore = 0, mainMultiplier = 1;
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i, c = col + dc * i, index = r * tileBoardSize + c;
    const existing = board[index], letter = word[i];
    if (existing && existing !== letter) return { error: "The word conflicts with a letter on the board." };
    if (existing) {
      connected = true;
      mainScore += tileValues[letter];
      continue;
    }
    placed.push({ index, letter });
    const multiplier = tileDouble.has(index) ? 2 : tileTriple.has(index) ? 3 : 1;
    const wordMultiplier = tileDoubleWord.has(index) ? 2 : tileTripleWord.has(index) ? 3 : 1;
    mainMultiplier *= wordMultiplier;
    mainScore += tileValues[letter] * multiplier;
    let before = "", after = "", crossScore = tileValues[letter] * multiplier;
    for (let step = 1; at(r - dc * step, c - dr * step); step++) {
      const crossLetter = at(r - dc * step, c - dr * step);
      before = crossLetter + before;
      crossScore += tileValues[crossLetter];
    }
    for (let step = 1; at(r + dc * step, c + dr * step); step++) {
      const crossLetter = at(r + dc * step, c + dr * step);
      after += crossLetter;
      crossScore += tileValues[crossLetter];
    }
    if (before || after) {
      connected = true;
      const crossWord = before + letter + after;
      if (!tileDictionary.has(crossWord)) return { error: `Cross word ${crossWord} is not in the built-in word list.` };
      crossWords.push({ word: crossWord, score: crossScore * wordMultiplier });
    }
  }
  if (!placed.length) return { error: "Place at least one new tile." };
  if (!canMakeWord(placed.map((tile) => tile.letter).join(""), rack)) return { error: "You do not have the letters needed for that word." };
  const empty = board.every((letter) => !letter);
  if (empty && !placed.some((tile) => tile.index === tileCenter)) return { error: "The first word must cover the center star." };
  if (!empty && !connected) return { error: "Connect your word to a letter already on the board." };
  return { placed, score: mainScore * mainMultiplier + crossWords.reduce((sum, cross) => sum + cross.score, 0), crossWords };
}

function bestTileMove(board, rack) {
  let best = null;
  const trie = getTileWordTrie(), counts = Object.create(null);
  for (const letter of rack) counts[letter] = (counts[letter] || 0) + 1;
  const letters = Object.keys(counts);
  const empty = board.every((letter) => !letter);
  for (const direction of ["across", "down"]) {
    const dr = direction === "down" ? 1 : 0, dc = direction === "across" ? 1 : 0;
    const inside = (r, c) => r >= 0 && r < tileBoardSize && c >= 0 && c < tileBoardSize;
    const at = (r, c) => inside(r, c) ? board[r * tileBoardSize + c] : null;
    const crossCache = new Map();
    function crossAt(row, col) {
      const index = row * tileBoardSize + col;
      if (crossCache.has(index)) return crossCache.get(index);
      let before = "", after = "";
      for (let step = 1; at(row - dc * step, col - dr * step); step++) before = at(row - dc * step, col - dr * step) + before;
      for (let step = 1; at(row + dc * step, col + dr * step); step++) after += at(row + dc * step, col + dr * step);
      const cross = { before, after };
      crossCache.set(index, cross);
      return cross;
    }
    for (let row = 0; row < tileBoardSize; row++) {
      for (let col = 0; col < tileBoardSize; col++) {
        if (at(row - dr, col - dc)) continue;
        if (empty && (direction === "across" ? row !== Math.floor(tileCenter / tileBoardSize) || col > tileCenter % tileBoardSize : col !== tileCenter % tileBoardSize || row > Math.floor(tileCenter / tileBoardSize))) continue;
        function search(node, r, c, placed) {
          if (!inside(r, c)) return;
          const existing = at(r, c);
          if (existing) {
            const child = node[existing];
            if (child) visit(child, r, c, placed);
          } else {
            const cross = crossAt(r, c);
            for (const letter of letters) {
              const child = node[letter];
              if (!counts[letter] || !child) continue;
              if ((cross.before || cross.after) && !tileDictionary.has(cross.before + letter + cross.after)) continue;
              counts[letter]--;
              visit(child, r, c, placed + 1);
              counts[letter]++;
            }
          }
        }
        function visit(node, r, c, placed) {
          if (node.word && placed && !at(r + dr, c + dc)) {
            const move = tileMove(board, rack, node.word, row, col, direction);
            if (!move.error && (!best || move.score > best.score)) best = { ...move, word: node.word, row, col, direction };
          }
          search(node, r + dr, c + dc, placed);
        }
        search(trie, row, col, 0);
      }
    }
  }
  return best;
}

function renderWordTiles(first = "player") {
  activityShell("Word Tiles", "Play against the computer on a 10 × 10 board. Select the first square and direction, then enter the complete word, including any board letters. The first word covers the star; later words must connect. Each player keeps unused tiles and draws back up to six. Only the built-in word list counts.", "Your points");
  let board = Array(tileBoardSize * tileBoardSize).fill(null), player = 0, computer = 0, selected = tileCenter, passes = 0, finished = false;
  const racks = shuffleActivity(tileRacks);
  let playerRack = racks[0], computerRack = racks[1];
  const bag = shuffleActivity([...tileBagLetters]);
  $("activityContent").innerHTML = `
    <p>Letter values are shown on the tiles. DL and TL double or triple a newly placed letter; DW and TW double or triple each word it makes. Bonuses are used only once, and multiple word bonuses multiply together. Two consecutive passes end the game, as does emptying a rack when the bag is empty.</p>
    <div class="puzzle-controls">
      <label for="tileFirst">First turn (next game)</label><select id="tileFirst"><option value="player">You</option><option value="computer">Computer</option></select>
      <button id="tileRestart">New game</button>
    </div>
    <div id="tileBoard" class="tile-board" style="--tile-columns: ${tileBoardSize}" aria-label="Word Tiles board"></div>
    <div id="tileBag"></div><div class="tile-rack" id="tileRack" aria-label="Available letters"></div>
    <details id="tileWordList"><summary>Show built-in word list</summary><p id="tileDictionary"></p></details>
    <form class="puzzle-controls" id="tileForm">
      <label for="tileDirection">Direction</label><select id="tileDirection"><option value="across">Across</option><option value="down">Down</option></select>
      <label for="tileInput">Complete word</label><input id="tileInput" autocomplete="off" maxlength="${tileBoardSize}" required aria-describedby="tileError">
      <button type="submit">Play word</button><button type="button" id="tilePass">Pass</button>
    </form><div id="tileError" role="alert"></div><div id="tileScores"></div><div id="tileFeedback"></div>`;
  $("tileFirst").value = first;
  $("tileFeedback").textContent = "";
  $("tileWordList").ontoggle = () => {
    if ($("tileWordList").open && !$("tileDictionary").textContent) {
      $("tileDictionary").textContent = [...tileDictionary].sort().join(", ");
    }
  };
  function draw() {
    $("tileBoard").innerHTML = board.map((letter, index) => {
      const bonus = tileDouble.has(index) ? "DL" : tileTriple.has(index) ? "TL" : tileDoubleWord.has(index) ? "DW" : tileTripleWord.has(index) ? "TW" : index === tileCenter ? "★" : "";
      const description = letter ? `${letter}, ${tileValues[letter]} points` : bonus === "DL" ? "double letter" : bonus === "TL" ? "triple letter" : bonus === "DW" ? "double word" : bonus === "TW" ? "triple word" : bonus ? "center star" : "empty";
      const style = letter ? "occupied" : bonus === "DL" ? "double" : bonus === "TL" ? "triple" : bonus === "DW" ? "double-word" : bonus === "TW" ? "triple-word" : "";
      return `<button type="button" class="tile-square ${style} ${selected === index ? "selected" : ""}" data-index="${index}" aria-label="Row ${Math.floor(index / tileBoardSize) + 1}, column ${index % tileBoardSize + 1}, ${description}" aria-pressed="${selected === index}">${letter ? `${letter}<small>${tileValues[letter]}</small>` : bonus}</button>`;
    }).join("");
    $("tileBoard").querySelectorAll("button").forEach((button) => {
      button.onclick = () => {
        selected = Number(button.dataset.index);
        draw();
        $("tileBoard").querySelector(`[data-index="${selected}"]`).focus();
      };
    });
    $("tileRack").innerHTML = [...playerRack].map((letter) => `<span>${letter}<small>${tileValues[letter]}</small></span>`).join("");
    $("tileRack").setAttribute("aria-label", `Available letters: ${[...playerRack].join(", ")}`);
    $("tileBag").textContent = `${bag.length} tiles left in the bag.`;
    $("tileScores").textContent = `You: ${player} · Computer: ${computer}`;
    $("score").textContent = player;
  }
  function applyMove(move, rack) {
    for (const tile of move.placed) {
      board[tile.index] = tile.letter;
      rack = rack.replace(tile.letter, "");
    }
    while (rack.length < 6 && bag.length) rack += bag.pop();
    return rack;
  }
  function endGame() {
    finished = true;
    $("activityStatus").textContent = `Game over. ${player === computer ? "A tie!" : player > computer ? "You win!" : "The computer wins!"}`;
    $("tileInput").disabled = true;
    $("tileDirection").disabled = true;
    $("tileForm").querySelectorAll("button").forEach((button) => { button.disabled = true; });
  }
  function computerTurn() {
    const move = bestTileMove(board, computerRack);
    if (move) {
      computerRack = applyMove(move, computerRack);
      computer += move.score;
      passes = 0;
      $("tileFeedback").textContent = [$("tileFeedback").textContent, `Computer played ${move.word} for ${move.score} points.`].filter(Boolean).join(" ");
    } else {
      passes++;
      $("tileFeedback").textContent = [$("tileFeedback").textContent, "Computer passed."].filter(Boolean).join(" ");
    }
    draw();
    if (passes >= 2 || (!bag.length && !computerRack.length)) endGame();
    else $("activityStatus").textContent = "Your turn. Select the first square of your word.";
  }
  $("tileForm").onsubmit = (event) => {
    event.preventDefault();
    if (finished) return;
    const word = $("tileInput").value.trim().toUpperCase();
    if (!word) {
      $("tileInput").setAttribute("aria-invalid", "true");
      $("tileError").textContent = "Enter a word, or choose Pass.";
      return;
    }
    const move = tileMove(board, playerRack, word, Math.floor(selected / tileBoardSize), selected % tileBoardSize, $("tileDirection").value);
    if (move.error) {
      $("tileInput").setAttribute("aria-invalid", "true");
      $("tileError").textContent = move.error;
      return;
    }
    playerRack = applyMove(move, playerRack);
    player += move.score;
    passes = 0;
    $("tileInput").value = "";
    $("tileInput").removeAttribute("aria-invalid");
    $("tileError").textContent = "";
    $("tileFeedback").textContent = `You played ${word} for ${move.score} points.`;
    draw();
    if (!bag.length && !playerRack.length) endGame();
    else computerTurn();
  };
  $("tilePass").onclick = () => {
    if (finished) return;
    $("tileInput").removeAttribute("aria-invalid");
    $("tileError").textContent = "";
    $("tileFeedback").textContent = "You passed.";
    passes++;
    if (passes >= 2) { draw(); endGame(); }
    else computerTurn();
  };
  $("tileRestart").onclick = () => renderWordTiles($("tileFirst").value);
  draw();
  if (first === "computer") computerTurn();
  else $("activityStatus").textContent = "Your turn. Select the first square of your word.";
}

const wordGuessAnswers = [
  "APPLE", "BEACH", "BERRY", "BREAD", "BRICK", "BROWN", "CHAIR", "CHEST",
  "CLOUD", "CRANE", "DANCE", "DREAM", "EARTH", "FIELD", "FLAME", "FLOOR",
  "FOCUS", "FRAME", "FRESH", "FRUIT", "GLASS", "GRAPE",
  "GRASS", "GREEN", "HEART", "HOUSE", "LIGHT", "LUNCH", "MAPLE", "MIGHT",
  "MOUSE", "MUSIC", "NIGHT", "OCEAN", "PAINT", "PAPER", "PEACH", "PIANO",
  "PLANT", "PLATE", "RIVER", "ROBIN", "ROUND", "SHEEP", "SHINE", "SMILE",
  "SNAKE", "SNOWY", "SOLAR", "SPACE", "SPOON", "STONE", "STORM",
  "SUGAR", "SUNNY", "TABLE", "TIGER", "TRAIN", "WATER", "WHEAT", "WORLD",
];

function scoreWordGuess(answer, guess) {
  const result = Array(5).fill("absent"), remaining = {};
  for (let i = 0; i < 5; i++) {
    if (guess[i] === answer[i]) result[i] = "correct";
    else remaining[answer[i]] = (remaining[answer[i]] || 0) + 1;
  }
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    if (remaining[guess[i]] > 0) {
      result[i] = "present";
      remaining[guess[i]]--;
    }
  }
  return result;
}

function renderWordGuess() {
  activityShell("Word Guess", "Guess the five-letter word in six tries. Green means the right position, gold means the letter is elsewhere, and grey means no matching letter remains. Repeated letters are counted. Any five letters from A to Z are accepted as a guess.", "Guesses used");
  let answer = "", guesses = [], finished = false;
  $("scoreTotal").textContent = " / 6";
  $("activityContent").innerHTML = `
    <p class="activity-intro">Each tile also shows a marker: ✓ right place, ↔ elsewhere, − no match remaining.</p>
    <div id="guessBoard" class="guess-board" aria-label="Guess history"></div>
    <form class="puzzle-controls" id="guessForm" novalidate>
      <label for="guessInput">Your guess</label>
      <input id="guessInput" maxlength="5" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="guessError">
      <button type="submit" id="guessSubmit">Guess</button>
    </form>
    <div id="guessError" role="alert"></div>
    <div class="puzzle-controls"><button id="guessNew">New word</button></div>`;
  function draw() {
    $("guessBoard").innerHTML = Array.from({ length: 6 }, (_, row) => {
      const entry = guesses[row];
      return `<div class="guess-row" role="group" aria-label="Guess ${row + 1}">${Array.from({ length: 5 }, (_, col) => {
        if (!entry) return `<span class="guess-cell empty" aria-label="Empty"></span>`;
        const state = entry.result[col];
        const labels = { correct: "correct position", present: "elsewhere", absent: "no match remaining" };
        const markers = { correct: "✓", present: "↔", absent: "−" };
        return `<span class="guess-cell ${state}" aria-label="${entry.word[col]}: ${labels[state]}">${entry.word[col]}<small aria-hidden="true">${markers[state]}</small></span>`;
      }).join("")}</div>`;
    }).join("");
  }
  function start() {
    const options = wordGuessAnswers.filter((word) => word !== answer);
    answer = options[Math.floor(Math.random() * options.length)];
    guesses = [];
    finished = false;
    $("score").textContent = "0";
    $("guessInput").disabled = false;
    $("guessInput").value = "";
    $("guessInput").removeAttribute("aria-invalid");
    $("guessSubmit").disabled = false;
    $("guessError").textContent = "";
    $("activityStatus").textContent = "Enter your first five-letter guess.";
    draw();
  }
  $("guessForm").onsubmit = (event) => {
    event.preventDefault();
    if (finished) return;
    const word = $("guessInput").value.trim().toUpperCase();
    if (!/^[A-Z]{5}$/.test(word)) {
      $("guessInput").setAttribute("aria-invalid", "true");
      $("guessError").textContent = "Enter exactly five letters from A to Z.";
      return;
    }
    $("guessInput").removeAttribute("aria-invalid");
    $("guessError").textContent = "";
    guesses.push({ word, result: scoreWordGuess(answer, word) });
    $("score").textContent = guesses.length;
    draw();
    if (word === answer || guesses.length === 6) {
      finished = true;
      $("guessInput").disabled = true;
      $("guessSubmit").disabled = true;
      $("activityStatus").textContent = word === answer
        ? `You found ${answer} in ${guesses.length} ${guesses.length === 1 ? "guess" : "guesses"}!`
        : `Out of guesses. The word was ${answer}.`;
    } else {
      $("activityStatus").textContent = `Guess ${guesses.length} recorded. ${6 - guesses.length} remaining.`;
      $("guessInput").value = "";
      $("guessInput").focus();
    }
  };
  $("guessNew").onclick = start;
  start();
}

function renderMatching() {
  activityShell("Card Matching", "Turn over two cards at a time and find the matching pairs. The cards use both pictures and names.", "Pairs found");
  const icons = [["☀", "Sun"], ["★", "Star"], ["◆", "Diamond"], ["♥", "Heart"], ["♣", "Club"], ["☂", "Umbrella"], ["✿", "Flower"], ["☾", "Moon"]];
  let cards, open, found, locked, moves;
  $("activityContent").innerHTML = `<div id="matchGrid" class="puzzle-grid matching-grid" style="--columns: 4"></div><div class="puzzle-controls"><button id="matchNew">New game</button></div>`;
  function start() {
    clearActivity();
    cards = shuffleActivity([...icons, ...icons].map((item) => ({ icon: item[0], name: item[1] })));
    open = []; found = new Set(); locked = false; moves = 0;
    $("score").textContent = "0";
    $("scoreTotal").textContent = " / 8";
    $("activityStatus").textContent = "Choose two cards.";
    draw();
  }
  function draw() {
    const focusedCard = $("matchGrid").contains(document.activeElement) ? document.activeElement.dataset.card : null;
    $("matchGrid").innerHTML = cards.map((card, i) => {
      const visible = open.includes(i) || found.has(i);
      return `<button class="puzzle-cell ${found.has(i) ? "found" : ""}" data-card="${i}" aria-label="Card ${i + 1}: ${visible ? card.name : "hidden"}" ${found.has(i) ? "disabled" : ""}>${visible ? `${card.icon}<span class="card-name">${card.name}</span>` : "?"}</button>`;
    }).join("");
    if (focusedCard !== null) {
      const target = $("matchGrid").querySelector(`[data-card="${focusedCard}"]:not(:disabled)`) || $("matchGrid").querySelector("button:not(:disabled)") || $("matchNew");
      target.focus({ preventScroll: true });
    }
  }
  $("matchGrid").onclick = (event) => {
    const button = event.target.closest("[data-card]");
    if (!button || locked) return;
    const i = Number(button.dataset.card);
    if (open.includes(i) || found.has(i)) return;
    open.push(i);
    draw();
    if (open.length === 2) {
      moves++;
      if (cards[open[0]].name === cards[open[1]].name) {
        open.forEach((card) => found.add(card));
        open = [];
        $("score").textContent = found.size / 2;
        $("activityStatus").textContent = found.size === cards.length ? `All pairs found in ${moves} turns!` : "A match! Choose two more cards.";
        draw();
      } else {
        locked = true;
        $("activityStatus").textContent = "Not a match. Remember the cards and try again.";
        later(() => { open = []; locked = false; draw(); }, 1100);
      }
    }
    const focusTarget = $("matchGrid").querySelector(`[data-card="${i}"]:not(:disabled)`) || $("matchGrid").querySelector("button:not(:disabled)") || $("matchNew");
    focusTarget.focus({ preventScroll: true });
  };
  $("matchNew").onclick = start;
  start();
}

const jigsawScenes = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#b9dded"/><circle cx="238" cy="58" r="30" fill="#f3c658"/><path d="M0 220L85 105L150 188L205 120L300 230V300H0Z" fill="#719b85"/><path d="M0 250Q75 185 155 245T300 225V300H0Z" fill="#426b4d"/><path d="M90 105L67 136H113Z" fill="#fffefa"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#f7dcaa"/><circle cx="150" cy="104" r="39" fill="#f0a768"/><path d="M0 195Q75 175 150 195T300 195V300H0Z" fill="#7fb5c3"/><path d="M0 240Q75 220 150 240T300 240V300H0Z" fill="#488a9d"/><path d="M92 186L150 112L150 186Z" fill="#fffefa"/><path d="M83 193H201L185 211H103Z" fill="#654e42"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#e1edcd"/><rect y="232" width="300" height="68" fill="#8ab075"/><path d="M151 230V90" stroke="#426b4d" stroke-width="12"/><circle cx="150" cy="64" r="24" fill="#efb25f"/><circle cx="117" cy="88" r="24" fill="#eea1a0"/><circle cx="183" cy="88" r="24" fill="#eea1a0"/><circle cx="130" cy="122" r="24" fill="#eea1a0"/><circle cx="170" cy="122" r="24" fill="#eea1a0"/><circle cx="150" cy="92" r="20" fill="#f5d875"/><path d="M149 188Q102 153 85 186Q115 207 149 198M153 170Q195 140 217 169Q191 193 153 184" fill="#426b4d"/></svg>`,
];
function renderJigsaw() {
  activityShell("Jigsaw", "Select two pieces to swap them and rebuild the picture. The small numbers show the original position, from 1 at the top left to 9 at the bottom right.", "Pictures completed");
  let scene = 0, tiles, selected, completed = 0, finished;
  $("activityContent").innerHTML = `<div id="jigsawGrid" class="puzzle-grid jigsaw-grid" style="--columns: 3"></div><div class="puzzle-controls"><button id="jigsawNew">Next picture</button></div>`;
  function start() {
    do { tiles = shuffleActivity([0, 1, 2, 3, 4, 5, 6, 7, 8]); } while (tiles.every((tile, i) => tile === i));
    selected = null; finished = false;
    $("activityStatus").textContent = "Choose two pieces to swap.";
    draw();
  }
  function draw() {
    const url = `data:image/svg+xml,${encodeURIComponent(jigsawScenes[scene])}`;
    $("jigsawGrid").innerHTML = tiles.map((tile, i) =>
      `<button class="puzzle-cell ${selected === i ? "selected" : ""}" data-piece="${i}" aria-label="Position ${i + 1}, piece ${tile + 1}" style="background-image:url('${url}');background-position:${(tile % 3) * 50}% ${Math.floor(tile / 3) * 50}%">${tile + 1}</button>`,
    ).join("");
  }
  $("jigsawGrid").onclick = (event) => {
    const button = event.target.closest("[data-piece]");
    if (!button || finished) return;
    const i = Number(button.dataset.piece);
    if (selected === null) {
      selected = i;
      $("activityStatus").textContent = "Choose another piece to swap.";
    } else {
      [tiles[selected], tiles[i]] = [tiles[i], tiles[selected]];
      selected = null;
      if (tiles.every((tile, index) => tile === index)) {
        finished = true;
        $("score").textContent = ++completed;
        $("activityStatus").textContent = "Picture complete! Choose the next picture.";
      } else $("activityStatus").textContent = "Choose two pieces to swap.";
    }
    draw();
    $("jigsawGrid").querySelector(`[data-piece="${i}"]`).focus({ preventScroll: true });
  };
  $("jigsawNew").onclick = () => { scene = (scene + 1) % jigsawScenes.length; start(); };
  start();
}

function renderDifferences() {
  activityShell("Spot the Difference", "Compare the two pictures and select the squares that differ in the right-hand picture. Symbols and colors both help identify each item.", "Differences found");
  const symbols = [["☀", "sun"], ["★", "star"], ["♥", "heart"], ["♣", "club"], ["◆", "diamond"], ["☂", "umbrella"], ["✿", "flower"], ["☾", "moon"], ["▲", "triangle"], ["●", "circle"]];
  let left, right, differences, found;
  $("activityContent").innerHTML = `<div class="difference-boards"><div><strong>Original</strong><div id="differenceLeft" class="puzzle-grid" style="--columns: 4"></div></div><div><strong>Find changes here</strong><div id="differenceRight" class="puzzle-grid" style="--columns: 4"></div></div></div><div class="puzzle-controls"><button id="differenceNew">New puzzle</button></div>`;
  function start() {
    left = Array.from({ length: 16 }, () => symbols[Math.floor(Math.random() * symbols.length)]);
    right = [...left];
    differences = new Set(shuffleActivity([...Array(16).keys()]).slice(0, 4));
    differences.forEach((i) => {
      const options = symbols.filter((item) => item !== left[i]);
      right[i] = options[Math.floor(Math.random() * options.length)];
    });
    found = new Set();
    $("score").textContent = "0";
    $("scoreTotal").textContent = " / 4";
    $("activityStatus").textContent = "Find four changed symbols.";
    draw();
  }
  function draw() {
    $("differenceLeft").innerHTML = left.map(([icon, name], i) => `<span class="puzzle-cell" style="display:grid;place-items:center" aria-label="Position ${i + 1}: ${name}">${icon}</span>`).join("");
    $("differenceRight").innerHTML = right.map(([icon, name], i) => `<button class="puzzle-cell ${found.has(i) ? "found" : ""}" data-difference="${i}" aria-label="Position ${i + 1}: ${name}${found.has(i) ? ", found" : ""}" ${found.has(i) ? "disabled" : ""}>${icon}</button>`).join("");
  }
  $("differenceRight").onclick = (event) => {
    const button = event.target.closest("[data-difference]");
    if (!button) return;
    const i = Number(button.dataset.difference);
    if (differences.has(i)) {
      found.add(i);
      $("score").textContent = found.size;
      $("activityStatus").textContent = found.size === 4 ? "You found all four differences!" : "That's different. Keep looking!";
      draw();
      const next = $("differenceRight").querySelector("button:not(:disabled)") || $("differenceNew");
      next.focus({ preventScroll: true });
    } else $("activityStatus").textContent = "Those symbols match. Try another square.";
  };
  $("differenceNew").onclick = start;
  start();
}

const cubeFaces = [
  { name: "Front", key: "F", normal: [0, 0, 1], right: [1, 0, 0], down: [0, -1, 0], color: "#e77467" },
  { name: "Back", key: "B", normal: [0, 0, -1], right: [-1, 0, 0], down: [0, -1, 0], color: "#e7a74f" },
  { name: "Top", key: "U", normal: [0, 1, 0], right: [1, 0, 0], down: [0, 0, 1], color: "#fffefa" },
  { name: "Bottom", key: "D", normal: [0, -1, 0], right: [1, 0, 0], down: [0, 0, -1], color: "#f4dc78" },
  { name: "Left", key: "L", normal: [-1, 0, 0], right: [0, 0, 1], down: [0, -1, 0], color: "#86c889" },
  { name: "Right", key: "R", normal: [1, 0, 0], right: [0, 0, -1], down: [0, -1, 0], color: "#a9c7f8" },
];
function makeCube() {
  return cubeFaces.flatMap((face) => Array.from({ length: 9 }, (_, i) => ({
    position: face.normal.map((value, axis) => value + face.right[axis] * (i % 3 - 1) + face.down[axis] * (Math.floor(i / 3) - 1)),
    normal: [...face.normal],
    color: face.key,
  })));
}
function rotateCubeVector(vector, axis, direction) {
  const [x, y, z] = vector;
  if (axis === 0) return [x, -direction * z, direction * y];
  if (axis === 1) return [direction * z, y, -direction * x];
  return [-direction * y, direction * x, z];
}
function turnCube(cube, face, clockwise = true) {
  const axis = face.normal.findIndex((value) => value !== 0), sign = face.normal[axis];
  const direction = (clockwise ? -1 : 1) * sign;
  cube.forEach((sticker) => {
    if (sticker.position[axis] === sign) {
      sticker.position = rotateCubeVector(sticker.position, axis, direction);
      sticker.normal = rotateCubeVector(sticker.normal, axis, direction);
    }
  });
}
function cubeSolved(cube) {
  return cubeFaces.every((face) => new Set(cube.filter((s) => s.normal.every((n, i) => n === face.normal[i])).map((s) => s.color)).size === 1);
}
function renderColorCube() {
  activityShell("Color Cube", "A virtual 3 × 3 twisting cube shown as six flat faces. Turn a face clockwise or counterclockwise as viewed directly from that face. Match all nine stickers on each face. Letter labels identify colors.", "Cubes solved");
  let cube = makeCube(), moves = 0, wasScrambled = false, completed = 0;
  $("activityContent").innerHTML = `<div class="puzzle-controls"><button id="cubeScramble">Scramble</button><button id="cubeReset">Reset solved cube</button></div><div id="cubeFaces" class="cube-layout"></div><div id="cubeControls" class="puzzle-controls"></div>`;
  function draw() {
    $("cubeFaces").innerHTML = cubeFaces.map((face) => {
      const stickers = cube.filter((s) => s.normal.every((n, i) => n === face.normal[i]));
      return `<div class="cube-face"><h3>${face.name} (${face.key})</h3><div class="puzzle-grid" style="--columns: 3">${Array.from({ length: 9 }, (_, i) => {
        const pos = face.normal.map((value, axis) => value + face.right[axis] * (i % 3 - 1) + face.down[axis] * (Math.floor(i / 3) - 1));
        const sticker = stickers.find((s) => s.position.every((n, axis) => n === pos[axis]));
        const color = cubeFaces.find((f) => f.key === sticker.color);
        return `<span class="cube-sticker" style="background:${color.color}" aria-label="${color.name} color">${sticker.color}</span>`;
      }).join("")}</div></div>`;
    }).join("");
    $("cubeControls").innerHTML = cubeFaces.map((face, i) => `<button data-face="${i}" data-direction="1" aria-label="Turn ${face.name} clockwise">${face.key} ↻</button><button data-face="${i}" data-direction="-1" aria-label="Turn ${face.name} counterclockwise">${face.key} ↺</button>`).join("");
  }
  $("cubeControls").onclick = (event) => {
    const button = event.target.closest("[data-face]");
    if (!button) return;
    turnCube(cube, cubeFaces[Number(button.dataset.face)], button.dataset.direction === "1");
    moves++;
    if (wasScrambled && cubeSolved(cube)) {
      wasScrambled = false;
      $("score").textContent = ++completed;
      $("activityStatus").textContent = `Cube solved in ${moves} moves!`;
    } else $("activityStatus").textContent = `${moves} moves. ${cubeSolved(cube) ? "Cube is solved." : "Keep matching the faces."}`;
    draw();
    $("cubeControls").querySelector(`[data-face="${button.dataset.face}"][data-direction="${button.dataset.direction}"]`).focus({ preventScroll: true });
  };
  $("cubeScramble").onclick = () => {
    do {
      cube = makeCube();
      for (let i = 0; i < 12; i++) turnCube(cube, cubeFaces[Math.floor(Math.random() * 6)], Math.random() < 0.5);
    } while (cubeSolved(cube));
    moves = 0; wasScrambled = true;
    $("activityStatus").textContent = "Cube scrambled. Use the face turns to solve it.";
    draw();
  };
  $("cubeReset").onclick = () => {
    cube = makeCube(); moves = 0; wasScrambled = false;
    $("activityStatus").textContent = "Solved cube restored. Press scramble to play.";
    draw();
  };
  $("activityStatus").textContent = "Press scramble to play.";
  draw();
}

function makeCheckersBoard() {
  return Array.from({ length: 64 }, (_, i) => {
    const row = Math.floor(i / 8), col = i % 8;
    if ((row + col) % 2 === 0 || (row >= 3 && row <= 4)) return null;
    return { side: row < 3 ? "computer" : "player", king: false };
  });
}
function checkersMoves(board, side, onlyFrom = null) {
  const captures = [], steps = [];
  board.forEach((piece, from) => {
    if (!piece || piece.side !== side || (onlyFrom !== null && from !== onlyFrom)) return;
    const row = Math.floor(from / 8), col = from % 8;
    const directions = piece.king ? [-1, 1] : [side === "player" ? -1 : 1];
    directions.forEach((dr) => [-1, 1].forEach((dc) => {
      const r = row + dr, c = col + dc;
      if (r < 0 || r > 7 || c < 0 || c > 7) return;
      const target = r * 8 + c;
      if (!board[target] && onlyFrom === null) steps.push({ from, to: target, captured: null });
      if (board[target] && board[target].side !== side) {
        const jumpRow = row + dr * 2, jumpCol = col + dc * 2;
        if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8 && !board[jumpRow * 8 + jumpCol])
          captures.push({ from, to: jumpRow * 8 + jumpCol, captured: target });
      }
    }));
  });
  return captures.length ? captures : onlyFrom === null ? steps : [];
}
function applyCheckersMove(board, move) {
  const piece = board[move.from];
  board[move.from] = null;
  board[move.to] = piece;
  if (move.captured !== null) board[move.captured] = null;
  const row = Math.floor(move.to / 8);
  const crowned = !piece.king && (piece.side === "player" ? row === 0 : row === 7);
  if (crowned) piece.king = true;
  return crowned;
}
function renderCheckers() {
  activityShell("Checkers", "Play light pieces against the computer. Move diagonally forward; kings move both ways. Captures are mandatory, including multiple jumps. A piece crowned during a jump ends its turn.", "Games won");
  let board, side, selected, forced, finished, quietMoves, wins = 0;
  $("activityContent").innerHTML = `<div id="checkersBoard" class="puzzle-grid checkers-grid" style="--columns: 8" role="group" aria-label="Checkers board"></div><div class="puzzle-controls"><button id="checkersNew">New game</button></div>`;
  function start() {
    clearActivity();
    board = makeCheckersBoard(); side = "player"; selected = null; forced = null; finished = false; quietMoves = 0;
    $("activityStatus").textContent = "Your turn. Select a light piece.";
    draw();
  }
  function draw() {
    const focusedSquare = $("checkersBoard").contains(document.activeElement) ? document.activeElement.dataset.square : null;
    $("checkersBoard").innerHTML = board.map((piece, i) => {
      const row = Math.floor(i / 8), col = i % 8, dark = (row + col) % 2 === 1;
      const description = piece ? `${piece.side === "player" ? "your" : "computer"} ${piece.king ? "king" : "piece"}` : "empty";
      return `<button class="puzzle-cell ${dark ? "dark" : "light"} ${selected === i ? "selected" : ""}" data-square="${i}" aria-label="Row ${row + 1}, column ${col + 1}: ${description}">${piece ? `<span class="checkers-piece ${piece.side}" aria-hidden="true">${piece.king ? "K" : ""}</span>` : ""}</button>`;
    }).join("");
    if (focusedSquare !== null) $("checkersBoard").querySelector(`[data-square="${focusedSquare}"]`).focus({ preventScroll: true });
  }
  function endGame(winner) {
    finished = true;
    if (winner === "player") {
      $("score").textContent = ++wins;
      $("activityStatus").textContent = "You win! The computer has no legal moves.";
    } else if (winner === "computer") $("activityStatus").textContent = "The computer wins. You have no legal moves.";
    else $("activityStatus").textContent = "Draw: 80 turns without a capture or promotion.";
  }
  function changeTurn() {
    selected = null;
    forced = null;
    side = side === "player" ? "computer" : "player";
    if (!checkersMoves(board, side).length) endGame(side === "player" ? "computer" : "player");
    else if (quietMoves >= 80) endGame(null);
    else if (side === "computer") {
      $("activityStatus").textContent = "Computer is thinking.";
      later(computerTurn, 450);
    } else $("activityStatus").textContent = checkersMoves(board, side)[0].captured !== null
      ? "Your turn. A capture is required."
      : "Your turn. Select a light piece.";
    draw();
  }
  function makeMove(move) {
    const crowned = applyCheckersMove(board, move);
    quietMoves = move.captured !== null || crowned ? 0 : quietMoves + 1;
    if (move.captured !== null && !crowned && checkersMoves(board, side, move.to).length) {
      forced = move.to;
      selected = move.to;
      if (side === "computer") {
        draw();
        later(computerTurn, 450);
      } else {
        $("activityStatus").textContent = "Continue jumping with the same piece.";
        draw();
      }
    } else changeTurn();
  }
  function computerTurn() {
    if (finished || side !== "computer") return;
    const moves = checkersMoves(board, side, forced);
    const ranked = moves.map((move) => ({
      move,
      value: (move.captured !== null ? 10 : 0) + (Math.floor(move.to / 8) === 7 ? 5 : 0) + Math.random(),
    })).sort((a, b) => b.value - a.value);
    makeMove(ranked[0].move);
  }
  $("checkersBoard").onclick = (event) => {
    const button = event.target.closest("[data-square]");
    if (!button || finished || side !== "player") return;
    const square = Number(button.dataset.square);
    const moves = checkersMoves(board, "player", forced);
    const move = moves.find((candidate) => candidate.from === selected && candidate.to === square);
    if (move) { makeMove(move); return; }
    if (moves.some((candidate) => candidate.from === square)) {
      selected = square;
      $("activityStatus").textContent = "Piece selected. Choose an empty legal destination.";
      draw();
      $("checkersBoard").querySelector(`[data-square="${square}"]`).focus({ preventScroll: true });
    } else {
      $("activityStatus").textContent = forced !== null ? "Continue jumping with the same piece." : moves[0].captured !== null ? "A capture is required. Select a piece that can jump." : "Select a movable light piece, then an empty diagonal square.";
    }
  };
  $("checkersNew").onclick = start;
  start();
}
