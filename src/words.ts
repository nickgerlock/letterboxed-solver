import { SearchTrie, buildCharacterTrie } from 'search-trie';

import { readFile } from 'node:fs/promises';
import wordsListPath from 'word-list';
import { AllBoardLetters, Board, Letter, getAdjacentLetters, getLetters } from './state.js';

let wordList: string[];
let wordSet: Set<string>;
let wordTrie: SearchTrie<string, undefined>

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

export async function getWordTrie(): Promise<SearchTrie<string, undefined>> {
  if (!wordTrie) {
    await initializeWordList();
  }
  
  return wordTrie;
}

async function initializeWordList() {
  wordList = (await readFile(wordsListPath, 'utf8')).toUpperCase().split('\n').sort((a, b) => {
    // Sort from longest to shortest for efficiency.
    return b.length - a.length;
  });
  wordSet = new Set(wordList);
  wordTrie = buildCharacterTrie(wordList.map(word => ({key: word, value: undefined})));
}
