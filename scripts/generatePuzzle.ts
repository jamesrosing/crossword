import { CrosswordGenerator } from '../lib/crosswordGenerator';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

interface Word {
  word: string;
  clue: string;
}

async function readWordList(): Promise<Word[]> {
  const wordlistPath = path.join(process.cwd(), 'data', 'wordlist.txt');
  console.log(`Reading word list from: ${wordlistPath}`);
  
  try {
    const data = await fs.readFile(wordlistPath, 'utf-8');
    const words = data.split('\n').map((line: string) => {
      const [word, clue] = line.split('|');
      return { word: word.trim(), clue: clue.trim() };
    });
    console.log(`Successfully read ${words.length} words from wordlist`);
    return words;
  } catch (error) {
    console.error(`Error reading wordlist: ${error}`);
    throw error;
  }
}

export async function generatePuzzle(size: number = 15) {
  console.log(`Starting puzzle generation with size ${size}`);
  try {
    const wordsWithClues = await readWordList();
    const words = wordsWithClues.map(item => item.word);

    console.log(`Number of words available: ${words.length}`);

    const generator = new CrosswordGenerator(size);
    console.log(`Created CrosswordGenerator instance`);

    const puzzle = await generator.generatePuzzle(words);

    if (!puzzle || !puzzle.words || puzzle.words.length === 0) {
      console.error("Failed to generate a puzzle with words");
      return null;
    }

    console.log(`Successfully generated puzzle with ${puzzle.words.length} words`);
    return puzzle;
  } catch (error) {
    console.error(`Error generating puzzle: ${error}`);
    return null;
  }
}

async function generateMultiplePuzzles(count: number, size: number = 15) {
  for (let i = 0; i < count; i++) {
    console.log(`Generating puzzle ${i + 1} of ${count}`);
    const puzzle = await generatePuzzle(size);
    
    if (puzzle) {
      const outputFilePath = path.join(process.cwd(), `generatedPuzzle_${i + 1}.json`);
      console.log(`Writing puzzle to: ${outputFilePath}`);
      await fs.writeFile(outputFilePath, JSON.stringify(puzzle, null, 2));
      console.log(`Successfully generated puzzle ${i + 1} with ${puzzle.words.length} words`);
    } else {
      console.error(`Failed to generate puzzle ${i + 1}`);
    }
  }
  console.log(`${count} puzzles have been generated and saved.`);
}

async function main() {
  const puzzleCount = 1; // Start with generating just one puzzle for testing
  const puzzleSize = 15; // Use a 15x15 grid
  await generateMultiplePuzzles(puzzleCount, puzzleSize);
}

main().catch(console.error);

