'use client';

import React, { useState, useEffect } from 'react';
import PuzzleGrid from './PuzzleGrid';
import ClueList from './ClueList';
import GameControls from './GameControls';
import { Puzzle, PuzzleWord } from '@/types/puzzle';
import axios from 'axios';

export default function CrosswordApp() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [selectedClue, setSelectedClue] = useState<PuzzleWord | null>(null);

  useEffect(() => {
    fetchPuzzle();
  }, []);

  const fetchPuzzle = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/generate-puzzle');
      const fetchedPuzzle = response.data;
      setPuzzle(fetchedPuzzle);
      setUserGrid(Array(fetchedPuzzle.height).fill(null).map(() => Array(fetchedPuzzle.width).fill('')));
    } catch (error) {
      console.error('Error fetching puzzle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    const newGrid = [...userGrid];
    newGrid[row][col] = value;
    setUserGrid(newGrid);
  };

  const handleClueSelect = (clue: PuzzleWord) => {
    setSelectedClue(clue);
  };

  if (isLoading) {
    return <div>Loading puzzle...</div>;
  }

  if (!puzzle) {
    return <div>Failed to load puzzle. Please try again.</div>;
  }

  const acrossClues = puzzle.words.filter(word => !word.vertical);
  const downClues = puzzle.words.filter(word => word.vertical);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Daily Crossword</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <PuzzleGrid 
            puzzle={puzzle}
            userGrid={userGrid}
            onCellChange={handleCellChange}
            selectedClue={selectedClue}
            onClueSelect={handleClueSelect}
          />
          <GameControls />
        </div>
        <div className="lg:w-1/3">
          <div className="flex flex-col gap-8">
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
    </div>
  );
}
