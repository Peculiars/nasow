"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"

interface AnalyticsData {
  totalAttempts: number
  averageScore: number
  passRate: number
  highestScore: number
  lowestScore: number
  averageTime: number
  difficultyDistribution: { difficulty: string; count: number }[]
  scoreDistribution: { range: string; count: number }[]
  scoresByLevel: { level: string; averageScore: number; attempts: number }[]
}

interface QuizAnalyticsProps {
  quizId: string
}

export function QuizAnalytics({ quizId }: QuizAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/quiz-results/analytics?quizId=${quizId}`)
        if (!response.ok) throw new Error("Failed to fetch analytics")

        const data = await response.json()
        setAnalytics(data)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()

    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [quizId])

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No data available yet</p>
        </CardContent>
      </Card>
    )
  }

  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  const scoreRangeData = [
    { range: "0-20%", color: "#ef4444", count: analytics.scoreDistribution[0]?.count || 0 },
    { range: "21-50%", color: "#f59e0b", count: analytics.scoreDistribution[1]?.count || 0 },
    { range: "51-80%", color: "#eab308", count: analytics.scoreDistribution[2]?.count || 0 },
    { range: "81-100%", color: "#10b981", count: analytics.scoreDistribution[3]?.count || 0 },
  ]

  return (
    <div className="text-gray-700 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalAttempts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{analytics.averageScore.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{analytics.passRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Number of students in each score range</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreRangeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {scoreRangeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance by Level</CardTitle>
            <CardDescription>Average scores across student levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.scoresByLevel}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="averageScore" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Question Difficulty Analysis</CardTitle>
            <CardDescription>Distribution of difficult questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.difficultyDistribution.map((difficulty) => (
                <div key={difficulty.difficulty} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {difficulty.difficulty}
                    </Badge>
                  </div>
                  <span className="font-semibold">{difficulty.count} questions</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Analysis</CardTitle>
            <CardDescription>Average time spent on quiz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Average Time Taken</p>
                <p className="text-2xl font-bold">{Math.round(analytics.averageTime / 60)} mins</p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Score Range</p>
                <div className="flex items-center gap-4 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Highest</p>
                    <p className="text-xl font-bold text-green-600">{analytics.highestScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lowest</p>
                    <p className="text-xl font-bold text-red-600">{analytics.lowestScore}%</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
