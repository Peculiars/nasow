"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Trophy } from "lucide-react"
import { StudentLeaderboard } from "@/src/features/quiz/StudentLeaderboard"

interface Quiz {
  _id: string
  title: string
  description: string
  totalQuestions: number
}

export default function StudentLeaderboardsPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("/api/quizzes?isActive=true")
        const data = await response.json()
        setQuizzes(data)
      } catch (error) {
        console.error("Error fetching quizzes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading leaderboards...</div>
  }

  return (
    <div className="p-10 bg-white w-full text-gray-700 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Trophy className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold">Quiz Leaderboards</h1>
        </div>
        <p className="text-muted-foreground mt-2">See how you rank against your classmates</p>
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No quizzes available at the moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {quizzes.map((quiz) => (
            <Card key={quiz._id} className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <StudentLeaderboard quizId={quiz._id} limit={20} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
