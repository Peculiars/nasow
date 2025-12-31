import { connectDB } from "@/src/lib/mongodb/connection"
import { Quiz } from "@/src/lib/mongodb/models/Quiz"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get("isActive")

    const filter: any = {}
    if (isActive !== null) {
      filter.isActive = isActive === "true"
    }

    const quizzes = await Quiz.find(filter).sort({ createdAt: -1 })

    return NextResponse.json(quizzes, { status: 200 })
  } catch (error) {
    console.error("Error fetching quizzes:", error)
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const data = await request.json()

    const quiz = new Quiz({
      ...data,
      createdBy: "admin-id",
    })

    await quiz.save()

    return NextResponse.json(quiz, { status: 201 })
  } catch (error) {
    console.error("Error creating quiz:", error)
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
  }
}
