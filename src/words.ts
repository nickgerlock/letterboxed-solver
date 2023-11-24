import mnemonist from 'mnemonist';
const { Trie } = mnemonist;

// import Trie from 'mnemonist/trie.js'
import { readFile } from 'node:fs/promises';
import wordsListPath from 'word-list';

let wordList: string[];
let wordSet: Set<string>;
let wordTrie: any; // FUCK this package!!!

export async function getWordList(): Promise<string[]> {
  if (!wordList) {
    await initializeWordList();
  }

  return wordList;
}

export async function getWordSet(): Promise<Set<string>> {
  if (!wordSet) {
    await initializeWordList();
  }

  return wordSet;
}

export async function getWordTrie(): Promise<any> {
  if (!wordTrie) {
    await initializeWordList();
  }
  
  return wordTrie;
}

async function initializeWordList() {
  wordList = (await readFile(wordsListPath, 'utf8')).split('\n');
  wordSet = new Set(wordList);
  wordTrie = Trie.from(wordList);
}
