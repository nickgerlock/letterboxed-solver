import { AllBoardLetters, Board, Letter, getAdjacentLetters, getLetter, getLetters } from './state.js';

export function getAvailableWords(board: Board, wordList: string[]): string[] {
  const letterAdjacencies = getLetterAjacencies(board);
  const candidateWords = getCandidateWords(board, wordList);

  return candidateWords.filter(word => {
    const letters = Array.from(word);
    return letters.every((letter, index) => {
      const nextLetter = letters[index + 1];
      // TODO: I don't like using "as" but I don't think there's a better way to do this.
      return !nextLetter || isLetterPairAllowed(letter as Letter, nextLetter as Letter, letterAdjacencies);
    });
  });
}

function getCandidateWords(board: Board, wordList: string[]): string[] {
  const availableLetters: Set<string> = new Set(getLetters(board));
  return wordList.filter(word => {
    return word.length > 2 && Array.from(word).every(letter => availableLetters.has(letter));
  });
}

type LetterAdjacencies = Partial<Record<Letter, Set<Letter>>>;

function getLetterAjacencies(board: Board): LetterAdjacencies {
  const adjacencies: LetterAdjacencies = {};
  AllBoardLetters.forEach(boardLetter => {
    const letter = getLetter(board, boardLetter);
    adjacencies[letter] = new Set(getAdjacentLetters(board, boardLetter).map(boardLetter => getLetter(board, boardLetter)));
  });

  return adjacencies;
}

function isLetterPairAllowed(first: Letter, second: Letter, letterAdjacencies: LetterAdjacencies) {
  return letterAdjacencies[first]?.has(second);
}
