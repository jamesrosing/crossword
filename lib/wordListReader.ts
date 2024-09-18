import fs from 'fs/promises';
import path from 'path';
import { WordListItem } from '@/types/puzzle';

export async function readWordList(): Promise<WordListItem[]> {
  try {
    const wordlistPath = path.join(process.cwd(), 'data', 'wordlist.txt');
    const data = await fs.readFile(wordlistPath, 'utf-8');
    return data.split('\n').map(line => {
      const [word, clue] = line.split('|');
      return { word: word.trim(), clue: clue.trim() };
    });
  } catch (error) {
    console.error('Error reading wordlist:', error);
    const fallbackPath = path.join(process.cwd(), 'data', 'fallbackWordList.json');
    const fallbackData = await fs.readFile(fallbackPath, 'utf-8');
    return JSON.parse(fallbackData);
  }
}