import { NextResponse } from 'next/server';
import { CrosswordGenerator } from '@/lib/crosswordGenerator';
import { readWordList } from '@/lib/wordListReader';

export async function GET() {
  try {
    const wordList = await readWordList();
    const words = wordList.map(item => item.word);
    const generator = new CrosswordGenerator(15); // Start with 15x15 grid
    const puzzle = await generator.generatePuzzle(words);

    if (!puzzle) {
      return NextResponse.json({ error: "Failed to generate a puzzle with words" }, { status: 500 });
    }

    // Add clues to the puzzle
    puzzle.words.forEach(word => {
      const wordListItem = wordList.find(item => item.word === word.word);
      word.clue = wordListItem ? wordListItem.clue : 'No clue available';
      if (word.vertical) {
        puzzle.cluesDown[word.number] = word.clue;
      } else {
        puzzle.cluesAcross[word.number] = word.clue;
      }
    });

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