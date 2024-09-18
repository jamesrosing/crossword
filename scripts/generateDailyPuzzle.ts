import { CrosswordGenerator } from '../lib/crosswordGenerator';
import { PrismaClient } from '@prisma/client';
import { readWordList } from '../lib/wordListReader';

const prisma = new PrismaClient();

async function generateDailyPuzzle() {
  const wordList = await readWordList();
  const generator = new CrosswordGenerator(15); // Start with 15x15 grid
  const puzzle = await generator.generatePuzzle(wordList.map(item => item.word));

  if (puzzle) {
    // Update the words with clues from the word list
    puzzle.words = puzzle.words.map(word => {
      const wordListItem = wordList.find(item => item.word === word.word);
      return { ...word, clue: wordListItem ? wordListItem.clue : word.clue };
    });

    // Store the puzzle in the database
    await prisma.puzzle.create({
      data: {
        grid: JSON.stringify(puzzle.grid),
        words: JSON.stringify(puzzle.words),
        cellNumbers: JSON.stringify(puzzle.cellNumbers),
        cluesAcross: JSON.stringify(puzzle.words.filter(w => !w.vertical).reduce((acc, w) => ({ ...acc, [w.number]: w.clue }), {})),
        cluesDown: JSON.stringify(puzzle.words.filter(w => w.vertical).reduce((acc, w) => ({ ...acc, [w.number]: w.clue }), {})),
        date: new Date(), // Set to today's date
        // ... (other fields remain the same)
      },
    });

    console.log('Daily puzzle generated and stored.');
  } else {
    console.error('Failed to generate puzzle.');
  }
}

generateDailyPuzzle().catch(console.error);