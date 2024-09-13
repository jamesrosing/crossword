import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import CrosswordGenerator from '@/lib/crosswordGenerator';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const theme = searchParams.get('theme') || undefined;

    const wordlistPath = path.join(process.cwd(), 'data', 'wordlist.txt');
    const generator = new CrosswordGenerator(wordlistPath, 20, 2);
    const puzzle = generator.generatePuzzle();

    let defaultUser = await prisma.user.findFirst();
    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          email: 'default@example.com',
          name: 'Default User',
        },
      });
    }

    const title = `Crossword Puzzle ${theme ? `- ${theme}` : ''}`;

    const savedPuzzle = await prisma.puzzle.create({
      data: {
        title,
        theme: theme || null,
        difficulty: 'medium', // Add a default difficulty
        grid: JSON.stringify(puzzle.grid),
        cluesAcross: JSON.stringify(puzzle.words.filter(w => !w.vertical).map(w => ({ number: w.row * 20 + w.col + 1, clue: w.word }))),
        cluesDown: JSON.stringify(puzzle.words.filter(w => w.vertical).map(w => ({ number: w.row * 20 + w.col + 1, clue: w.word }))),
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