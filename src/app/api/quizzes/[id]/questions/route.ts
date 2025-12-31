import { connectDB } from "@/src/lib/mongodb/connection"
import { Question } from "@/src/lib/mongodb/models/Question"
import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    const questions = await Question.find({ quizId: id }).sort({ order: 1 })

    return NextResponse.json(questions, { status: 200 })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 })
    }

    const { questions } = await request.json()

    const questionsToInsert = questions.map((q: any, index: number) => ({
      quizId: id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      difficulty: q.difficulty,
      explanation: q.explanation,
      order: index + 1,
    }))

    const savedQuestions = await Question.insertMany(questionsToInsert)

    return NextResponse.json(savedQuestions, { status: 201 })
  } catch (error) {
    console.error("Error creating questions:", error)
    return NextResponse.json({ error: "Failed to create questions" }, { status: 500 })
  }
}
