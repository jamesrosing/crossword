import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function insertSamplePuzzle() {
  const puzzle = await prisma.puzzle.create({
    data: {
      title: 'Sample Puzzle',
      difficulty: 'Medium',
      grid: JSON.stringify([['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']]),
      words: JSON.stringify(['ABC', 'DEF', 'GHI']),
      cellNumbers: JSON.stringify([[1, 2, 3], [4, 5, 6], [7, 8, 9]]),
      cluesAcross: { '1': 'First row', '4': 'Second row', '7': 'Third row' },
      cluesDown: { '1': 'First column', '2': 'Second column', '3': 'Third column' },
    },
  });

  console.log('Sample puzzle inserted:', puzzle);
}

insertSamplePuzzle()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());