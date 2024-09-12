import path from 'path';

interface Word {
  word: string;
  clue: string;
  difficulty: number;
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
  private theme: string | null;

  constructor(words: Word[], size: number = 15, minIntersections: number = 3, theme: string | null = null) {
    this.words = words;
    this.size = size;
    this.grid = Array(size).fill(null).map(() => Array(size).fill(' '));
    this.minIntersections = minIntersections;
    this.theme = theme;
  }

  private calculateDifficulty(word: string): number {
    const uncommonLetters = 'JQXZ';
    return word.length + word.split('').filter(char => uncommonLetters.includes(char)).length;
  }

  private canPlaceWord(word: string, row: number, col: number, horizontal: boolean): boolean {
    if (horizontal) {
      if (col + word.length > this.size) return false;
      if (col > 0 && this.grid[row][col - 1] !== ' ') return false;
      if (col + word.length < this.size && this.grid[row][col + word.length] !== ' ') return false;
    } else {
      if (row + word.length > this.size) return false;
      if (row > 0 && this.grid[row - 1][col] !== ' ') return false;
      if (row + word.length < this.size && this.grid[row + word.length][col] !== ' ') return false;
    }

    for (let i = 0; i < word.length; i++) {
      const currentRow = horizontal ? row : row + i;
      const currentCol = horizontal ? col + i : col;
      if (this.grid[currentRow][currentCol] !== ' ' && this.grid[currentRow][currentCol] !== word[i]) {
        return false;
      }
    }

    return true;
  }

  private placeWord(word: string, row: number, col: number, horizontal: boolean): void {
    for (let i = 0; i < word.length; i++) {
      if (horizontal) {
        this.grid[row][col + i] = word[i];
      } else {
        this.grid[row + i][col] = word[i];
      }
    }
  }

  private countIntersections(word: string, row: number, col: number, horizontal: boolean): number {
    let intersections = 0;
    for (let i = 0; i < word.length; i++) {
      const currentRow = horizontal ? row : row + i;
      const currentCol = horizontal ? col + i : col;
      if (this.grid[currentRow][currentCol] !== ' ' && this.grid[currentRow][currentCol] === word[i]) {
        intersections++;
      }
    }
    return intersections;
  }

  public generatePuzzle(difficulty: 'easy' | 'medium' | 'hard'): { grid: string[][], words: PlacedWord[] } {
    const difficultyThresholds = { easy: 5, medium: 8, hard: 11 };
    const difficultyThreshold = difficultyThresholds[difficulty];
    
    const wordsToUse = this.theme 
      ? this.words.filter(word => word.clue.toLowerCase().includes(this.theme!.toLowerCase()))
      : this.words;

    wordsToUse.sort((a, b) => a.difficulty - b.difficulty);

    const placedWords: PlacedWord[] = [];

    for (const word of wordsToUse) {
      if (word.difficulty > difficultyThreshold) continue;

      let placed = false;
      for (let attempts = 0; attempts < 100 && !placed; attempts++) {
        const row = Math.floor(Math.random() * this.size);
        const col = Math.floor(Math.random() * this.size);
        const horizontal = Math.random() < 0.5;

        if (this.canPlaceWord(word.word, row, col, horizontal) &&
            this.countIntersections(word.word, row, col, horizontal) >= this.minIntersections) {
          this.placeWord(word.word, row, col, horizontal);
          placedWords.push({ word: word.word, row, col, vertical: !horizontal });
          placed = true;
        }
      }
    }

    return { grid: this.grid, words: placedWords };
  }

  public getGrid(): string[][] {
    return this.grid;
  }
}

export default CrosswordGenerator;