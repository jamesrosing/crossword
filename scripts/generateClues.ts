import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Word {
  word: string;
  clue: string;
}

async function generateClue(word: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Generate a clever and concise crossword puzzle clue for the word "${word}":` }],
      max_tokens: 50,
    });

    return response.choices[0].message.content?.trim() || "Clue generation failed";
  } catch (error) {
    console.error(`Error generating clue for ${word}:`, error);
    return "Clue generation failed";
  }
}

async function generateCluesForWords(words: string[]): Promise<Word[]> {
  const clues: Word[] = [];
  for (const word of words) {
    const clue = await generateClue(word);
    clues.push({ word, clue });
  }
  return clues;
}

async function processWordList() {
  const wordlistPath = path.join(__dirname, '../data', 'wordlist.txt');
  console.log(`Reading word list from: ${wordlistPath}`); // Debug print
  const words = (await fs.readFile(wordlistPath, 'utf-8')).split('\n');
  const clues = await generateCluesForWords(words);
  const outputFilePath = path.join(__dirname, '../generatedClues.json');
  console.log(`Writing clues to: ${outputFilePath}`); // Debug print
  await fs.writeFile(outputFilePath, JSON.stringify(clues, null, 2));
  console.log(`Clues generated for word list.`);
}

async function main() {
  await processWordList();
}

main().catch(console.error);