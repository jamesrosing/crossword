// components/dashboard/recent-solves.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RecentSolve {
  id: number
  title: string
  time: string
  date: string
}

export function RecentSolves() {
  // TODO: Replace with actual data fetching logic
  const recentSolves: RecentSolve[] = [
    { id: 1, title: "Easy Puzzle", time: "2:30", date: "2023-05-01" },
    { id: 2, title: "Medium Puzzle", time: "5:15", date: "2023-05-02" },
    { id: 3, title: "Hard Puzzle", time: "10:45", date: "2023-05-03" },
  ]

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Solves</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentSolves.map((solve) => (
            <div key={solve.id} className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{solve.title}</p>
                <p className="text-sm text-muted-foreground">
                  Solved in {solve.time} on {solve.date}
                </p>
              </div>
              <div className="ml-auto font-medium">{solve.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}