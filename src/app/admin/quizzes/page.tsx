"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { QuizList } from "@/src/features/admin/quiz/QuizList"
import { QuizForm } from "@/src/features/admin/quiz/QuizForm"

export default function AdminQuizzesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreateQuiz = async (data: any) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to create quiz")

      const newQuiz = await response.json()

      toast.success("Quiz created successfully")

      setRefreshKey((prev) => prev + 1)

      setTimeout(() => {
        router.push(`/admin/quizzes/${newQuiz._id}`)
      }, 1000)
    } catch (error) {
      toast.error("Failed to create quiz")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-10 space-y-6">
      <div>
        <h1 className="text-3xl text-gray-800 font-bold">Quiz Management</h1>
        <p className="text-muted-foreground text-gray-500 mt-2">Create and manage quizzes for your students</p>
      </div>

      <Tabs defaultValue="list" className="w-full text-gray-700">
        <TabsList>
          <TabsTrigger value="list">All Quizzes</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <QuizList key={refreshKey} />
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <div className="max-w-4xl mx-auto">
            <QuizForm onSubmit={handleCreateQuiz} isLoading={isLoading} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
