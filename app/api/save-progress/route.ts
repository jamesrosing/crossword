import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const { puzzleId, grid } = await request.json()

  try {
    await prisma.userProgress.upsert({
      where: {
        userId_puzzleId: {
          userId: 1, // Replace with actual user ID from authentication
          puzzleId: puzzleId,
        },
      },
      update: {
        progress: grid,
      },
      create: {
        userId: 1, // Replace with actual user ID from authentication
        puzzleId: puzzleId,
        progress: grid,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}