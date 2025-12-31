"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Edit2Icon, MoreVerticalIcon, TrashIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown"

interface Quiz {
  _id: string
  title: string
  description: string
  totalQuestions: number
  duration: number
  isActive: boolean
  createdAt: string
  target: {
    isGeneral: boolean
    levels: string[]
    types: string[]
  }
}

interface QuizListProps {
  onDelete?: (id: string) => void
}

export function QuizList({ onDelete }: QuizListProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes")
      const data = await response.json()
      setQuizzes(data)
    } catch (error) {
      console.error("Error fetching quizzes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return

    try {
      await fetch(`/api/quizzes/${id}`, { method: "DELETE" })
      setQuizzes((prev) => prev.filter((q) => q._id !== id))
      onDelete?.(id)
    } catch (error) {
      console.error("Error deleting quiz:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading quizzes...</div>
  }

  if (quizzes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No quizzes created yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {quizzes.map((quiz) => (
        <Card key={quiz._id} className="hover:shadow-sm transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{quiz.title}</h3>
                  <Badge variant={quiz.isActive ? "default" : "secondary"}>
                    {quiz.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {quiz.description && <p className="text-sm text-muted-foreground">{quiz.description}</p>}
                <div className="flex flex-wrap gap-2 pt-2">
                  {quiz.target.isGeneral && <Badge variant="outline">General</Badge>}
                  {quiz.target.levels.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Levels: {quiz.target.levels.join(", ")}
                    </Badge>
                  )}
                  {quiz.target.types.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Types: {quiz.target.types.join(", ")}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {quiz.duration} min • {quiz.totalQuestions} questions
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/quizzes/${quiz._id}`}>
                  <Button variant="outline" size="sm">
                    <Edit2Icon className="w-4 h-4" />
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVerticalIcon className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="text-gray-700 p-4 bg-white">
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={`/admin/quizzes/${quiz._id}/leaderboard`}>View Leaderboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={`/admin/quizzes/${quiz._id}/analytics`}>View Analytics</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => handleDelete(quiz._id)}>
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
