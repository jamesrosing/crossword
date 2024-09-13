"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sun, Moon, Users } from "lucide-react"
import Header from "@/components/Header"

interface PuzzleGridProps {
  puzzle: Puzzle
  onCellChange: (row: number, col: number, value: string) => void
}

export default function PuzzleGrid({ puzzle, onCellChange }: PuzzleGridProps) {
  const { theme, setTheme } = useTheme()
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null)
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down' | null>(null)

  const handleClueClick = (clue: Clue, direction: 'across' | 'down') => {
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
          <svg
            viewBox={`0 0 ${puzzle.width * 40} ${puzzle.height * 40}`}
            className="w-full aspect-square"
          >
            {puzzle.cells.map((cell, index) => {
              const row = Math.floor(index / puzzle.width)
              const col = index % puzzle.width
              return (
                <g key={index}>
                  <rect
                    x={col * 40}
                    y={row * 40}
                    width="40"
                    height="40"
                    fill={cell.isBlack ? "black" : "white"}
                    stroke="black"
                  />
                  {cell.number && (
                    <text
                      x={col * 40 + 2}
                      y={row * 40 + 10}
                      fontSize="10"
                      textAnchor="start"
                    >
                      {cell.number}
                    </text>
                  )}
                  {!cell.isBlack && (
                    <foreignObject x={col * 40} y={row * 40} width="40" height="40">
                      <Input
                        className="w-full h-full text-center p-0 border-none focus:ring-0 uppercase text-lg"
                        maxLength={1}
                        value={cell.value || ''}
                        onChange={(e) => onCellChange(row, col, e.target.value)}
                      />
                    </foreignObject>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
        <div className="w-full sm:w-1/2 mt-4 sm:mt-0 sm:ml-4">
          <Tabs defaultValue="across" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="across" className="w-1/2">Across</TabsTrigger>
              <TabsTrigger value="down" className="w-1/2">Down</TabsTrigger>
            </TabsList>
            <TabsContent value="across">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                {puzzle.clues.across.map((clue) => (
                  <div
                    key={clue.number}
                    className={`p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded text-sm ${
                      selectedClue === clue && selectedDirection === 'across' ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => handleClueClick(clue, 'across')}
                  >
                    {clue.number}. {clue.clue}
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="down">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                {puzzle.clues.down.map((clue) => (
                  <div
                    key={clue.number}
                    className={`p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded text-sm ${
                      selectedClue === clue && selectedDirection === 'down' ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => handleClueClick(clue, 'down')}
                  >
                    {clue.number}. {clue.clue}
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