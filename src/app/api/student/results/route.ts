import { connectDB } from "@/src/lib/mongodb/connection"
import { QuizResult } from "@/src/lib/mongodb/models/QuizResult"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const results = await QuizResult.find({}).populate("quiz", "title passingScore").sort({ completedAt: -1 })

    return NextResponse.json(results, { status: 200 })
  } catch (error) {
    console.error("Error fetching results:", error)
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}
