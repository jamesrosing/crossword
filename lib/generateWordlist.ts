import axios from 'axios';
import fs from 'fs';

const WORD_COUNT = 1000;

async function getRandomWord() {
  const response = await axios.get('https://random-word-api.herokuapp.com/word');
  return response.data[0];
}

async function getWordDefinition(word: string) {
  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    return response.data[0].meanings[0].definitions[0].definition;
  } catch (error) {
    return null;
  }
}

async function generateWordlist() {
  const wordlist: string[] = [];
  const usedWords = new Set();

  while (wordlist.length < WORD_COUNT) {
    const word = await getRandomWord();
    if (usedWords.has(word)) continue;
    usedWords.add(word);

    const definition = await getWordDefinition(word);
    if (definition) {
      wordlist.push(`${word.toUpperCase()}|${definition}`);
    }

    if (wordlist.length % 100 === 0) {
      console.log(`Generated ${wordlist.length} words...`);
    }
  }

  fs.writeFileSync('wordlist.txt', wordlist.join('\n'));
  console.log('Wordlist generated successfully!');
}

generateWordlist();