"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"
import { Label } from "@/src/components/ui/label"

interface Question {
  _id: string
  questionText: string
  options: string[]
  difficulty: "easy" | "medium" | "hard"
  order: number
}

interface QuestionDisplayProps {
  question: Question
  selectedAnswer: number | null
  onAnswerSelect: (optionIndex: number) => void
  currentQuestion: number
  totalQuestions: number
}

export function QuestionDisplay({
  question,
  selectedAnswer,
  onAnswerSelect,
  currentQuestion,
  totalQuestions,
}: QuestionDisplayProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardDescription>
              Question {currentQuestion} of {totalQuestions}
            </CardDescription>
            <CardTitle className="mt-2">{question.questionText}</CardTitle>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${getDifficultyColor(question.difficulty)}`}
          >
            {question.difficulty}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAnswer?.toString() || ""}
          onValueChange={(value) => onAnswerSelect(Number.parseInt(value))}
        >
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 cursor-pointer transition-colors"
                onClick={() => onAnswerSelect(index)}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
