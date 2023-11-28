import { getNextWordsByLetterMap, solve, whoaSolve } from './letter_boxed_solver.js';
import { getAdjacentLetters, getLetters, makeNewGame, print } from './state.js';
import { getAvailableWords } from './find_words.js';
import { getWordTrie, getWordList, getWordSet } from './words.js';

console.log("loading")
const wordTrie = await getWordTrie();
const wordSet = await getWordSet();

const testGame = makeNewGame({
  // left: ["H", "T", "A"],
  // top: ["R", "P", "I"],
  // right: ["E", "O", "U"],
  // bottom: ["G", "L", "F"],
  left: ["A", "C", "O"],
  top: ["P", "L", "W"],
  right: ["I", "E", "B"],
  bottom: ["S", "T", "H"],
});


// console.log(print(testGame));
const allAvailableWords = getAvailableWords(testGame.board, await getWordList())
const nextWordsByLetterMap = getNextWordsByLetterMap(allAvailableWords);

const solution = whoaSolve(new Set(getLetters(testGame.board)), new Set(), undefined, [], new Set(allAvailableWords), nextWordsByLetterMap);
console.log(solution);

// console.log("done")

// console.log(wordTrie.has('xcxcxxx'));
