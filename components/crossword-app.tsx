'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PuzzleGrid from './PuzzleGrid';
import ClueList from './ClueList';
import GameControls from './GameControls';
import AnimatedSlogan from './AnimatedSlogan';
import Header from './Header';
import { Puzzle, PuzzleWord } from '@/types/puzzle';
import axios from 'axios';
import { useCustomToast } from "@/hooks/use-custom-toast";
import { showToast } from "@/utils/toast-utils";
import { getAIPoweredHint } from '@/lib/aiHints';

export default function CrosswordApp() {
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [selectedClue, setSelectedClue] = useState<PuzzleWord | null>(null);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [incorrectCells, setIncorrectCells] = useState<{ row: number; col: number }[]>([]);
  const [isAIHintAvailable, setIsAIHintAvailable] = useState(true);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const { showSuccessToast, showErrorToast, showInfoToast } = useCustomToast();

  const fetchPuzzle = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<Puzzle>('/api/generate-puzzle');
      const fetchedPuzzle = response.data;
      setPuzzle(fetchedPuzzle);
      setUserGrid(Array(fetchedPuzzle.height).fill(null).map(() => Array(fetchedPuzzle.width).fill('')));
      setIsTimerRunning(true);
      showSuccessToast("Puzzle Loaded", "Good luck solving!");
    } catch (error) {
      console.error('Error fetching puzzle:', error);
      showErrorToast("Error", "Failed to load puzzle. Please try again.");
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

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!activeCell || !puzzle) return;

    const { row, col } = activeCell;
    let newRow = row;
    let newCol = col;

    switch (event.key) {
      case 'ArrowRight':
        newCol = Math.min(col + 1, puzzle.width - 1);
        break;
      case 'ArrowLeft':
        newCol = Math.max(col - 1, 0);
        break;
      case 'ArrowUp':
        newRow = Math.max(row - 1, 0);
        break;
      case 'ArrowDown':
        newRow = Math.min(row + 1, puzzle.height - 1);
        break;
    }

    setActiveCell({ row: newRow, col: newCol });
    highlightClue(newRow, newCol);
  }, [activeCell, puzzle]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const highlightClue = (row: number, col: number) => {
    if (!puzzle) return;
    const word = puzzle.words.find(w => 
      (w.vertical && w.col === col && row >= w.row && row < w.row + w.word.length) ||
      (!w.vertical && w.row === row && col >= w.col && col < w.col + w.word.length)
    );
    if (word) {
      setSelectedClue(word);
    }
  };

  const handleReset = () => {
    if (puzzle) {
      setUserGrid(Array(puzzle.height).fill(null).map(() => Array(puzzle.width).fill('')));
      setIsTimerRunning(true);
    }
  };

  const handleCheck = () => {
    if (!puzzle) return;

    const newIncorrectCells: { row: number; col: number }[] = [];
    let allCorrect = true;

    for (let row = 0; row < puzzle.height; row++) {
      for (let col = 0; col < puzzle.width; col++) {
        if (puzzle.grid[row][col] !== '#') {
          if (userGrid[row][col] !== '' && userGrid[row][col] !== puzzle.grid[row][col]) {
            newIncorrectCells.push({ row, col });
            allCorrect = false;
          }
        }
      }
    }

    setIncorrectCells(newIncorrectCells);

    if (allCorrect) {
      showSuccessToast("Congratulations!", "All filled cells are correct!");
    } else {
      showErrorToast("Keep trying!", `${newIncorrectCells.length} cells are incorrect.`);
    }
  };

  const handleReveal = () => {
    if (!puzzle) return;

    const newGrid = userGrid.map((row, rowIndex) =>
      row.map((cell, colIndex) =>
        puzzle.grid[rowIndex][colIndex] === '#' ? '#' : puzzle.grid[rowIndex][colIndex]
      )
    );

    setUserGrid(newGrid);
    setIncorrectCells([]);
    setIsTimerRunning(false);

    showInfoToast("Puzzle Revealed", "The correct solution has been revealed.");
  };

  const handleGetHint = async () => {
    if (!puzzle || !selectedClue) return;

    setIsHintLoading(true);
    try {
      const hint = await getAIPoweredHint(puzzle, selectedClue.number, selectedClue.vertical ? 'down' : 'across');
      if (hint === "AI hints are currently unavailable. Please try again later.") {
        setIsAIHintAvailable(false);
        showErrorToast("AI Hint Unavailable", "Please try again later.");
      } else {
        showInfoToast("AI Hint", hint);
      }
    } catch (error) {
      console.error('Error getting AI hint:', error);
      showErrorToast("Error", "Failed to get AI hint. Please try again.");
    } finally {
      setIsHintLoading(false);
    }
  };

  useEffect(() => {
    if (isTimerRunning) {
      const timer = setTimeout(() => {
        showToast("Still there?", "You haven't made a move in a while.", "info")
      }, 300000) // 5 minutes

      return () => clearTimeout(timer)
    }
  }, [isTimerRunning, userGrid]);

  if (!showPuzzle) {
    return (
      <div 
        className="flex items-center justify-center h-screen cursor-pointer"
        onClick={() => {
          setShowPuzzle(true);
          fetchPuzzle();
        }}
      >
        <AnimatedSlogan />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Daily Crossword</h1>
        {isLoading ? (
          <div>Loading puzzle...</div>
        ) : puzzle ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <PuzzleGrid 
                puzzle={puzzle}
                userGrid={userGrid}
                onCellChange={handleCellChange}
                selectedClue={selectedClue}
                onClueSelect={handleClueSelect}
                activeCell={activeCell}
                setActiveCell={setActiveCell}
                incorrectCells={incorrectCells}
              />
              <GameControls 
                isTimerRunning={isTimerRunning}
                onReset={handleReset}
                onCheck={handleCheck}
                onReveal={handleReveal}
                onGetHint={handleGetHint}
                isHintLoading={isHintLoading}
                isAIHintAvailable={isAIHintAvailable}
              />
            </div>
            <div className="lg:w-1/3">
              <div className="flex flex-col gap-8">
                <ClueList 
                  type="across"
                  clues={Object.entries(puzzle.cluesAcross).map(([number, clue]) => ({
                    number: parseInt(number),
                    clue,
                    word: '',
                    row: 0,
                    col: 0,
                    vertical: false
                  }))}
                  onClueSelect={handleClueSelect}
                  selectedClue={selectedClue}
                />
                <ClueList 
                  type="down"
                  clues={Object.entries(puzzle.cluesDown).map(([number, clue]) => ({
                    number: parseInt(number),
                    clue,
                    word: '',
                    row: 0,
                    col: 0,
                    vertical: true
                  }))}
                  onClueSelect={handleClueSelect}
                  selectedClue={selectedClue}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>Failed to load puzzle. Please try again.</div>
        )}
      </main>
    </div>
  );
}
