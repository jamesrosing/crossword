import CrosswordGenerator from '../lib/crosswordGenerator';
import fs from 'fs/promises';
import path from 'path';

interface Word {
  word: string;
  clue: string;
}

async function readWordList(): Promise<Word[]> {
  const wordlistPath = path.join(__dirname, '../data', 'wordlist.txt');
  console.log(`Reading word list from: ${wordlistPath}`); // Debug print
  const data = await fs.readFile(wordlistPath, 'utf-8');
  return data.split('\n').map(line => {
    const [word, clue] = line.split('|');
    return { word: word.trim(), clue: clue.trim(), difficulty: 0 }; // Add a default difficulty
  });
}

async function generatePuzzle() {
  const wordsWithClues = await readWordList();
  const words = wordsWithClues.map(item => item.word);
  const clueMap = new Map(wordsWithClues.map(item => [item.word, item.clue]));

  // Initialize the crossword generator with the word list
  const generator = new CrosswordGenerator(wordsWithClues, 15, 3, null);
  const puzzle = generator.generatePuzzle('medium'); // Adjust difficulty as needed

  // Create the final puzzle object with words, positions, and clues
  const finalPuzzle = {
    grid: puzzle.grid,
    words: puzzle.words.map(word => ({
      word: word.word,
      row: word.row,
      col: word.col,
      vertical: word.vertical,
      clue: clueMap.get(word.word) || "Clue not found"
    }))
  };

  // Number the grid cells
  const numberedGrid = numberGrid(finalPuzzle.grid, finalPuzzle.words);

  // Save the generated puzzle
  const outputFilePath = path.join(__dirname, '../generatedPuzzle.json');
  console.log(`Writing puzzle to: ${outputFilePath}`); // Debug print
  await fs.writeFile(outputFilePath, JSON.stringify({ ...finalPuzzle, grid: numberedGrid }, null, 2));
  console.log('Puzzle has been generated and saved to generatedPuzzle.json');
}

function numberGrid(grid: string[][], words: any[]): string[][] {
  const numberedGrid = grid.map(row => row.slice());
  let number = 1;

  words.forEach(word => {
    const { row, col, vertical } = word;
    if (vertical) {
      if (numberedGrid[row][col] === ' ') {
        numberedGrid[row][col] = number.toString();
        number++;
      }
    } else {
      if (numberedGrid[row][col] === ' ') {
        numberedGrid[row][col] = number.toString();
        number++;
      }
    }
  });

  return numberedGrid;
}

generatePuzzle().catch(console.error);