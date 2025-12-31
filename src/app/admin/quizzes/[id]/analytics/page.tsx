"use client"

import { QuizAnalytics } from "@/src/features/admin/quiz/QuizAnalytics"
import { useParams } from "next/navigation"

export default function QuizAnalyticsPage() {
  const params = useParams()
  const quizId = params.id as string

  return (
    <div className="p-10 space-y-6">
      <div>
        <h1 className="text-3xl text-gray-700 font-bold">Quiz Analytics</h1>
        <p className="text-muted-foreground text-gray-500 mt-2">Comprehensive performance insights and difficulty tracking</p>
      </div>

      <QuizAnalytics quizId={quizId} />
    </div>
  )
}
