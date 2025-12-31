"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { CheckCircleIcon, XCircleIcon } from "lucide-react"

interface QuizResultProps {
  score: number
  totalQuestions: number
  timeTaken: number
  passed: boolean
  passingScore: number
  quizId: string
}

export function QuizResult({ score, totalQuestions, timeTaken, passed, passingScore, quizId }: QuizResultProps) {
  const percentage = Math.round((score / totalQuestions) * 100)
  const minutes = Math.floor(timeTaken / 60)
  const seconds = timeTaken % 60

  return (
    <div className="max-w-7xl text-gray-700 mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {passed ? (
              <CheckCircleIcon className="w-16 h-16 text-green-600" />
            ) : (
              <XCircleIcon className="w-16 h-16 text-red-600" />
            )}
          </div>
          <CardTitle className={passed ? "text-green-600" : "text-red-600"}>
            {passed ? "Congratulations!" : "Try Again"}
          </CardTitle>
          <CardDescription>
            {passed ? "You passed the quiz successfully!" : "You did not meet the passing score"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-5xl font-bold text-blue-600">{percentage}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                {score} out of {totalQuestions} correct
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground">Passing Score</p>
                <p className="text-lg font-semibold">{passingScore}%</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground">Time Taken</p>
                <p className="text-lg font-semibold">
                  {minutes}m {seconds}s
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Link href="/student/quizzes">
              <Button className="w-full">Back to Quizzes</Button>
            </Link>
            {!passed && (
              <Link href={`/student/quizzes/${quizId}`}>
                <Button variant="outline" className="w-full bg-transparent">
                  Retake Quiz
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
