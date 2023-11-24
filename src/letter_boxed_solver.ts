import { AllBoardLetters, BoardLetter, State, getCurrentLetter, hasWon, selectLetter, submitSelection } from './state.js';
import { checkSelectionLeadsToWord, checkSelectionWordIsValid } from './validity.js';

export function solve(state: State, allowedWordsLeft: number = 6): State[] {
  if (allowedWordsLeft === 0) return [];

  if (hasWon(state)) return [state];

  const nextPossibleLetters = getNextPossibleLetters(state);
  const nextStatesFromAddingLetters = (nextPossibleLetters).map(letter => selectLetter(state, letter)).filter(nextState => {
    return checkSelectionLeadsToWord(nextState);
  });
  const nextStatesFromSubmittingSelection = checkSelectionWordIsValid(state) ? [submitSelection(state)] : [];
  const nextStatesAndWordsUsed: [State, number][] = [
    ...nextStatesFromAddingLetters.map(state => [state, 0] satisfies [State, number]),
    ...nextStatesFromSubmittingSelection.map(state => [state, 1] satisfies [State, number]),
  ];

  return nextStatesAndWordsUsed.map(([state, wordsUsed]) => solve(state, allowedWordsLeft - wordsUsed)).flat();
}

function getNextPossibleLetters(state: State): BoardLetter[] {
  const currentSide = getCurrentLetter(state)?.side;
  return AllBoardLetters.filter(letter => letter.side !== currentSide);
}
