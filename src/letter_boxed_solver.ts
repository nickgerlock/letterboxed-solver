import { AllBoardLetters, Board, BoardLetter, Letter, LetterPath, State, getCurrentLetter, getLetter, hasWon, selectLetter, submitSelection } from './state.js';
import { isDefined } from './utilities.js';
import { checkSelectionLeadsToWord, checkSelectionWordIsValid } from './validity.js';

export function solve(state: State, allowedWordsLeft: number = 6): State[] {
  if (allowedWordsLeft === 0) return [];

  if (hasWon(state)) return [state];

  const nextPossibleLetters = getNextPossibleLetters(state);
  const nextStatesFromAddingLetters = (nextPossibleLetters).map(letter => selectLetter(state, letter)).filter(isDefined);
  const nextStatesFromSubmittingSelection = [submitSelection(state)].filter(isDefined);
  const nextStatesAndWordsUsed: [State, number][] = [
    ...nextStatesFromAddingLetters.map(state => [state, 0] satisfies [State, number]),
    ...nextStatesFromSubmittingSelection.map(state => [state, 1] satisfies [State, number]),
  ];

  return nextStatesAndWordsUsed.map(([state, wordsUsed]) => solve(state, allowedWordsLeft - wordsUsed)).flat();
}

const NUM_BRANCHES = Infinity;
const MAX_WORDS = 2;

export function whoaSolve(allLetters: Set<Letter>, lettersUsed: Set<Letter>, currentLetter: Letter | undefined, wordsSoFar: string[], availableWords: Set<string>, availableWordsByLetter: Partial<Record<Letter, string[]>>): (string[])[] {
  if (lettersUsed.size === allLetters.size) return [wordsSoFar];

  if (wordsSoFar.length >= MAX_WORDS) return [];

  // const nextWordsByLetterMap = getNextWordsByLetterMap(Array.from(availableWords));
  //   // TODO: this "as string[]" is sinful
  const currentlyAvailableWords = (currentLetter ? availableWordsByLetter[currentLetter] : Array.from(availableWords)) as string[];

  // const currentlyAvailableWords = Array.from(availableWords).filter(word => {
  //   const firstLetter = word[0];
  //   return !currentLetter || (firstLetter && firstLetter === currentLetter);
  // });

  const wordsByValue = currentlyAvailableWords.sort((a, b) => getWordValue(lettersUsed, b) - getWordValue(lettersUsed, a));
  const nextWords = wordsByValue.slice(0, Math.min(wordsByValue.length, NUM_BRANCHES));

  return nextWords.map(nextWord => {
    const nextLetter = nextWord && Array.from(nextWord).at(-1) as Letter;
    const nextLettersUsed = nextWord && getLettersUsedAfterWord(lettersUsed, nextWord);

    if (!nextLetter || !nextLetter || !nextLettersUsed) {
      return [];
    }

    return whoaSolve(allLetters, nextLettersUsed, nextLetter, [...wordsSoFar, nextWord], availableWords, availableWordsByLetter);
  }).flat();
}

export function getNextWordsByLetterMap(availableWords: string[]): Partial<Record<Letter, string[]>> {
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

// function getWordsBeginningWithCurrentLetter(letter: Letter, availableWords: string[]) {
//   const currentBoardLetter = getCurrentLetter(state);
//   if (!currentBoardLetter) return;

//   const currentLetter = getLetter(state.board, currentBoardLetter);

//   return availableWords.filter(word => {
//     const firstLetter = word[0];
//     return firstLetter && firstLetter === currentLetter;
//   });
// }

function getNextPossibleLetters(state: State): BoardLetter[] {
  const currentSide = getCurrentLetter(state)?.side;
  return AllBoardLetters.filter(letter => letter.side !== currentSide);
}
