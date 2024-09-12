import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const puzzlePath = path.join(process.cwd(), 'generatedPuzzle.json');
    const puzzleData = await fs.readFile(puzzlePath, 'utf-8');
    const puzzle = JSON.parse(puzzleData);
    return NextResponse.json(puzzle);
  } catch (error) {
    console.error('Error fetching puzzle:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}