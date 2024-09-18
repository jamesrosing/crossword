import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const difficulty = searchParams.get('difficulty')
  const title = searchParams.get('title')

  try {
    const puzzle = await prisma.puzzle.findFirst({
      where: {
        difficulty: difficulty as string,
        title: title as string,
      },
    })

    if (!puzzle) {
      return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 })
    }

    // Parse JSON strings back to objects
    const parsedPuzzle = {
      ...puzzle,
      grid: JSON.parse(puzzle.grid),
      words: JSON.parse(puzzle.words),
      cellNumbers: JSON.parse(puzzle.cellNumbers),
      cluesAcross: JSON.parse(puzzle.cluesAcross),
      cluesDown: JSON.parse(puzzle.cluesDown),
    }

    return NextResponse.json(parsedPuzzle)
  } catch (error) {
    console.error('Error fetching puzzle:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}