"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Card, CardContent } from "@/src/components/ui/card"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { TrashIcon, PlusIcon } from "lucide-react"

interface Question {
  id?: string
  questionText: string
  options: string[]
  correctAnswer: number
  difficulty: "easy" | "medium" | "hard"
  explanation?: string
}

interface QuestionBuilderProps {
  quizId: string
  onSave?: () => void
}

export function QuestionBuilder({ quizId, onSave }: QuestionBuilderProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    difficulty: "medium",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleAddQuestion = () => {
    if (!currentQuestion.questionText || currentQuestion.options.some((opt) => !opt)) {
      alert("Please fill in all fields")
      return
    }

    setQuestions((prev) => [...prev, { ...currentQuestion, id: Date.now().toString() }])
    setCurrentQuestion({
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      difficulty: "medium",
    })
  }

  const handleSaveQuestions = async () => {
    if (questions.length === 0) {
      alert("Add at least one question")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/quizzes/${quizId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      })

      if (!response.ok) throw new Error("Failed to save questions")

      alert("Questions saved successfully")
      setQuestions([])
      onSave?.()
    } catch (error) {
      console.error("Error saving questions:", error)
      alert("Failed to save questions")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveQuestion = (id: string | undefined) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const updateCurrentQuestion = (field: keyof Question, value: any, optionIndex?: number) => {
    if (field === "options" && optionIndex !== undefined) {
      const updatedOptions = [...currentQuestion.options]
      updatedOptions[optionIndex] = value
      setCurrentQuestion((prev) => ({ ...prev, options: updatedOptions }))
    } else {
      setCurrentQuestion((prev) => ({ ...prev, [field]: value }))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Question Text</Label>
            <Textarea
              placeholder="Enter your question"
              value={currentQuestion.questionText}
              onChange={(e) => updateCurrentQuestion("questionText", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Answer Options</Label>
            {currentQuestion.options.map((option, index) => (
              <Input
                key={index}
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateCurrentQuestion("options", e.target.value, index)}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <Select
                value={currentQuestion.correctAnswer.toString()}
                onValueChange={(value) => updateCurrentQuestion("correctAnswer", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-800">
                  {currentQuestion.options.map((_, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      Option {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={currentQuestion.difficulty}
                onValueChange={(value) => updateCurrentQuestion("difficulty", value as "easy" | "medium" | "hard")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-800">
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Explanation (Optional)</Label>
            <Textarea
              placeholder="Explain why the answer is correct"
              value={currentQuestion.explanation || ""}
              onChange={(e) => updateCurrentQuestion("explanation", e.target.value)}
              rows={2}
            />
          </div>

          <Button onClick={handleAddQuestion} className="w-full">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Questions Added ({questions.length})</h3>
          {questions.map((q, index) => (
            <Card key={q.id}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium">
                      {index + 1}. {q.questionText}
                    </h4>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveQuestion(q.id)}>
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Correct: {q.options[q.correctAnswer]}</p>
                    <p>Difficulty: {q.difficulty}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button onClick={handleSaveQuestions} disabled={isLoading} size="lg" className="w-full">
            {isLoading ? "Saving..." : "Save All Questions"}
          </Button>
        </div>
      )}
    </div>
  )
}
