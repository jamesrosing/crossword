import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { Overview } from "@/components/dashboard/overview"
import { RecentSolves } from "@/components/dashboard/recent-solves"
import { calculateRank } from "@/lib/ranking"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    // Handle unauthenticated state, maybe redirect to login page
    return <div>Please log in to view your dashboard.</div>
  }

  // Fetch user data and stats here
  // This is a placeholder, replace with actual data fetching
  const userData = {
    solvedPuzzles: 10,
    averageTime: "5:30",
    totalScore: 5000,
    favoriteCategory: "Medium"
  }

  const rank = calculateRank(userData.totalScore)

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Overview
          solvedPuzzles={userData.solvedPuzzles}
          averageTime={userData.averageTime}
          ranking={rank}
          favoriteCategory={userData.favoriteCategory}
        />
        <RecentSolves />
      </div>
    </>
  )
}