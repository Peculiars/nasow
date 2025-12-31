"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { ClockIcon, BookOpenIcon } from "lucide-react"

interface Quiz {
  _id: string
  title: string
  description: string
  duration: number
  totalQuestions: number
  passingScore: number
  target: {
    isGeneral: boolean
    levels: string[]
    types: string[]
  }
}

interface StudentData {
  level: string
  studentType: string
}

export default function StudentQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [studentData, setStudentData] = useState<StudentData | null>(null)

  const isQuizAccessible = (quiz: Quiz, student: StudentData | null): boolean => {
    if (!student) return false

    if (quiz.target.isGeneral) return true

    const levelMatch = quiz.target.levels.includes(student.level)
    const typeMatch = quiz.target.types.includes(student.studentType)

    return levelMatch && typeMatch
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("[v0] Fetching student data and quizzes")

        const studentResponse = await fetch("/api/student/sync")
        if (!studentResponse.ok) {
          console.error("[v0] Failed to sync student")
          setLoading(false)
          return
        }

        const student = await studentResponse.json()
        console.log("[v0] Student data retrieved:", student)
        setStudentData(student)

        const quizzesResponse = await fetch("/api/quizzes?isActive=true")
        const allQuizzes = await quizzesResponse.json()

        const accessibleQuizzes = allQuizzes.filter((quiz: Quiz) => isQuizAccessible(quiz, student))

        console.log("[v0] Total quizzes:", allQuizzes.length, "Accessible:", accessibleQuizzes.length)
        setQuizzes(accessibleQuizzes)
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading quizzes...</div>
  }

  return (
    <div className="w-full md:p-10 bg-white text-gray-700 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Available Quizzes</h1>
        <p className="text-muted-foreground mt-2">Test your knowledge with our quizzes</p>
        {studentData && (
          <p className="text-sm text-muted-foreground mt-1">
            Showing quizzes for {studentData.level} {studentData.studentType} students
          </p>
        )}
      </div>

      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No quizzes available for your level and type</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-2">{quiz.title}</CardTitle>
                <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{quiz.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpenIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{quiz.totalQuestions} questions</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Passing Score: {quiz.passingScore}%</p>
                  {quiz.target.isGeneral && <Badge variant="outline">For All Students</Badge>}
                </div>

                <Link href={`/student/quizzes/${quiz._id}`}>
                  <Button className="w-full my-5 bg-green-600 text-white hover:bg-green-700">Start Quiz</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
