import prisma from './prisma';

// Define difficulty levels and their base points
const DIFFICULTY_POINTS = {
  easy: 100,
  medium: 250,
  hard: 500,
  expert: 1000,
};

// Define time thresholds for each difficulty (in seconds)
const TIME_THRESHOLDS = {
  easy: 300, // 5 minutes
  medium: 900, // 15 minutes
  hard: 1800, // 30 minutes
  expert: 3600, // 60 minutes
};

// Define ranking tiers
const RANKING_TIERS = [
  { name: 'Novice', minPoints: 0 },
  { name: 'Amateur', minPoints: 1000 },
  { name: 'Skilled', minPoints: 5000 },
  { name: 'Expert', minPoints: 20000 },
  { name: 'Master', minPoints: 50000 },
  { name: 'Grandmaster', minPoints: 100000 },
];

interface PuzzleStats {
  avgCompletionTime: number;
  totalAttempts: number;
}

export async function updateUserRanking(userId: number, puzzleId: number, completionTime: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { userProgress: true },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const puzzle = await prisma.puzzle.findUnique({
    where: { id: puzzleId },
  });

  if (!puzzle) {
    throw new Error('Puzzle not found');
  }

  // Calculate ranking points
  const basePoints = DIFFICULTY_POINTS[puzzle.difficulty as keyof typeof DIFFICULTY_POINTS];
  const timeThreshold = TIME_THRESHOLDS[puzzle.difficulty as keyof typeof TIME_THRESHOLDS];
  
  // Calculate time factor (1.0 for completing at the threshold, higher for faster times)
  const timeFactor = Math.max(0.5, Math.min(2.0, timeThreshold / completionTime));
  
  // Get puzzle statistics
  const puzzleStats = await getPuzzleStats(puzzleId);
  
  // Calculate difficulty factor based on average completion time and total attempts
  const difficultyFactor = calculateDifficultyFactor(puzzleStats, completionTime);
  
  // Calculate final ranking points
  let rankingPoints = Math.round(basePoints * timeFactor * difficultyFactor);

  // Bonus points for first-time completion
  const existingProgress = user.userProgress.find(progress => progress.puzzleId === puzzleId);
  if (!existingProgress || !existingProgress.completed) {
    rankingPoints += Math.round(basePoints * 0.5); // 50% bonus for first completion
  }

  // Update user's total ranking points and puzzle progress
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      rankingPoints: {
        increment: rankingPoints,
      },
      userProgress: {
        upsert: {
          where: {
            userId_puzzleId: {
              userId: userId,
              puzzleId: puzzleId,
            },
          },
          create: {
            puzzleId: puzzleId,
            completed: true,
            completionTime: completionTime,
          },
          update: {
            completed: true,
            completionTime: Math.min(completionTime, existingProgress?.completionTime || Infinity),
          },
        },
      },
    },
    include: {
      userProgress: true,
    },
  });

  // Update user's rank based on total points
  const newRank = calculateUserRank(updatedUser.rankingPoints);
  if (newRank !== user.rank) {
    await prisma.user.update({
      where: { id: userId },
      data: { rank: newRank },
    });
  }

  return { ...updatedUser, newRankingPoints: rankingPoints, newRank };
}

async function getPuzzleStats(puzzleId: number): Promise<PuzzleStats> {
  const stats = await prisma.userProgress.aggregate({
    where: {
      puzzleId: puzzleId,
      completed: true,
    },
    _avg: {
      completionTime: true,
    },
    _count: {
      userId: true,
    },
  });

  return {
    avgCompletionTime: stats._avg.completionTime || 0,
    totalAttempts: stats._count.userId,
  };
}

function calculateDifficultyFactor(stats: PuzzleStats, userCompletionTime: number): number {
  const avgTimeFactor = stats.avgCompletionTime > 0 ? stats.avgCompletionTime / userCompletionTime : 1;
  const attemptsFactor = Math.max(0.5, Math.min(1.5, 100 / stats.totalAttempts));
  return avgTimeFactor * attemptsFactor;
}

function calculateUserRank(totalPoints: number): string {
  for (let i = RANKING_TIERS.length - 1; i >= 0; i--) {
    if (totalPoints >= RANKING_TIERS[i].minPoints) {
      return RANKING_TIERS[i].name;
    }
  }
  return RANKING_TIERS[0].name; // Default to the lowest tier
}

export async function getTopRankedUsers(limit: number = 10) {
  const topUsers = await prisma.user.findMany({
    orderBy: {
      rankingPoints: 'desc',
    },
    take: limit,
    select: {
      id: true,
      name: true,
      rankingPoints: true,
      rank: true,
    },
  });

  return topUsers;
}

export async function getUserStats(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userProgress: {
        include: {
          puzzle: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const totalPuzzlesSolved = user.userProgress.filter(progress => progress.completed).length;
  const averageCompletionTime = user.userProgress.reduce((sum, progress) => sum + (progress.completionTime || 0), 0) / totalPuzzlesSolved;

  const puzzlesByDifficulty = user.userProgress.reduce((acc, progress) => {
    if (progress.completed) {
      acc[progress.puzzle.difficulty] = (acc[progress.puzzle.difficulty] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return {
    userId: user.id,
    name: user.name,
    rank: user.rank,
    rankingPoints: user.rankingPoints,
    totalPuzzlesSolved,
    averageCompletionTime,
    puzzlesByDifficulty,
  };
}