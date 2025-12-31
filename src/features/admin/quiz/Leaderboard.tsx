"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown"
import { MoreVerticalIcon, RefreshCwIcon } from "lucide-react"

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

interface LeaderboardProps {
  quizId: string
}

export function Leaderboard({ quizId }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  console.log("Leaderboard quizId:", leaderboard)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/quiz-results/leaderboard?quizId=${quizId}&limit=50`)
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
  }, [quizId])

  const handleSuspendStudent = async (studentId: string) => {
    if (!confirm("Suspend this student?")) return

    try {
      await fetch(`/api/students/${studentId}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: "Suspicious activity during quiz",
          suspendedBy: "admin",
        }),
      })

      alert("Student suspended successfully")
      window.location.reload()
    } catch (error) {
      console.error("Error suspending student:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return <div className="text-center py-8">Loading leaderboard...</div>
  }

  return (
    <div className="space-y-4 text-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Refreshes every 5 seconds</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCwIcon className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr className="text-muted-foreground">
              <th className="text-left py-3 px-4">Rank</th>
              <th className="text-left py-3 px-4">Student</th>
              <th className="text-left py-3 px-4">Level</th>
              <th className="text-left py-3 px-4">Type</th>
              <th className="text-right py-3 px-4">Score</th>
              <th className="text-right py-3 px-4">Time Taken</th>
              <th className="text-left py-3 px-4">Completed</th>
              <th className="text-center py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry._id} className="border-b hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4">
                  <Badge variant="outline" className="font-bold">
                    #{entry.rank}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={entry.student.profileImage || "/placeholder.svg"} />
                      <AvatarFallback>{getInitials(entry.student.firstName, entry.student.lastName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {entry.student.firstName} {entry.student.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{entry.student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Badge variant="secondary">{entry.student.level}</Badge>
                </td>
                <td className="py-4 px-4">
                  <Badge variant="outline">{entry.student.studentType}</Badge>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className={`font-bold text-lg ${getScoreColor(entry.score)}`}>{entry.score}%</span>
                </td>
                <td className="py-4 px-4 text-right text-muted-foreground">{formatTime(entry.timeTaken)}</td>
                <td className="py-4 px-4 text-xs text-muted-foreground">
                  {new Date(entry.completedAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-4 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVerticalIcon className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white text-gray-700 p-4">
                      <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        onClick={() => handleSuspendStudent(entry.student._id)}
                      >
                        Suspend Student
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leaderboard.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No quiz attempts yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
