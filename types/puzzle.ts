export interface PuzzleWord {
  word: string;
  row: number;
  col: number;
  vertical: boolean;
  clue: string;
  number: number;
}

export interface Puzzle {
  grid: string[][];
  words: PuzzleWord[];
  width: number;
  height: number;
  cellNumbers: number[][];
  cluesAcross: Record<number, string>;
  cluesDown: Record<number, string>;
}

export interface WordListItem {
  word: string;
  clue: string;
}