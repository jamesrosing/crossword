import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PuzzleGridProps {
  grid: string[][];
  onCellChange: (row: number, col: number, value: string) => void;
  selectedCell: [number, number] | null;
  onCellSelect: (row: number, col: number) => void;
}

const PuzzleGrid: React.FC<PuzzleGridProps> = ({ grid, onCellChange, selectedCell, onCellSelect }) => {
  const [focusedCell, setFocusedCell] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (selectedCell) {
      setFocusedCell(selectedCell);
    }
  }, [selectedCell]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    if (e.key === 'ArrowRight') {
      setFocusedCell([row, Math.min(col + 1, grid[0].length - 1)]);
    } else if (e.key === 'ArrowLeft') {
      setFocusedCell([row, Math.max(col - 1, 0)]);
    } else if (e.key === 'ArrowDown') {
      setFocusedCell([Math.min(row + 1, grid.length - 1), col]);
    } else if (e.key === 'ArrowUp') {
      setFocusedCell([Math.max(row - 1, 0), col]);
    }
  };

  useEffect(() => {
    if (focusedCell) {
      const input = document.getElementById(`cell-${focusedCell[0]}-${focusedCell[1]}`);
      if (input) {
        (input as HTMLInputElement).focus();
      }
    }
  }, [focusedCell]);

  return (
    <div className="grid gap-px bg-gray-200" style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}>
      {grid.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((cell, colIndex) => (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: (rowIndex + colIndex) * 0.01 }}
              className="relative w-8 h-8 sm:w-10 sm:h-10 border border-gray-400"
            >
              <input
                id={`cell-${rowIndex}-${colIndex}`}
                type="text"
                maxLength={1}
                value={cell === '#' ? '' : cell}
                onChange={(e) => onCellChange(rowIndex, colIndex, e.target.value.toUpperCase())}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                onClick={() => onCellSelect(rowIndex, colIndex)}
                className={`w-full h-full text-center font-bold text-lg sm:text-xl ${
                  cell === '#' ? 'bg-gray-400 text-gray-400' : 'bg-white text-black'
                } focus:outline-none focus:ring-2 focus:ring-accent`}
                readOnly={cell === '#'}
              />
              {cell !== ' ' && cell !== '#' && (
                <div className="absolute top-0 left-0 text-xs text-gray-500">{cell}</div>
              )}
            </motion.div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default PuzzleGrid;