import { getAvailableWords } from './find_words.js';
import { AllBoardLetters, Board, BoardLetter, Letter, LetterPath, State, getCurrentLetter, getLetter, getLetters, hasWon, selectLetter, submitSelection } from './state.js';
import { isDefined } from './utilities.js';
import { checkSelectionLeadsToWord, checkSelectionWordIsValid } from './validity.js';
import { getWordList } from './words.js';

const DEFAULT_NUM_BRANCHES = Infinity;
const DEFAULT_MAX_WORDS = 2;

export async function findSolutions(board: Board, numBranches: number = DEFAULT_NUM_BRANCHES, maxWords: number = DEFAULT_MAX_WORDS, startingWords: string[] = []): Promise<(string[])[]> {
  const allAvailableWords = getAvailableWords(board, await getWordList());
  const allAvailableWordsSet = new Set(allAvailableWords);
  if (startingWords.some(word => !allAvailableWordsSet.has(word))) return [];

  const nextWordsByLetterMap = getNextWordsByLetterMap(allAvailableWords);
  const letters = new Set(getLetters(board));

  return makeSolve(letters, numBranches, maxWords)(new Set(), undefined, startingWords, allAvailableWordsSet, nextWordsByLetterMap);
}

function makeSolve(allLetters: Set<Letter>, numBranches: number, maxWords: number) {
  const solve = (lettersUsed: Set<Letter>, currentLetter: Letter | undefined, wordsSoFar: string[], availableWords: Set<string>, availableWordsByLetter: Partial<Record<Letter, string[]>>): (string[])[] => {
    if (lettersUsed.size === allLetters.size) return [wordsSoFar];

    if (wordsSoFar.length >= maxWords) return [];

    const currentlyAvailableWords = (currentLetter ? availableWordsByLetter[currentLetter] : Array.from(availableWords)) || [];
    const wordsByValue = currentlyAvailableWords.sort((a, b) => getWordValue(lettersUsed, b) - getWordValue(lettersUsed, a));
    const nextWords = wordsByValue.slice(0, Math.min(wordsByValue.length, numBranches));

    return nextWords.map(nextWord => {
      const nextLetter = nextWord && Array.from(nextWord).at(-1) as Letter;
      const nextLettersUsed = nextWord && getLettersUsedAfterWord(lettersUsed, nextWord);

      if (!nextLetter || !nextLetter || !nextLettersUsed) {
        return [];
      }

      return solve(nextLettersUsed, nextLetter, [...wordsSoFar, nextWord], availableWords, availableWordsByLetter);
    }).flat();
  }

  return solve;
}

function getNextWordsByLetterMap(availableWords: string[]): Partial<Record<Letter, string[]>> {
  const wordsByLetter: Partial<Record<Letter, string[]>> = {};
  availableWords.forEach(word => {
    const letter = word[0] as Letter;
    if (!wordsByLetter[letter]) wordsByLetter[letter] = [];
    wordsByLetter[letter]?.push(word);
  });

  return wordsByLetter;
}

function getWordValue(lettersUsed: Set<Letter>, word: string): number {
  return getLettersUsedAfterWord(lettersUsed, word).size - lettersUsed.size;
}

function getLettersUsedAfterWord(lettersUsed: Set<Letter>, word: string): Set<Letter> {
  return new Set([...lettersUsed, ...word]) as Set<Letter>;
}

function getLetterPathFromWord(letterMapping: LetterMapping, word: string): LetterPath | undefined {
  const path = Array.from(word).map(letter => letterMapping[letter as Letter]).filter(isDefined);
  if (path.length === 0) return undefined;

  return path;
}

type LetterMapping = Partial<Record<Letter, BoardLetter>>;

function getLetterToBoardLetterMapping(board: Board): LetterMapping {
  const mapping: LetterMapping = {};
  AllBoardLetters.forEach(boardLetter => {
    mapping[getLetter(board, boardLetter)] = boardLetter;
  });

  return mapping;
}

function getNextPossibleLetters(state: State): BoardLetter[] {
  const currentSide = getCurrentLetter(state)?.side;
  return AllBoardLetters.filter(letter => letter.side !== currentSide);
}
