"use client"

import { Progress } from "@/src/components/ui/progress"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"

interface QuizProgressProps {
  currentQuestion: number
  totalQuestions: number
  answeredCount: number
}

export function QuizProgress({ currentQuestion, totalQuestions, answeredCount }: QuizProgressProps) {
  const progress = (currentQuestion / totalQuestions) * 100
  const progressBarFill = (answeredCount / totalQuestions) * 100

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span className="text-muted-foreground">
              {currentQuestion} / {totalQuestions}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Answered</span>
            <Badge variant="secondary">
              {answeredCount} / {totalQuestions}
            </Badge>
          </div>
          <Progress value={progressBarFill} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
