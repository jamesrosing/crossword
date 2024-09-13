import { promises as fs } from 'fs';
import path from 'path';

// ... existing code ...
async function checkWordlist() {
  const wordlistPath = path.join(process.cwd(), 'data', 'wordlist.txt');
  
  try {
    const data = await fs.readFile(wordlistPath, 'utf-8');
    const lines = data.split('\n');
    
    let isValid = true;
    lines.forEach((line, index) => {
      if (!line.includes('|')) {
        console.error(`Error on line ${index + 1}: Missing separator '|'`);
        isValid = false;
      }
    });
    
    if (isValid) {
      console.log(`Wordlist is valid. Total words: ${lines.length}`);
    } else {
      console.error('Wordlist has formatting errors. Please fix and try again.');
    }
  } catch (error) {
    console.error('Error reading wordlist:', error);
  }
}

checkWordlist();