export type State = {
  readonly board: Board
  // TODO: invariant: last letter of word i must be first letter of word i+1.
  readonly selectedWords: LetterPath[]
  readonly selectedLetters: LetterPath

  readonly lettersUsed: Set<BoardLetter>
  // TODO: should we store "has won" here? Might be nice not to in the interest
  // of not storing redundant information (though "LettersUsed" is techically redundant)
}
export type Board = Record<Side, BoardSide>;
export type Side = typeof Sides[number];
// TODO: enforce validity of number? (should be between 0 and 2).
export type BoardLetter = {
  side: Side,
  index: number,
};
export type ShortBoardLetter = [Side, number];
export type LetterPath = BoardLetter[];

const LETTERS_PER_SIDE = 3; // TODO: can we make this less redundant?
const LETTER_INDICES = [0, 1, 2] as const;
const Letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const;
type Letter = typeof Letters[number];
type BoardSide = [Letter, Letter, Letter];

const Sides = ["left", "top", "right", "bottom"] as const;

export const AllBoardLetters: BoardLetter[] = Sides.map(side => {
  return LETTER_INDICES.map(index => {
    const boardLetter: BoardLetter = {side, index};
    return boardLetter;
  });
}).flat();

// State
// ------------------

export function newMove(move: ShortBoardLetter[]): BoardLetter[] {
  return move.map(shortBoardLetter => ({side: shortBoardLetter[0], index: shortBoardLetter[1]}));
}

export function makeNewGame(board: Board): State {
  return {
    board,
    lettersUsed: new Set(),
    selectedWords: [],
    selectedLetters: [],
  };
}

// TODO: validate selected letter?
export function selectLetter(state: State, letter: BoardLetter): State {
  return {
    board: state.board,
    selectedWords: state.selectedWords,
    selectedLetters: [...state.selectedLetters, letter],
    lettersUsed: new Set(state.lettersUsed),
  }
}

// TODO: validate selected letters?
export function selectLetters(state: State, letters: BoardLetter[]): State {
  return {
    board: state.board,
    selectedWords: state.selectedWords,
    selectedLetters: [...state.selectedLetters, ...letters],
    lettersUsed: new Set(state.lettersUsed),
  }
}

// NOTE: Assumes move is valid.
export function applyMove(state: State, move: BoardLetter[]): State {
  return {
    board: state.board,
    lettersUsed: new Set([...state.lettersUsed, ...new Set(move)]),
    selectedWords: [...state.selectedWords, move],
    selectedLetters: [],
  };
}

export function submitSelection(state: State): State {
  return {
    board: state.board,
    lettersUsed: new Set([...state.lettersUsed, ...new Set(state.selectedLetters)]),
    selectedWords: [...state.selectedWords, state.selectedLetters],
    selectedLetters: [],
  };
}

export function hasWon(state: State) {
  const usedAllLetters = Sides.every(side => {
    return LETTER_INDICES.every(index => {
      return state.lettersUsed.has({side, index})
    });
  });

  // TODO: INVARIANT: four words or less

  return usedAllLetters;
}

export function hasLost(state: State) {
  
}

export function getWord(board: Board, move: BoardLetter[]): string {
  return move.map(boardLetter => {
    return board[boardLetter[0]][boardLetter[1]];
  }).join("");
}

export function checkSelectionIncomplete(state: State) {
  return state.selectedLetters.length > 0;
}

export function getCurrentLetter(state: State): BoardLetter | undefined {
  let currentLetter: BoardLetter | undefined = undefined;
  if (state.selectedLetters.length > 0) {
    currentLetter = state.selectedLetters[state.selectedLetters.length - 1];
  }

  if (state.selectedWords.length) {
    const lastWord = state.selectedWords[state.selectedWords.length - 1];
    currentLetter = lastWord[lastWord.length - 1];
  }

  return currentLetter;
}
