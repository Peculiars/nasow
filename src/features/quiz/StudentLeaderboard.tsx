"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { RefreshCwIcon, TrendingUpIcon } from "lucide-react"

interface LeaderboardEntry {
  _id: string
  rank: number
  score: number
  totalPoints: number
  timeTaken: number
  completedAt: string
  student: {
    _id: string
    firstName: string
    lastName: string
    email: string
    level: string
    studentType: string
    profileImage?: string
  }
}

interface StudentLeaderboardProps {
  quizId: string
  limit?: number
}

export function StudentLeaderboard({ quizId, limit = 10 }: StudentLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/quiz-results/leaderboard?quizId=${quizId}&limit=${limit}`)
        const data = await response.json()
        setLeaderboard(data)
        setLastUpdated(new Date())
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()

    const interval = setInterval(fetchLeaderboard, 5000)
    return () => clearInterval(interval)
  }, [quizId, limit])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getMedalColor = (rank: number) => {
    if (rank === 1) return "text-yellow-500"
    if (rank === 2) return "text-gray-400"
    if (rank === 3) return "text-orange-600"
    return "text-gray-300"
  }

  if (loading) {
    return <div className="text-center py-8">Loading leaderboard...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUpIcon className="w-5 h-5 text-[#9179E0]" />
            <CardTitle>Quiz Leaderboard</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
            <RefreshCwIcon className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription>Top performers - Last updated {lastUpdated.toLocaleTimeString()}</CardDescription>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No scores yet. Be the first to take this quiz!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div
                key={entry._id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`text-2xl font-bold min-w-[40px] ${getMedalColor(entry.rank)}`}>
                    {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
                  </div>

                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.student.profileImage || "/placeholder.svg"} />
                    <AvatarFallback>{getInitials(entry.student.firstName, entry.student.lastName)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {entry.student.firstName} {entry.student.lastName}
                    </p>
                    <p className="text-xs text-gray-600">{entry.student.level}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="hidden sm:block">
                    <p className="text-xs text-gray-600">Time</p>
                    <p className="font-medium text-gray-900">{formatTime(entry.timeTaken)}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full font-bold text-sm ${getScoreColor(entry.score)}`}>
                    {entry.score}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
