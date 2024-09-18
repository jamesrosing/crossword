import { CrosswordGenerator } from '../lib/crosswordGenerator';
import { PrismaClient } from '@prisma/client';
import { readWordList } from '../lib/wordListReader';

const prisma = new PrismaClient();

async function generateDailyPuzzle() {
  const wordList = await readWordList();
  const generator = new CrosswordGenerator(15); // 15x15 grid
  const puzzle = await generator.generatePuzzle(wordList);

  // Store the puzzle in the database
  await prisma.puzzle.create({
    data: {
      grid: JSON.stringify(puzzle.grid),
      words: JSON.stringify(puzzle.words),
      cellNumbers: JSON.stringify(puzzle.cellNumbers),
      date: new Date(), // Set to today's date
    },
  });

  console.log('Daily puzzle generated and stored.');
}

generateDailyPuzzle().catch(console.error);