import React from 'react';

type GridCell = {
  letter: string
  number: number | null
  isBlack: boolean
}

type PuzzleGridProps = {
  grid: GridCell[][]
  onCellChange: (row: number, col: number, value: string) => void
  selectedCell: [number, number] | null
  onCellSelect: (row: number, col: number) => void
}

const PuzzleGrid: React.FC<PuzzleGridProps> = ({ grid, onCellChange, selectedCell, onCellSelect }) => {
  return (
    <div className="puzzle-grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="puzzle-row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`puzzle-cell ${cell.isBlack ? 'black-cell' : ''} ${selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex ? 'selected-cell' : ''}`}
              onClick={() => onCellSelect(rowIndex, colIndex)}
            >
              {cell.number && <div className="cell-number">{cell.number}</div>}
              {!cell.isBlack && (
                <input
                  type="text"
                  value={cell.letter}
                  onChange={(e) => onCellChange(rowIndex, colIndex, e.target.value)}
                  maxLength={1}
                  className="cell-input"
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default PuzzleGrid;