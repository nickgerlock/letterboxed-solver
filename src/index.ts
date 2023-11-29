import { findSolutions } from './letter_boxed_solver.js';
import { makeNewGame } from './state.js';

const testGame = makeNewGame({
  // left: ["H", "T", "A"],
  // top: ["R", "P", "I"],
  // right: ["E", "O", "U"],
  // bottom: ["G", "L", "F"],
  top:    ["Z", "L", "G"],
  left:   ["V", "N", "I"],
  right:  ["E", "M", "A"],
  bottom: ["O", "Y", "R"],
});

console.log("Calculating...");
const solutions = await findSolutions(testGame.board, 1000, 2, []);
console.log(solutions);
console.log(`Found ${solutions.length} solutions`);

// console.log("done")

// console.log(wordTrie.has('xcxcxxx'));
