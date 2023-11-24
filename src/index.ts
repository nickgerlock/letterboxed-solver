import { getWordTrie, getWordList, getWordSet } from './words.js';

console.log("loading")
const wordTrie = await getWordTrie();
const wordSet = await getWordSet();

console.log("done")

console.log(wordTrie.find('penis'));
