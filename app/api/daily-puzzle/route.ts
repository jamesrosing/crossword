import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const latestPuzzle = await prisma.puzzle.findFirst({
      orderBy: { date: 'desc' },
    });

    if (!latestPuzzle) {
      return NextResponse.json({ error: 'No puzzle found' }, { status: 404 });
    }

    return NextResponse.json({
      ...latestPuzzle,
      grid: JSON.parse(latestPuzzle.grid as string),
      words: JSON.parse(latestPuzzle.words as string),
      cellNumbers: JSON.parse(latestPuzzle.cellNumbers as string),
    });
  } catch (error) {
    console.error('Error fetching daily puzzle:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}