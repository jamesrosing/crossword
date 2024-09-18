import { Puzzle, PuzzleWord } from '@/types/puzzle';
import { generateClue } from './clueGenerator';

export class CrosswordGenerator {
  private grid: string[][];
  private size: number;
  private lastPlacedRow: number;
  private lastPlacedCol: number;
  private lastPlacedVertical: boolean;

  constructor(size: number) {
    this.size = size;
    this.grid = Array(size).fill(null).map(() => Array(size).fill('#'));
    this.lastPlacedRow = -1;
    this.lastPlacedCol = -1;
    this.lastPlacedVertical = false;
  }

  async generatePuzzle(words: string[]): Promise<Puzzle | null> {
    // Sort words by length in descending order
    const sortedWords = words.sort((a, b) => b.length - a.length);
    
    const maxAttempts = 3;
    const placedWords: PuzzleWord[] = [];
    const skippedWords: string[] = [];

    for (const word of sortedWords) {
      let placed = false;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (await this.placeWord(word)) {
          placed = true;
          placedWords.push({
            word,
            row: this.lastPlacedRow,
            col: this.lastPlacedCol,
            vertical: this.lastPlacedVertical,
            clue: await generateClue(word),
            number: placedWords.length + 1,
          });
          break;
        }
      }
      if (!placed) {
        skippedWords.push(word);
      }
    }

    // Try to place skipped words
    for (const word of skippedWords) {
      if (await this.placeWord(word)) {
        placedWords.push({
          word,
          row: this.lastPlacedRow,
          col: this.lastPlacedCol,
          vertical: this.lastPlacedVertical,
          clue: await generateClue(word),
          number: placedWords.length + 1,
        });
      }
    }

    console.log(`Placed ${placedWords.length} words out of ${words.length}`);

    if (placedWords.length < words.length * 0.7) {  // If less than 70% of words are placed
      console.log("Not enough words placed. Increasing grid size and retrying.");
      this.size += 2;  // Increase grid size
      return this.generatePuzzle(words);  // Retry with increased grid size
    }

    return {
      grid: this.grid,
      words: placedWords,
      width: this.size,
      height: this.size,
      cellNumbers: this.generateCellNumbers(),
    };
  }

  private async placeWord(word: string): Promise<boolean> {
    const positions = this.getPossiblePositions(word);
    if (positions.length === 0) return false;

    const [row, col, vertical] = positions[Math.floor(Math.random() * positions.length)];

    if (vertical) {
      for (let i = 0; i < word.length; i++) {
        this.grid[row + i][col] = word[i];
      }
    } else {
      for (let i = 0; i < word.length; i++) {
        this.grid[row][col + i] = word[i];
      }
    }

    this.lastPlacedRow = row;
    this.lastPlacedCol = col;
    this.lastPlacedVertical = vertical;
    return true;
  }

  private getPossiblePositions(word: string): [number, number, boolean][] {
    const positions: [number, number, boolean][] = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.canPlaceWordHorizontally(word, row, col)) {
          positions.push([row, col, false]);
        }
        if (this.canPlaceWordVertically(word, row, col)) {
          positions.push([row, col, true]);
        }
      }
    }

    return positions;
  }

  private canPlaceWordHorizontally(word: string, row: number, col: number): boolean {
    if (col + word.length > this.size) return false;
    if (col > 0 && this.grid[row][col - 1] !== '#') return false;
    if (col + word.length < this.size && this.grid[row][col + word.length] !== '#') return false;

    let intersections = 0;
    for (let i = 0; i < word.length; i++) {
      if (this.grid[row][col + i] !== '#' && this.grid[row][col + i] !== word[i]) return false;
      if (this.grid[row][col + i] === word[i]) intersections++;
    }

    return intersections > 0 || col === 0 || col + word.length === this.size;
  }

  private canPlaceWordVertically(word: string, row: number, col: number): boolean {
    if (row + word.length > this.size) return false;
    if (row > 0 && this.grid[row - 1][col] !== '#') return false;
    if (row + word.length < this.size && this.grid[row + word.length][col] !== '#') return false;

    let intersections = 0;
    for (let i = 0; i < word.length; i++) {
      if (this.grid[row + i][col] !== '#' && this.grid[row + i][col] !== word[i]) return false;
      if (this.grid[row + i][col] === word[i]) intersections++;
    }

    return intersections > 0 || row === 0 || row + word.length === this.size;
  }

  private generateCellNumbers(): number[][] {
    const cellNumbers = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
    let cellNumber = 1;
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.grid[row][col] !== '#' && 
            (this.isStartOfHorizontalWord(row, col) || this.isStartOfVerticalWord(row, col))) {
          cellNumbers[row][col] = cellNumber;
          cellNumber++;
        }
      }
    }
    return cellNumbers;
  }

  private isStartOfHorizontalWord(row: number, col: number): boolean {
    return (col === 0 || this.grid[row][col - 1] === '#') && 
           (col < this.size - 1 && this.grid[row][col + 1] !== '#');
  }

  private isStartOfVerticalWord(row: number, col: number): boolean {
    return (row === 0 || this.grid[row - 1][col] === '#') && 
           (row < this.size - 1 && this.grid[row + 1][col] !== '#');
  }
}


