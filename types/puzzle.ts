export interface PuzzleWord {
  word: string;
  row: number;
  col: number;
  vertical: boolean;
  clue: string;
  number: number;
}

export interface Puzzle {
  id: string;
  title: string;
  difficulty: string;
  width: number;
  height: number;
  grid: string[][];
  words: string;
  cellNumbers: number[][];
  cluesAcross: Record<string, string>;
  cluesDown: Record<string, string>;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}