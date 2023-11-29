import { checkLetterIsValidSelection, checkSelectionWordIsValid } from './validity.js'

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
  index: 0 | 1 | 2,
};
export type ShortBoardLetter = [Side, 0 | 1 | 2];
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
export type Letter = typeof Letters[number];
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

export function makeNewGame(board: Board): State {
  return {
    board,
    lettersUsed: new Set(),
    selectedWords: [],
    selectedLetters: [],
  };
}

export function quickGame(boardString: string): State | undefined {
  const sides = boardString.split(' ');
  const [left, top, right, bottom] = sides.map(side => boardSide(side));
  if (!(left && top && right && bottom)) return;

  return {
    board: {left, top, right, bottom},
    lettersUsed: new Set(),
    selectedWords: [],
    selectedLetters: [],
  };
}

function boardSide(boardSideString: string | undefined): BoardSide | undefined {
  if (!boardSideString || boardSideString.length !== 3) return;

  const chunks = Array.from(boardSideString);
  if (!chunks.every(isLetter)) return;

  return chunks as BoardSide;
}

function isLetter(maybe: string): maybe is Letter {
  const lettersAsStrings: readonly string[] = Letters;
  return (lettersAsStrings).includes(maybe);
}

// TODO: validate selected letter?
export function selectLetter(state: State, letter: BoardLetter): State | undefined {
  if (!checkLetterIsValidSelection(state, letter)) {
    return undefined;
  }

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

export function submitSelection(state: State): State | undefined {
  const lastLetter = state.selectedLetters.at(-1);
  if (!lastLetter) {
    return undefined;
  }

  if (!checkSelectionWordIsValid(state)) {
    return undefined;
  }

  return {
    board: state.board,
    lettersUsed: new Set([...state.lettersUsed, ...new Set(state.selectedLetters)]),
    selectedWords: [...state.selectedWords, state.selectedLetters],
    selectedLetters: [lastLetter],
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
    return board[boardLetter.side][boardLetter.index];
  }).join("");
}

export function checkSelectionIncomplete(state: State) {
  return state.selectedLetters.length > 0;
}

export function getCurrentLetter(state: State): BoardLetter | undefined {
  return state.selectedLetters.at(-1);
}

export function getLetter(board: Board, boardLetter: BoardLetter): Letter {
  return board[boardLetter.side][boardLetter.index];
}

export function getLetters(board: Board, boardLetters?: BoardLetter[]): Letter[] {
  return (boardLetters ?? AllBoardLetters).map(boardLetter => getLetter(board, boardLetter));
}

export function print(state: State): string {
  const board = state.board;
  const boardString = printBoard(board);
  const lettersUsed = Array.from(state.lettersUsed).map(boardLetter => getLetter(board, boardLetter));
  const lettersLeft = AllBoardLetters
    .filter(boardLetter => !state.lettersUsed.has(boardLetter))
    .map(boardLetter => getLetter(board, boardLetter));
  const wordsUsed = state.selectedWords.map(letterPath => getWord(board, letterPath));
  
  return [
    wordsUsed,
    boardString,
    `Used: ${lettersUsed}`,
    `Unused: ${lettersLeft}`,
  ].join("\n");
}

export function printBoard(board: Board): string {
  const rows = [
    [" ", board.top[0], board.top[1], board.top[2], " "],
    [board.left[2], " ", " ", " ", board.right[2]],
    [board.left[1], " ", " ", " ", board.right[1]],
    [board.left[0], " ", " ", " ", board.right[0]],
    [" ", board.bottom[0], board.bottom[1], board.bottom[2], " "],
  ];

  return rows.map(row => row.join(" ")).join("\n");
}

// "Adjacent" means that two letters can be viably connected.
export function getAdjacentLetters(board: Board, boardLetter: BoardLetter): BoardLetter[] {
  return AllBoardLetters.filter(candidateBoardLetter => candidateBoardLetter.side !== boardLetter.side);
}
