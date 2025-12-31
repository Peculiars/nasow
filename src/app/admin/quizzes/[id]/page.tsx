"use client"

import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { QuestionBuilder } from "@/src/features/admin/quiz/QuestionBuilder"

export default function QuizDetailPage() {
  const params = useParams()
  const quizId = params.id as string

  return (
    <div className="p-10 space-y-6">
      <div>
        <h1 className="text-3xl text-gray-800 font-bold">Quiz Details</h1>
        <p className="text-muted-foreground text-gray-500 mt-2">Build your quiz questions</p>
      </div>

      <Tabs defaultValue="questions" className="w-full text-gray-700">
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-6">
          <QuestionBuilder quizId={quizId} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Quiz settings coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
