import axios from 'axios';

const WORD_COUNT = 50;

async function getRandomWord() {
  const response = await axios.get('https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=1000&minLength=3&maxLength=15&api_key=YOUR_API_KEY');
  return response.data.word;
}

async function getWordDefinition(word: string) {
  try {
    const response = await axios.get(`https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&includeRelated=false&useCanonical=false&includeTags=false&api_key=YOUR_API_KEY`);
    return response.data[0].text;
  } catch (error) {
    return null;
  }
}

export async function generateWordList(count: number = WORD_COUNT): Promise<string[]> {
  const wordlist: string[] = [];
  const usedWords = new Set();

  while (wordlist.length < count) {
    const word = await getRandomWord();
    if (usedWords.has(word) || word.length < 3 || word.length > 15) continue;
    usedWords.add(word);

    const definition = await getWordDefinition(word);
    if (definition) {
      wordlist.push(`${word.toUpperCase()}|${definition}`);
    }

    if (wordlist.length % 10 === 0) {
      console.log(`Generated ${wordlist.length} words...`);
    }
  }

  return wordlist;
}