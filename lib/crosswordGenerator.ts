import fs from 'fs';
import path from 'path';

interface Word {
  word: string;
  clue: string;
}

interface PlacedWord {
  word: string;
  row: number;
  col: number;
  vertical: boolean;
}

class CrosswordGenerator {
  private words: Word[];
  private grid: string[][];
  private size: number;
  private minIntersections: number;

  constructor(wordlistPath: string, size: number = 20, minIntersections: number = 2) {
    this.words = this.loadWordlist(wordlistPath);
    this.size = size;
    this.grid = Array(size).fill(null).map(() => Array(size).fill(' '));
    this.minIntersections = minIntersections;
  }

  private loadWordlist(wordlistPath: string): Word[] {
    const data = fs.readFileSync(path.join(process.cwd(), wordlistPath), 'utf-8');
    return data.split('\n').map(line => {
      const [word, clue] = line.split('|');
      return { word: word.trim().toUpperCase(), clue: clue.trim() };
    });
  }

  private canPlaceWord(word: string, row: number, col: number, vertical: boolean): boolean {
    if (vertical) {
      if (row + word.length > this.size) return false;
      if (row > 0 && this.grid[row - 1][col] !== ' ') return false;
      if (row + word.length < this.size && this.grid[row + word.length][col] !== ' ') return false;
    } else {
      if (col + word.length > this.size) return false;
      if (col > 0 && this.grid[row][col - 1] !== ' ') return false;
      if (col + word.length < this.size && this.grid[row][col + word.length] !== ' ') return false;
    }

    for (let i = 0; i < word.length; i++) {
      const currentRow = vertical ? row + i : row;
      const currentCol = vertical ? col : col + i;
      if (this.grid[currentRow][currentCol] !== ' ' && this.grid[currentRow][currentCol] !== word[i]) {
        return false;
      }
    }

    return true;
  }

  private placeWord(word: string, row: number, col: number, vertical: boolean): void {
    for (let i = 0; i < word.length; i++) {
      if (vertical) {
        this.grid[row + i][col] = word[i];
      } else {
        this.grid[row][col + i] = word[i];
      }
    }
  }

  private countIntersections(word: string, row: number, col: number, vertical: boolean): number {
    let intersections = 0;
    for (let i = 0; i < word.length; i++) {
      const currentRow = vertical ? row + i : row;
      const currentCol = vertical ? col : col + i;
      if (this.grid[currentRow][currentCol] !== ' ' && this.grid[currentRow][currentCol] === word[i]) {
        intersections++;
      }
    }
    return intersections;
  }

  public generatePuzzle(): { grid: string[][], words: PlacedWord[] } {
    const placedWords: PlacedWord[] = [];

    // Sort words by length (descending) to place longer words first
    this.words.sort((a, b) => b.word.length - a.word.length);

    for (const { word } of this.words) {
      let placed = false;
      for (let attempts = 0; attempts < 200 && !placed; attempts++) {
        const row = Math.floor(Math.random() * this.size);
        const col = Math.floor(Math.random() * this.size);
        const vertical = Math.random() < 0.5;

        if (this.canPlaceWord(word, row, col, vertical) &&
            this.countIntersections(word, row, col, vertical) >= this.minIntersections) {
          this.placeWord(word, row, col, vertical);
          placedWords.push({ word, row, col, vertical });
          placed = true;
        }
      }
    }

    return { grid: this.grid, words: placedWords };
  }
}

export default CrosswordGenerator;