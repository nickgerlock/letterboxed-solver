// Validity
// -----------------------

import { Board, BoardLetter, Side, State, getCurrentLetter, getWord } from './state.js';

// export function checkMoveValid(state: State): MoveValidity {
//   const conditions: ValidityCondition[] = [
//     [() => checkSelectionStartsWithLastLetter(state), "INVALID_INVALID_STARTING_LETTER"],
//     [() => checkSelectionWordLengthValid(state), "INVALID_WORD_TOO_SHORT"],
//     [() => checkSelectionContainsNoRepeatedSides(state), "INVALID_REPEATED_SIDE"],
//     [() => checkSelectionIsWord(state), "INVALID_INVALID_WORD"],
//   ];
//   const failedCondition = conditions.find(check => {
//     if (!check[0]()) return check[1];
//   });

//   if (failedCondition) {
//     return {
//       isValid: false,
//       status: failedCondition[1],
//     }
//   }

//   return ValidMoveValidity;
// }

export function checkLetterIsValidSelection(state: State, letter: BoardLetter): boolean {
  const currentLetter = getCurrentLetter(state);
  if (!currentLetter) return true;

  return currentLetter.side === letter.side;
}

export function checkSelectionWordIsValid(state: State): boolean {
  return checkSelectionIsWord(state) && checkSelectionWordLengthValid(state);
}

// Note: will want to use a Trie, so that, at any given partial move,
// we can check each next candidate letter to see if any valid word contains it.
// TODO STUB
// TODO: make sure to check that the candidate word is at least 3 letters long
export function isPrefixOfWord(letters: string): boolean {
  return true;
}

export function checkSelectionLeadsToWord(state: State): boolean {
  return isPrefixOfWord(getWord(state.board, state.selectedLetters));
}

function checkSelectionIsWord(state: State): boolean {
  return checkWordIsValid(getWord(state.board, state.selectedLetters));
}

const InvalidMoveStatuses = [
  "INVALID_REPEATED_SIDE",
  "INVALID_INVALID_WORD",
  "INVALID_WORD_TOO_SHORT",
  "INVALID_INVALID_STARTING_LETTER",
] as const;
// type MoveValidityStatus = 
const ValidMoveValidity = {
  isValid: true,
  status: "VALID",
} as const;
type MoveValidity = typeof ValidMoveValidity | {
  isValid: false,
  status: typeof InvalidMoveStatuses[number]
};

function checkLettersEqual(a: BoardLetter, b: BoardLetter): boolean {
  return a.side === b.side && a.index === b.index;
}

function checkWordIsValid(word: string): boolean {
  return true;
}

const MINIMUM_WORD_LENGTH = 3;
function checkSelectionWordLengthValid(state: State): boolean {
  return state.selectedLetters.length <= MINIMUM_WORD_LENGTH;
}

function checkSelectionContainsNoRepeatedSides(state: State): boolean {
  let lastSide: Side;
  return state.selectedLetters.every(boardLetter => {
    const side = boardLetter.side;
    const sidesDifferent = side !== lastSide;
    lastSide = side;
    return sidesDifferent;
  });
}

function checkSelectionStartsWithLastLetter(state: State): boolean {
  if (state.selectedWords.length === 0) return true;

  const lastWord = state.selectedWords[state.selectedWords.length - 1];
  const lastLetter = lastWord[lastWord.length - 1];
  return checkLettersEqual(lastLetter, state.selectedLetters[0]);
}

type ValidityCondition = [(...args: any) => boolean, typeof InvalidMoveStatuses[number]];
// const condition = (f: (...args: any) => boolean, typeof InvalidMoveStatuses[number])
