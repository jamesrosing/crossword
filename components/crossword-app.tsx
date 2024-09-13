'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useTheme } from "next-themes"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SunIcon, MoonIcon, UsersIcon, MenuIcon, SearchIcon, ChevronDownIcon, UserCircleIcon, LaptopIcon } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import Link from 'next/link'

type Clue = {
  number: number
  text: string
}

type GridCell = {
  letter: string
  number: number | null
  isBlack: boolean
}

type PuzzleData = {
  grid: string[][]
  words: {
    row: number
    col: number
    vertical: boolean
    clue: string
  }[]
}

export default function CrosswordApp() {
  const { theme, setTheme } = useTheme()
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null)
  const [grid, setGrid] = useState<GridCell[][]>([])
  const [acrossClues, setAcrossClues] = useState<Clue[]>([])
  const [downClues, setDownClues] = useState<Clue[]>([])
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [selectedClue, setSelectedClue] = useState<Clue | null>(null)
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across')
  const [mounted, setMounted] = useState(false)

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const userRank = 42 // This should be fetched from your backend in a real application

  useEffect(() => {
    setMounted(true)
    fetchPuzzle()
    startTimer()
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const startTimer = () => {
    startTimeRef.current = Date.now() - elapsedTime * 1000
    timerRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current!) / 1000))
    }, 1000)
  }

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const handleVisibilityChange = () => {
    if (document.hidden) {
      pauseTimer()
    } else {
      startTimer()
    }
  }

  const fetchPuzzle = async () => {
    try {
      // In a real application, you would fetch this data from an API
      // For now, we'll create a mock 15x15 puzzle
      const gridSize = 15;
      const newGrid: GridCell[][] = Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => ({
          letter: '',
          number: null,
          isBlack: false
        }))
      );

      // Add some black cells and numbers for demonstration
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if ((i + j) % 5 === 0) {  // This creates a pattern of black cells
            newGrid[i][j].isBlack = true;
          }
        }
      }

      // Number the cells
      let clueNumber = 1;
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (!newGrid[i][j].isBlack && 
              (i === 0 || j === 0 || newGrid[i-1][j].isBlack || newGrid[i][j-1].isBlack)) {
            newGrid[i][j].number = clueNumber++;
          }
        }
      }

      setGrid(newGrid);

      // Create some mock clues
      const mockAcrossClues: Clue[] = [
        { number: 1, text: "First across clue" },
        { number: 5, text: "Second across clue" },
        // ... add more clues as needed
      ];

      const mockDownClues: Clue[] = [
        { number: 1, text: "First down clue" },
        { number: 2, text: "Second down clue" },
        // ... add more clues as needed
      ];

      setAcrossClues(mockAcrossClues);
      setDownClues(mockDownClues);

    } catch (error) {
      console.error('Failed to fetch puzzle:', error)
    }
  }

  const handleCellChange = (row: number, col: number, value: string) => {
    const newGrid = [...grid]
    newGrid[row][col] = { ...newGrid[row][col], letter: value.toUpperCase() }
    setGrid(newGrid)

    // Move to next cell
    if (value !== '') {
      moveToNextCell(row, col)
    }

    // Check if puzzle is complete
    if (isPuzzleComplete(newGrid)) {
      pauseTimer()
      console.log(`Puzzle completed in ${elapsedTime} seconds`)
      // Here you can implement logic to save the completion time
    }
  }

  const handleCellSelect = (row: number, col: number) => {
    setSelectedCell([row, col])
    const clueNumber = findClueNumber(row, col)
    const direction = determineDirection(row, col)
    const clue = direction === 'across' 
      ? acrossClues.find(c => c.number === clueNumber)
      : downClues.find(c => c.number === clueNumber)
    if (clue) {
      setSelectedClue(clue)
      setSelectedDirection(direction)
    }
  }

  const handleClueClick = (clue: Clue, direction: 'across' | 'down') => {
    setSelectedClue(clue)
    setSelectedDirection(direction)
    const cell = findCellForClue(clue.number)
    if (cell) {
      setSelectedCell(cell)
    }
  }

  const findClueNumber = (row: number, col: number): number => {
    return grid[row][col].number || 0
  }

  const findCellForClue = (clueNumber: number): [number, number] | null => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col].number === clueNumber) {
          return [row, col]
        }
      }
    }
    return null
  }

  const determineDirection = (row: number, col: number): 'across' | 'down' => {
    if (col + 1 < grid[row].length && !grid[row][col + 1].isBlack) {
      return 'across'
    }
    return 'down'
  }

  const moveToNextCell = (row: number, col: number) => {
    if (selectedDirection === 'across') {
      if (col + 1 < grid[row].length && !grid[row][col + 1].isBlack) {
        setSelectedCell([row, col + 1])
      }
    } else {
      if (row + 1 < grid.length && !grid[row + 1][col].isBlack) {
        setSelectedCell([row + 1, col])
      }
    }
  }

  const isPuzzleComplete = (currentGrid: GridCell[][]) => {
    return currentGrid.every(row => row.every(cell => cell.isBlack || cell.letter !== ''))
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold">GW</span>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {theme === 'light' ? <SunIcon className="h-5 w-5" /> : theme === 'dark' ? <MoonIcon className="h-5 w-5" /> : <LaptopIcon className="h-5 w-5" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <SunIcon className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <MoonIcon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <LaptopIcon className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <SearchIcon className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Search puzzles</span>
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <UsersIcon className="mr-2 h-4 w-4" />
              Invite Friends
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <ScrollArea className="h-full w-full rounded-md">
                  <div className="p-6">
                    <div className="py-4">
                      <h2 className="font-semibold">crossworduser</h2>
                      <p className="text-sm text-muted-foreground">user@example.com</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-medium">Rank Status</p>
                      <Link href="/ranking">
                        <Button variant="outline" className="mt-2 w-full justify-center">
                          {userRank}
                        </Button>
                      </Link>
                    </div>
                    <nav className="space-y-2">
                      <Link href="/dashboard" className="flex items-center py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">
                        Dashboard
                      </Link>
                      <Link href="/account" className="flex items-center py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">
                        Account Settings
                      </Link>
                      <Link href="/create-team" className="flex items-center py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">
                        Create Team
                      </Link>
                      <Button variant="ghost" className="w-full justify-start px-3 py-2 hover:bg-accent hover:text-accent-foreground">Log Out</Button>
                    </nav>
                    <div className="my-4 h-[1px] bg-border" />
                    <nav className="space-y-2">
                      <Collapsible>
                        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">
                          <span>Puzzles</span>
                          <ChevronDownIcon className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-4 space-y-2">
                          <Link href="/puzzles/solved" className="block py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">Solved</Link>
                          <Link href="/puzzles/working" className="block py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">Working</Link>
                          <Link href="/puzzles/liked" className="block py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">Liked</Link>
                        </CollapsibleContent>
                      </Collapsible>
                      <Collapsible>
                        <CollapsibleTrigger className="flex w-full items-center justify-between py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">
                          <span>Ranking</span>
                          <ChevronDownIcon className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-4 space-y-2">
                          <Link href="/dashboard" className="block py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">My Rank</Link>
                          <Link href="/ranking/how-it-works" className="block py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">How Ranking Works</Link>
                        </CollapsibleContent>
                      </Collapsible>
                      <Link href="/about" className="flex items-center py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground">
                        About
                      </Link>
                    </nav>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        {isSearchOpen && (
          <div className="container py-4">
            <Input placeholder="Search puzzles..." />
          </div>
        )}
      </header>
      <main className="flex-grow p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/2 xl:w-2/5">
            <Card>
              <CardContent className="p-6">
                {selectedClue && (
                  <div className="mb-4 p-2 bg-primary text-primary-foreground rounded text-sm">
                    {selectedClue.number}{selectedDirection === 'across' ? 'A' : 'D'}: {selectedClue.text}
                  </div>
                )}
                <div className="grid gap-[1px] bg-gray-300 dark:bg-gray-700 aspect-square max-w-[500px] mx-auto p-[1px]" style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}>
                  {grid.map((row, rowIndex) => 
                    row.map((cell, colIndex) => (
                      <div 
                        key={`${rowIndex}-${colIndex}`} 
                        className={`relative flex items-center justify-center aspect-square border border-gray-300 dark:border-gray-700 ${
                          cell.isBlack ? 'bg-gray-800 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'
                        } ${
                          selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex
                            ? 'bg-gray-100 dark:bg-gray-700'
                            : ''
                        }`}
                        onClick={() => handleCellSelect(rowIndex, colIndex)}
                      >
                        {cell.number !== null && (
                          <span className="absolute top-0 left-0 text-[0.4rem] sm:text-[0.5rem] p-0.5 text-gray-500 dark:text-gray-400">
                            {cell.number}
                          </span>
                        )}
                        {!cell.isBlack && (
                          <Input 
                            className="w-full h-full text-center p-0 border-none focus:ring-0 focus:outline-none uppercase text-[0.6rem] sm:text-xs bg-transparent"
                            maxLength={1}
                            value={cell.letter}
                            onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full lg:w-1/2 xl:w-3/5 flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <h2 className="text-lg font-semibold mb-2">Across</h2>
              <ScrollArea className="h-[calc(100vh-16rem)] lg:h-[calc(100vh-12rem)]">
                {acrossClues.map((clue) => (
                  <div
                    key={clue.number}
                    className={`p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded text-sm ${
                      selectedClue === clue && selectedDirection === 'across' ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => handleClueClick(clue, 'across')}
                  >
                    {clue.number}. {clue.text}
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div className="w-full sm:w-1/2">
              <h2 className="text-lg font-semibold mb-2">Down</h2>
              <ScrollArea className="h-[calc(100vh-16rem)] lg:h-[calc(100vh-12rem)]">
                {downClues.map((clue) => (
                  <div
                    key={clue.number}
                    className={`p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded text-sm ${
                      selectedClue === clue && selectedDirection === 'down' ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => handleClueClick(clue, 'down')}
                  >
                    {clue.number}. {clue.text}
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}