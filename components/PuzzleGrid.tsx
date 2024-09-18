"use client"

import React, { useState, useRef, useEffect } from "react";
import { Puzzle, PuzzleWord } from "@/types/puzzle";
import { Button } from './ui/button';

interface PuzzleGridProps {
  puzzle: Puzzle;
  userGrid: string[][];
  onCellChange: (row: number, col: number, value: string) => void;
  selectedClue: PuzzleWord | null;
  onClueSelect: (clue: PuzzleWord) => void;
  activeCell: { row: number; col: number } | null;
  setActiveCell: React.Dispatch<React.SetStateAction<{ row: number; col: number } | null>>;
  incorrectCells: { row: number; col: number }[];
}

export default function PuzzleGrid({ 
  puzzle, 
  userGrid, 
  onCellChange, 
  selectedClue, 
  onClueSelect,
  activeCell,
  setActiveCell,
  incorrectCells
}: PuzzleGridProps) {
  const [hintsUsed, setHintsUsed] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedClue && gridRef.current) {
      const focusedCell = gridRef.current.querySelector(`[data-row="${selectedClue.row}"][data-col="${selectedClue.col}"]`) as HTMLInputElement;
      if (focusedCell) {
        focusedCell.focus();
      }
    }
  }, [selectedClue]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    const key = event.key;
    if (key.length === 1 && key.match(/[a-z]/i)) {
      onCellChange(row, col, key.toUpperCase());
      moveToNextCell(row, col);
    } else if (key === 'Backspace') {
      if (userGrid[row][col] !== '') {
        onCellChange(row, col, '');
      } else {
        moveToPreviousCell(row, col);
      }
    } else if (key === 'ArrowRight') {
      moveToNextCell(row, col);
    } else if (key === 'ArrowLeft') {
      moveToPreviousCell(row, col);
    } else if (key === 'ArrowDown') {
      moveDown(row, col);
    } else if (key === 'ArrowUp') {
      moveUp(row, col);
    }
  };

  const handleHint = () => {
    if (!activeCell || !puzzle) return;

    const { row, col } = activeCell;
    const correctLetter = puzzle.grid[row][col];

    if (userGrid[row][col] !== correctLetter) {
      const newGrid = [...userGrid];
      newGrid[row][col] = correctLetter;
      onCellChange(row, col, correctLetter);
      setHintsUsed(hintsUsed + 1);
    }
  };

  const moveToNextCell = (row: number, col: number) => {
    const nextCol = col + 1;
    if (nextCol < puzzle.width && puzzle.grid[row][nextCol] !== '#') {
      focusCell(row, nextCol);
    }
  };

  const moveToPreviousCell = (row: number, col: number) => {
    const prevCol = col - 1;
    if (prevCol >= 0 && puzzle.grid[row][prevCol] !== '#') {
      focusCell(row, prevCol);
    }
  };

  const moveDown = (row: number, col: number) => {
    const nextRow = row + 1;
    if (nextRow < puzzle.height && puzzle.grid[nextRow][col] !== '#') {
      focusCell(nextRow, col);
    }
  };

  const moveUp = (row: number, col: number) => {
    const prevRow = row - 1;
    if (prevRow >= 0 && puzzle.grid[prevRow][col] !== '#') {
      focusCell(prevRow, col);
    }
  };

  const focusCell = (row: number, col: number) => {
    const cell = gridRef.current?.querySelector(`[data-row="${row}"][data-col="${col}"]`) as HTMLInputElement;
    if (cell) {
      cell.focus();
    }
  };

  const isIncorrect = (row: number, col: number) => {
    return incorrectCells.some(cell => cell.row === row && cell.col === col);
  };

  return (
    <div ref={gridRef} className="grid gap-[1px] bg-gray-200 dark:bg-gray-700" style={{ gridTemplateColumns: `repeat(${puzzle.width}, 1fr)` }}>
      {puzzle.grid.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`relative aspect-square ${
              cell === '#' ? 'bg-black' : 'bg-white dark:bg-gray-800'
            } ${
              selectedClue &&
              ((selectedClue.vertical && colIndex === selectedClue.col && rowIndex >= selectedClue.row && rowIndex < selectedClue.row + selectedClue.word.length) ||
              (!selectedClue.vertical && rowIndex === selectedClue.row && colIndex >= selectedClue.col && colIndex < selectedClue.col + selectedClue.word.length))
                ? 'bg-blue-100 dark:bg-blue-900'
                : ''
            } ${
              isIncorrect(rowIndex, colIndex) ? 'bg-red-100 dark:bg-red-900' : ''
            } ${
              activeCell?.row === rowIndex && activeCell?.col === colIndex ? 'bg-blue-200' : ''
            }`}
            onClick={() => setActiveCell({ row: rowIndex, col: colIndex })}
          >
            {puzzle.cellNumbers[rowIndex][colIndex] > 0 && (
              <div className="absolute top-0 left-0 text-[8px] font-bold p-[1px] text-gray-800 dark:text-gray-200">
                {puzzle.cellNumbers[rowIndex][colIndex]}
              </div>
            )}
            {cell !== '#' && (
              <input
                type="text"
                maxLength={1}
                value={userGrid[rowIndex][colIndex]}
                className="w-full h-full text-center font-bold text-lg uppercase border-none outline-none bg-transparent text-gray-800 dark:text-gray-200"
                onChange={(e) => onCellChange(rowIndex, colIndex, e.target.value.toUpperCase())}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                data-row={rowIndex}
                data-col={colIndex}
              />
            )}
          </div>
        ))
      ))}
      <Button onClick={handleHint} disabled={hintsUsed >= 3}>Get Hint ({3 - hintsUsed} left)</Button>
    </div>
  );
}