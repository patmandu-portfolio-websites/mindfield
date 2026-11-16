const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "additional-games.js"), "utf8");
const games = vm.runInNewContext(`${source}; additionalGames`, {});

test("animated and sound games each contain two complete, varied sets", () => {
  for (const name of ["Animated puzzles", "Sound"]) {
    const sets = games[name];
    assert.equal(sets.length, 2);
    for (const set of sets) {
      assert.equal(set.length, 8);
      assert.ok(new Set(set.map((puzzle) => puzzle.q)).size >= 7);
      for (const puzzle of set) {
        assert.equal(puzzle.choices.length, 4);
        assert.equal(new Set(puzzle.choices).size, 4);
        assert.ok(puzzle.answer >= 0 && puzzle.answer < puzzle.choices.length);
        assert.ok(puzzle.hint && puzzle.explain);
      }
    }
  }
  for (const set of games["Animated puzzles"]) {
    assert.equal(new Set(set.map((puzzle) => puzzle.motion)).size, 5);
  }
});

test("sound clues match their stated answers and include rests", () => {
  const expected = [
    { sound: [220, 330, 440], answer: "Up" },
    { sound: [440, 330, 220], answer: "Third" },
    { sound: [330, 330, 330, 330], answer: "4" },
    { sound: [330, 0, 330, 330], answer: "Beep, rest, beep, beep" },
    { sound: [220, 440, 220, 440], answer: "Low" },
    { sound: [220, 440, 220], answer: "First and third" },
    { sound: [330, 0, 0, 330], answer: "2" },
    { sound: [440, 220, 330], answer: "First" },
    { sound: [220, 330, 220, 330, 220, 330], answer: "Low, then high" },
    { sound: [330, 330, 0, 330], answer: "Beep, beep, rest, beep" },
    { sound: [330, 440, 330], answer: "Rises then falls" },
    { sound: [220, 220, 440, 220, 220, 440], answer: "2" },
    { sound: [330, 0, 330, 0, 330], answer: "3" },
    { sound: [440, 220, 330, 220], answer: "First" },
    { sound: [330, 330, 440, 330], answer: "Third" },
    { sound: [440, 330, 220, 330], answer: "It rises" },
  ];
  games.Sound.flat().forEach((puzzle, i) => {
    assert.deepEqual([...puzzle.sound], expected[i].sound);
    assert.equal(puzzle.choices[puzzle.answer], expected[i].answer);
  });
});
