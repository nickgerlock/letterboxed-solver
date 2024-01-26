import { findSolutions } from './letter_boxed_solver.js';
import { quickGame } from './state.js';

async function printSolutions() {
  const testGame = quickGame("WFP DME OIH SRA");
  if (!testGame) {
    console.log("Invalid Game");
    return;
  }

  console.log("Calculating...");
  const solutions = await findSolutions(testGame.board, Infinity, 2, []);
  solutions.sort((a, b) => {
    return a.join('').length - b.join('').length;
  });
  console.dir(solutions, {'maxArrayLength': null})
  console.log(`Found ${solutions.length} solutions`);
}

printSolutions();
