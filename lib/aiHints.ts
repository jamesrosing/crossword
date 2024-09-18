import OpenAI from 'openai';
import { Puzzle, PuzzleWord } from '@/types/puzzle';

let openai: OpenAI | null = null;

try {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY is not set. AI-powered hints will not be available.');
  } else {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
}

export async function getAIPoweredHint(puzzle: Puzzle, clueNumber: number, direction: 'across' | 'down'): Promise<string> {
  const clue = direction === 'across' ? puzzle.cluesAcross[clueNumber] : puzzle.cluesDown[clueNumber];
  const word = puzzle.words.find(w => w.number === clueNumber && w.vertical === (direction === 'down'));

  if (!clue || !word) {
    throw new Error('Clue or word not found');
  }

  if (!openai) {
    return "AI hints are currently unavailable. Please try again later.";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant for a crossword puzzle game. Provide a hint for the given clue without directly revealing the answer."
        },
        { 
          role: "user", 
          content: `Provide a helpful hint for this crossword clue: "${clue}". The answer is ${word.word.length} letters long.`
        }
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    return response.choices[0].message.content?.trim() || "Unable to generate hint";
  } catch (error) {
    console.error('Error generating AI hint:', error);
    return "Error generating hint. Please try again.";
  }
}