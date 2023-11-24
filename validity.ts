// Validity
// -----------------------

import { Board, BoardLetter, Side, State, getWord } from './state';

// TODO: it could be cool to create a branded type called "ValidMove".
//   - Would need to redefine "Move" to be a tuple of State and Move to do so.
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

export function checkSelectionWordIsValid(state: State) {
  return checkSelectionIsWord(state) && checkSelectionWordLengthValid(state);
}

// Note: will want to use a Trie, so that, at any given partial move,
// we can check each next candidate letter to see if any valid word contains it.
// TODO STUB
export function isValidPrefix(letters: string): boolean {
  return true;
}

export function checkSelectionLeadsToWord(state: State): boolean {
  return isValidPrefix(getWord(state.board, state.selectedLetters));
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
  return a[0] === b[0] && a[1] === b[1];
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
    const side = boardLetter[0];
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
