import { findSolutions } from './letter_boxed_solver.js';
import { makeNewGame, quickGame } from './state.js';

const testGame = quickGame("ZLG VNI EMA OYR");
if (!testGame) {
  console.log("Invalid Game");
} else {
  console.log("Calculating...");
  const solutions = await findSolutions(testGame.board, 1000, 2, []);
  console.log(solutions);
  console.log(`Found ${solutions.length} solutions`);
}
