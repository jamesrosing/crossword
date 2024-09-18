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

    return NextResponse.json(puzzle)
  } catch (error) {
    console.error('Error fetching puzzle:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}