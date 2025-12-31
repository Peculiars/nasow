"use client"

import { Leaderboard } from "@/src/features/admin/quiz/Leaderboard"
import { useParams } from "next/navigation"

export default function QuizLeaderboardPage() {
  const params = useParams()
  const quizId = params.id as string

  return (
    <div className="p-10 space-y-6">
      <div>
        <h1 className="text-3xl text-gray-700 font-bold">Quiz Leaderboard</h1>
        <p className="text-muted-foreground text-gray-500 mt-2">Real-time student performance tracking</p>
      </div>

      <Leaderboard quizId={quizId} />
    </div>
  )
}
