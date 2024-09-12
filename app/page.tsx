'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import PuzzleGrid from '@/components/PuzzleGrid'
import ClueList from '@/components/ClueList'
import Header from '@/components/Header'
import './page.css'; // Import the CSS file for the animation

export default function Home() {
  const [puzzle, setPuzzle] = useState<any | null>(null);
  const [grid, setGrid] = useState<string[][]>([]);
  const [acrossClues, setAcrossClues] = useState<{ number: number; text: string }[]>([]);
  const [downClues, setDownClues] = useState<{ number: number; text: string }[]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [selectedClue, setSelectedClue] = useState<number | null>(null);

  useEffect(() => {
    async function fetchPuzzle() {
      try {
        const response = await fetch('/api/puzzle');
        const puzzleData = await response.json();
        setPuzzle(puzzleData);
        setGrid(puzzleData.grid);
        setAcrossClues(puzzleData.words.filter((word: any) => !word.vertical).map((word: any) => ({ number: parseInt(puzzleData.grid[word.row][word.col]), text: word.clue })));
        setDownClues(puzzleData.words.filter((word: any) => word.vertical).map((word: any) => ({ number: parseInt(puzzleData.grid[word.row][word.col]), text: word.clue })));
      } catch (error) {
        console.error('Failed to fetch puzzle:', error);
      }
    }

    fetchPuzzle();
  }, []);

  const handleCellChange = (row: number, col: number, value: string) => {
    const newGrid = [...grid];
    newGrid[row][col] = value;
    setGrid(newGrid);
  };

  const handleCellSelect = (row: number, col: number) => {
    setSelectedCell([row, col]);
    // Find the corresponding clue number and set it as selected
    const clueNumber = findClueNumber(row, col);
    setSelectedClue(clueNumber);
  };

  const handleClueSelect = (number: number) => {
    setSelectedClue(number);
    // Find the corresponding cell and set it as selected
    const cell = findCellForClue(number);
    if (cell) {
      setSelectedCell(cell);
    }
  };

  const findClueNumber = (row: number, col: number) => {
    // Implement logic to find the clue number for a given cell
    // This will depend on your puzzle data structure
    return parseInt(grid[row][col]); // Placeholder
  };

  const findCellForClue = (clueNumber: number): [number, number] | null => {
    // Implement logic to find the starting cell for a given clue number
    // This will depend on your puzzle data structure
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (parseInt(grid[row][col]) === clueNumber) {
          return [row, col];
        }
      }
    }
    return null; // Placeholder
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-center text-4xl font-extrabold mb-6 animated-slogan">
          <span className="initial">U      Y    M   , one word at a time.</span>
          <span className="final">Unlock your mind, one word at a time.</span>
        </h2>
        {puzzle ? (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PuzzleGrid
                  grid={grid}
                  onCellChange={handleCellChange}
                  selectedCell={selectedCell}
                  onCellSelect={handleCellSelect}
                />
              </div>
              <div className="space-y-6">
                <ClueList
                  type="across"
                  clues={acrossClues}
                  onClueSelect={handleClueSelect}
                  selectedClue={selectedClue}
                />
                <ClueList
                  type="down"
                  clues={downClues}
                  onClueSelect={handleClueSelect}
                  selectedClue={selectedClue}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-xl">Loading...</div>
        )}
      </div>
    </>
  );
}