"use client"

import React, { useState } from "react"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/Header"

interface PuzzleWord {
  word: string;
  row: number;
  col: number;
  vertical: boolean;
  clue: string;
  number: number;
}

interface Puzzle {
  grid: string[][];
  words: PuzzleWord[];
  width: number;
  height: number;
}

interface PuzzleGridProps {
  puzzle: Puzzle;
  onCellChange: (row: number, col: number, value: string) => void;
}

export default function PuzzleGrid({ puzzle, onCellChange }: PuzzleGridProps) {
  const { theme } = useTheme()
  const [selectedClue, setSelectedClue] = useState<PuzzleWord | null>(null)
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down' | null>(null)

  const handleClueClick = (clue: PuzzleWord, direction: 'across' | 'down') => {
    setSelectedClue(clue)
    setSelectedDirection(direction)
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow flex flex-col sm:flex-row overflow-hidden p-4">
        <div className="w-full sm:w-1/2 flex flex-col">
          {selectedClue && (
            <div className="mb-4 p-2 bg-primary text-primary-foreground rounded text-sm">
              {selectedClue.number}{selectedDirection === 'across' ? 'A' : 'D'}: {selectedClue.clue}
            </div>
          )}
          <div className="grid grid-cols-15 gap-px bg-gray-200 p-px border border-gray-300">
            {puzzle.grid.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`relative w-full pb-[100%] ${
                      cell === ' ' ? 'bg-black' : 'bg-white dark:bg-gray-800'
                    } ${
                      selectedClue &&
                      ((selectedClue.vertical && colIndex === selectedClue.col && rowIndex >= selectedClue.row && rowIndex < selectedClue.row + selectedClue.word.length) ||
                      (!selectedClue.vertical && rowIndex === selectedClue.row && colIndex >= selectedClue.col && colIndex < selectedClue.col + selectedClue.word.length))
                        ? 'bg-blue-200 dark:bg-blue-800'
                        : ''
                    }`}
                  >
                    {puzzle.words.find(word => word.row === rowIndex && word.col === colIndex) && (
                      <div className="absolute top-0 left-0 text-xs font-bold p-0.5 text-gray-800 dark:text-gray-200">
                        {puzzle.words.find(word => word.row === rowIndex && word.col === colIndex)?.number}
                      </div>
                    )}
                    {cell !== ' ' && (
                      <Input
                        type="text"
                        maxLength={1}
                        className="absolute inset-0 w-full h-full text-center font-bold text-lg uppercase border-none outline-none bg-transparent text-gray-800 dark:text-gray-200"
                        onChange={(e) => onCellChange(rowIndex, colIndex, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="w-full sm:w-1/2 mt-4 sm:mt-0 sm:ml-4">
          <Tabs defaultValue="across" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="across" className="w-1/2">Across</TabsTrigger>
              <TabsTrigger value="down" className="w-1/2">Down</TabsTrigger>
            </TabsList>
            <TabsContent value="across">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                {puzzle.words.filter(word => !word.vertical).map((word) => (
                  <div
                    key={word.number}
                    className={`p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded text-sm ${
                      selectedClue === word && selectedDirection === 'across' ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => handleClueClick(word, 'across')}
                  >
                    {word.number}. {word.clue}
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="down">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                {puzzle.words.filter(word => word.vertical).map((word) => (
                  <div
                    key={word.number}
                    className={`p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded text-sm ${
                      selectedClue === word && selectedDirection === 'down' ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => handleClueClick(word, 'down')}
                  >
                    {word.number}. {word.clue}
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}