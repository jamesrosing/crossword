import prisma from '../lib/prisma';

async function main() {
  // Create a new user
  const newUser = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
    },
  });
  console.log('Created new user:', newUser);

  // Create a new puzzle
  const newPuzzle = await prisma.puzzle.create({
    data: {
      title: 'First Crossword',
      difficulty: 'Easy',
      grid: JSON.stringify([/* Your puzzle grid here */]),
      cluesAcross: JSON.stringify({/* Your across clues here */}),
      cluesDown: JSON.stringify({/* Your down clues here */}),
      creatorId: newUser.id,
    },
  });
  console.log('Created new puzzle:', newPuzzle);

  // Create user progress
  const userProgress = await prisma.userProgress.create({
    data: {
      userId: newUser.id,
      puzzleId: newPuzzle.id,
      progress: JSON.stringify({/* Initial progress data */}),
      completed: false,
    },
  });
  console.log('Created user progress:', userProgress);

  // Fetch all users
  const allUsers = await prisma.user.findMany();
  console.log('All users:', allUsers);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });