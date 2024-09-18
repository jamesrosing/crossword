import { NextResponse } from 'next/server';
import { CrosswordGenerator } from '@/lib/crosswordGenerator';
import { promises as fs } from 'fs';
import path from 'path';

interface Word {
  word: string;
  clue: string;
}

async function readWordList(): Promise<Word[]> {
  const wordlistPath = path.join(process.cwd(), 'data', 'wordlist.txt');
  const data = await fs.readFile(wordlistPath, 'utf-8');
  
  return data.split('\n').map((line: string) => {
    const [word, clue] = line.split('|');
    return { word: word.trim(), clue: clue.trim() };
  });
}

async function generatePuzzle() {
  const wordsWithClues = await readWordList();
  const words = wordsWithClues.map(item => item.word);

  const generator = new CrosswordGenerator(15); // Start with 15x15 grid
  return generator.generatePuzzle(words);
}

export async function GET() {
  try {
    const puzzle = await generatePuzzle();

    if (!puzzle || !puzzle.words || puzzle.words.length === 0) {
      return NextResponse.json({ error: "Failed to generate a puzzle with words" }, { status: 500 });
    }

    return NextResponse.json(puzzle);
  } catch (error) {
    console.error('Error generating puzzle:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST() {
  // If you need different behavior for POST requests, implement it here
  // For now, we'll just call the same generatePuzzle function
  return GET();
}