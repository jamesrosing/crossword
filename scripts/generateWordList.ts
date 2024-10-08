const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config();


// Check if the API key is set
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is not set.');
  process.exit(1);
}

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Paths for output
const wordListPath = path.join(process.cwd(), 'crossword-master', 'data', 'nyt_wordlist.txt');

// NYT Credentials
const NYT_USERNAME = process.env.NYT_USERNAME || 'mollierosing@gmail.com';  // Best practice: move sensitive info to .env
const NYT_PASSWORD = process.env.NYT_PASSWORD || 'Willow2020*';

// Function to log in to New York Times Crossword and scrape data
async function scrapeNYTCrossword() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Go to the NYT login page
  await page.goto('https://myaccount.nytimes.com/auth/login', { waitUntil: 'networkidle0' });

  // Enter the login credentials
  await page.type('#username', NYT_USERNAME);
  await page.type('#password', NYT_PASSWORD);
  await page.click('button[type="submit"]');

  // Wait for the login to complete and the page to load
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // Navigate to the crossword puzzle page
  await page.goto('https://www.nytimes.com/crosswords', { waitUntil: 'networkidle0' });

  // Extract crossword data (example: for a specific puzzle)
  const crosswordUrl = 'https://www.nytimes.com/crosswords/game/mini';  // Example URL for a mini puzzle
  await page.goto(crosswordUrl, { waitUntil: 'networkidle0' });

  // Scrape crossword words and clues using puppeteer
  const crosswordData = await page.evaluate(() => {
    const wordCluePairs: { word: string; clue: string }[] = [];
    const clues = document.querySelectorAll('.ClueList-list--2dD5F .Clue-text--3lZl7');
    const words = document.querySelectorAll('.Cell-letter--3ofWz');
    
    clues.forEach((clueElem, index) => {
      const clue = clueElem.textContent?.trim() || '';
      const word = words[index]?.textContent?.trim() || '';
      if (word && clue) {
        wordCluePairs.push({ word, clue });
      }
    });

    return wordCluePairs;
  });

  await browser.close();
  return crosswordData;
}

// Function to generate clues using OpenAI
async function generateClues(words: string[]): Promise<string[]> {
  const prompt = `Generate short, cryptic crossword clues for the following words. Each clue should be concise and challenging, suitable for a crossword puzzle:

${words.join('\n')}

Provide the clues in the same order as the words, one per line.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const clues = response.choices[0].message.content?.split('\n') || [];
  return clues.map((clue: string) => clue.replace(/^\d+\.\s*/, '').trim());
}

// Main function to scrape and generate puzzles
async function generateWordlist() {
  const wordCluePairs = await scrapeNYTCrossword();
  console.log(`Scraped ${wordCluePairs.length} words and clues from NYT.`);

  const outputPath = path.join(process.cwd(), 'data', 'wordlist.txt');
  const outputStream = fs.createWriteStream(outputPath);

  for (const pair of wordCluePairs) {
    outputStream.write(`${pair.word}|${pair.clue}\n`);
  }

  outputStream.end(() => {
    console.log(`Generated wordlist at ${outputPath}`);
  });
}

generateWordlist().catch(console.error);
