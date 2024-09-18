import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { puzzleId, grid, completed, difficulty } = await request.json()

  try {
    // Use mock user ID for all operations
    const mockUserId = "mock-user-id"

    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_puzzleId: {
          userId: mockUserId,
          puzzleId: puzzleId,
        },
      },
      update: {
        progress: JSON.stringify(grid),
        completed,
        completionTime: completed ? Math.floor(Date.now() / 1000) : null,
      },
      create: {
        userId: mockUserId,
        puzzleId: puzzleId,
        progress: JSON.stringify(grid),
        completed,
        completionTime: completed ? Math.floor(Date.now() / 1000) : null,
      },
    })

    if (completed) {
      await prisma.user.update({
        where: { id: mockUserId },
        data: {
          rankingPoints: { increment: calculatePoints(difficulty) },
        },
      })
    }

    return NextResponse.json({ success: true, userProgress })
  } catch (error) {
    console.error('Failed to save progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calculatePoints(difficulty: string): number {
  const pointsMap: { [key: string]: number } = {
    easy: 1,
    medium: 2,
    hard: 3,
    expert: 5,
  }
  return pointsMap[difficulty] || 1
}