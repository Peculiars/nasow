"use client"
import { Card, CardContent } from "@/src/components/ui/card"

interface Question {
  _id: string
  order: number
}

interface QuizNavigatorProps {
  questions: Question[]
  currentIndex: number
  answeredIndices: Set<number>
  onNavigate: (index: number) => void
}

export function QuizNavigator({ questions, currentIndex, answeredIndices, onNavigate }: QuizNavigatorProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <p className="font-semibold text-sm">Question Navigator</p>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => onNavigate(index)}
                className={`aspect-square rounded-lg font-semibold text-xs transition-colors ${
                  index === currentIndex
                    ? "bg-blue-600 text-white"
                    : answeredIndices.has(index)
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-800"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-100 border border-gray-400"></div>
            <span>Skipped</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
