"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, } from "@/src/components/ui/dialog"
import toast from "react-hot-toast"
import { QuestionDisplay } from "@/src/features/quiz/QuestionDisplay"
import { QuizTimer } from "@/src/features/quiz/QuizTimer"
import { QuizNavigator } from "@/src/features/quiz/QuizNavigator"
import { QuizProgress } from "@/src/features/quiz/QuizProgress"
import { QuizResult } from "@/src/features/quiz/QuizResult"

interface Question {
  _id: string
  questionText: string
  options: string[]
  correctAnswer: number
  difficulty: "easy" | "medium" | "hard"
  order: number
}

interface Quiz {
  _id: string
  title: string
  description: string
  duration: number
  totalQuestions: number
  passingScore: number
}

export default function StudentQuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [studentId, setStudentId] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [showResult, setShowResult] = useState(false)
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null)
  const [showExitDialog, setShowExitDialog] = useState(false)

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const studentResponse = await fetch("/api/student/sync")
        if (!studentResponse.ok) throw new Error("Failed to fetch student ID")
        const { studentId: fetchedStudentId } = await studentResponse.json()
        setStudentId(fetchedStudentId)

        const quizResponse = await fetch(`/api/quizzes/${quizId}`)
        const quizData = await quizResponse.json()
        setQuiz(quizData)

        const questionsResponse = await fetch(`/api/quizzes/${quizId}/questions`)
        const questionsData = await questionsResponse.json()
        setQuestions(questionsData.sort((a: Question, b: Question) => a.order - b.order))

        setAnswers(new Array(questionsData.length).fill(null))
        setQuizStartTime(new Date())
      } catch (error) {
        console.error("Error fetching quiz:", error)
        toast.error("Failed to load quiz")
      } finally {
        setLoading(false)
      }
    }

    initializeQuiz()
  }, [quizId, toast])

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = optionIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSubmit = async () => {
    if (!quiz || !quizStartTime || !studentId) return

    const correctCount = answers.reduce((count: number, answer, index) => {
      return answer === questions[index]?.correctAnswer ? count + 1 : count
    }, 0)

    const score = Math.round((correctCount / questions.length) * 100)
    const timeTaken = Math.round((new Date().getTime() - quizStartTime.getTime()) / 1000)

    try {
      const response = await fetch("/api/quiz-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId,
          studentId, // Use actual student ID from database
          score,
          totalPoints: questions.length,
          answers: answers.map((answer, index) => ({
            questionId: questions[index]._id,
            selectedAnswer: answer || -1,
            isCorrect: answer === questions[index]?.correctAnswer,
          })),
          timeTaken,
          startedAt: quizStartTime,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit quiz")

      setShowResult(true)
    } catch (error) {
      console.error("Error submitting quiz:", error)
      toast.error("Failed to submit quiz")
    }
  }

  const handleTimeUp = () => {
    toast.error("Time's Up! Your quiz has been submitted")
    handleSubmit()
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading quiz...</div>
  }

  if (!quiz || questions.length === 0) {
    return <div className="flex items-center justify-center min-h-screen">Quiz not found</div>
  }

  const calculateCorrectCount = () => {
    return answers.reduce((count: number, answer, index) => {
      return answer === questions[index]?.correctAnswer ? count + 1 : count
    }, 0 as number)
  }

  if (showResult) {
    const correctCount = calculateCorrectCount()
    const score = Math.round((correctCount / questions.length) * 100)
    const timeTaken = quizStartTime ? Math.round((new Date().getTime() - quizStartTime.getTime()) / 1000) : 0

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 flex items-center justify-center">
        <QuizResult
          score={correctCount}
          totalQuestions={questions.length}
          timeTaken={timeTaken}
          passed={score >= quiz.passingScore}
          passingScore={quiz.passingScore}
          quizId={quizId}
        />
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const answeredCount = answers.filter((a) => a !== null).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-700 p-4">
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="bg-white text-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to exit? Your progress will be lost.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Continue Quiz</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/student/quizzes")}>Exit</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">{quiz.title}</h1>
              <p className="text-muted-foreground mt-1">{quiz.description}</p>
            </div>
            <Button variant="outline" onClick={() => setShowExitDialog(true)}>
              Exit Quiz
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <QuizTimer durationMinutes={quiz.duration} onTimeUp={handleTimeUp} />
            <QuestionDisplay
              question={currentQuestion}
              selectedAnswer={answers[currentIndex] || null}
              onAnswerSelect={handleAnswerSelect}
              currentQuestion={currentIndex + 1}
              totalQuestions={questions.length}
            />

            <div className="flex gap-3">
              <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
                Previous
              </Button>
              <div className="flex-1" />
              <Button variant="outline" onClick={handleNext} disabled={currentIndex === questions.length - 1}>
                Next
              </Button>
              {currentIndex === questions.length - 1 && (
                <Button onClick={handleSubmit} className="bg-green-600 text-white hover:bg-green-700">
                  Submit Quiz
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <QuizProgress
              currentQuestion={currentIndex + 1}
              totalQuestions={questions.length}
              answeredCount={answeredCount}
            />
            <QuizNavigator
              questions={questions}
              currentIndex={currentIndex}
              answeredIndices={new Set(answers.map((a, i) => (a !== null ? i : -1)).filter((i) => i !== -1))}
              onNavigate={setCurrentIndex}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
