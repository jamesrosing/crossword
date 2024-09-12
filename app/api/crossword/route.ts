import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import CrosswordGenerator from '@/lib/crosswordGenerator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty') as 'easy' | 'medium' | 'hard' || 'medium';
    const theme = searchParams.get('theme') || undefined;

    const existingPuzzle = await prisma.puzzle.findFirst({
      where: { 
        difficulty,
        ...(theme ? { theme } : {})
      },
    });

    if (existingPuzzle) {
      return NextResponse.json(existingPuzzle);
    }

    const generator = new CrosswordGenerator('data/wordlist.txt', 15, 3, theme || null);
    const puzzle = generator.generatePuzzle(difficulty);

    let defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          email: 'default@example.com',
          name: 'Default User',
        },
      });
    }

    const title = `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Puzzle ${theme ? `- ${theme}` : ''}`;

    const savedPuzzle = await prisma.puzzle.create({
      data: {
        title,
        difficulty,
        theme,
        grid: JSON.stringify(puzzle.grid),
        cluesAcross: JSON.stringify(puzzle.clues.across),
        cluesDown: JSON.stringify(puzzle.clues.down),
        creator: {
          connect: { id: defaultUser.id },
        },
      },
    });

    return NextResponse.json(savedPuzzle);
  } catch (error) {
    console.error('Error in /api/crossword:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}