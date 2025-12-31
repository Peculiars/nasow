import { connectDB } from "@/src/lib/mongodb/connection"
import { QuizResult } from "@/src/lib/mongodb/models/QuizResult"
import { Student } from "@/src/lib/mongodb/models/Student"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const data = await request.json()

    const quizResult = new QuizResult({
      ...data,
      completedAt: new Date(),
    })

    await quizResult.save()

    await Student.findByIdAndUpdate(data.studentId, {
      $inc: {
        totalScore: data.score,
        quizzesTaken: 1,
      },
      $set: {
        lastActive: new Date(),
      },
    })

    return NextResponse.json(quizResult, { status: 201 })
  } catch (error) {
    console.error("Error saving quiz result:", error)
    return NextResponse.json({ error: "Failed to save quiz result" }, { status: 500 })
  }
}