import { Puzzle, PuzzleWord } from '@/types/puzzle';
import { generateClue } from './clueGenerator';

export class CrosswordGenerator {
  private grid: string[][];
  private size: number;
  private words: string[];

  constructor(size: number) {
    this.size = size;
    this.grid = Array(size).fill(null).map(() => Array(size).fill('#'));
    this.words = [];
  }

  async generatePuzzle(words: string[]): Promise<Puzzle | null> {
    this.words = words.sort((a, b) => b.length - a.length);
    const placedWords: PuzzleWord[] = [];

    for (const word of this.words) {
      const placement = this.findBestPlacement(word);
      if (placement) {
        this.placeWord(word, placement.row, placement.col, placement.vertical);
        placedWords.push({
          word,
          row: placement.row,
          col: placement.col,
          vertical: placement.vertical,
          clue: await generateClue(word),
          number: placedWords.length + 1
        });
      }
    }

    if (placedWords.length < this.words.length * 0.7) {
      console.log("Not enough words placed. Increasing grid size and retrying.");
      this.size += 2;
      return this.generatePuzzle(words);
    }

    const cluesAcross: Record<number, string> = {};
    const cluesDown: Record<number, string> = {};

    placedWords.forEach(word => {
      if (word.vertical) {
        cluesDown[word.number] = word.clue;
      } else {
        cluesAcross[word.number] = word.clue;
      }
    });

    return {
      grid: this.grid,
      words: placedWords,
      width: this.size,
      height: this.size,
      cellNumbers: this.generateCellNumbers(),
      cluesAcross,
      cluesDown
    };
  }

  private findBestPlacement(word: string): { row: number; col: number; vertical: boolean } | null {
    let bestScore = -1;
    let bestPlacement = null;

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const horizontalScore = this.scorePlacement(word, row, col, false);
        if (horizontalScore > bestScore) {
          bestScore = horizontalScore;
          bestPlacement = { row, col, vertical: false };
        }

        const verticalScore = this.scorePlacement(word, row, col, true);
        if (verticalScore > bestScore) {
          bestScore = verticalScore;
          bestPlacement = { row, col, vertical: true };
        }
      }
    }

    return bestPlacement;
  }

  private scorePlacement(word: string, row: number, col: number, vertical: boolean): number {
    if (!this.canPlaceWord(word, row, col, vertical)) {
      return -1;
    }

    let score = 0;
    let intersections = 0;

    for (let i = 0; i < word.length; i++) {
      const currentRow = vertical ? row + i : row;
      const currentCol = vertical ? col : col + i;

      if (this.grid[currentRow][currentCol] === word[i]) {
        score += 2;
        intersections++;
      } else if (this.grid[currentRow][currentCol] === '#') {
        score += 1;
      }
    }

    return intersections > 0 ? score : -1;
  }

  private canPlaceWord(word: string, row: number, col: number, vertical: boolean): boolean {
    if (vertical && row + word.length > this.size) return false;
    if (!vertical && col + word.length > this.size) return false;

    for (let i = 0; i < word.length; i++) {
      const currentRow = vertical ? row + i : row;
      const currentCol = vertical ? col : col + i;

      if (currentRow < 0 || currentRow >= this.size || currentCol < 0 || currentCol >= this.size) {
        return false;
      }

      if (this.grid[currentRow][currentCol] !== '#' && this.grid[currentRow][currentCol] !== word[i]) {
        return false;
      }

      if (i > 0) {
        const adjacentRow = vertical ? currentRow - 1 : currentRow;
        const adjacentCol = vertical ? currentCol : currentCol - 1;
        if (this.isValidCell(adjacentRow, adjacentCol) && this.grid[adjacentRow][adjacentCol] !== '#') {
          return false;
        }
      }

      if (i < word.length - 1) {
        const adjacentRow = vertical ? currentRow + 1 : currentRow;
        const adjacentCol = vertical ? currentCol : currentCol + 1;
        if (this.isValidCell(adjacentRow, adjacentCol) && this.grid[adjacentRow][adjacentCol] !== '#') {
          return false;
        }
      }
    }

    return true;
  }

  private isValidCell(row: number, col: number): boolean {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
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

  private generateCellNumbers(): number[][] {
    const cellNumbers = Array(this.size).fill(null).map(() => Array(this.size).fill(0));
    let number = 1;

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.grid[row][col] !== '#' &&
            (this.isStartOfWord(row, col, true) || this.isStartOfWord(row, col, false))) {
          cellNumbers[row][col] = number++;
        }
      }
    }

    return cellNumbers;
  }

  private isStartOfWord(row: number, col: number, vertical: boolean): boolean {
    if (vertical) {
      return row === 0 || this.grid[row - 1][col] === '#';
    } else {
      return col === 0 || this.grid[row][col - 1] === '#';
    }
  }
}

export function testSymmetry(puzzle: Puzzle): boolean {
  const { grid, width, height } = puzzle;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const mirrorRow = height - 1 - row;
      const mirrorCol = width - 1 - col;
      if ((grid[row][col] === '#') !== (grid[mirrorRow][mirrorCol] === '#')) {
        console.error(`Asymmetry found at (${row}, ${col}) and (${mirrorRow}, ${mirrorCol})`);
        return false;
      }
    }
  }
  console.log('Puzzle is symmetrical');
  return true;
}











