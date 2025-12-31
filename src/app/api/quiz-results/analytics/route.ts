import { connectDB } from "@/src/lib/mongodb/connection"
import { QuizResult } from "@/src/lib/mongodb/models/QuizResult"
import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get("quizId")

    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "Invalid or missing quizId" }, { status: 400 })
    }

    const results = await QuizResult.find({ quizId })

    if (results.length === 0) {
      return NextResponse.json(
        {
          totalAttempts: 0,
          averageScore: 0,
          passRate: 0,
          highestScore: 0,
          lowestScore: 0,
          averageTime: 0,
          difficultyDistribution: [],
          scoreDistribution: [],
          scoresByLevel: [],
        },
        { status: 200 },
      )
    }

    const scores = results.map((r) => r.score)
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length
    const highestScore = Math.max(...scores)
    const lowestScore = Math.min(...scores)
    const passingThreshold = 50

    const passRate = (results.filter((r) => r.score >= passingThreshold).length / results.length) * 100

    const scoreDistribution = [
      results.filter((r) => r.score >= 0 && r.score <= 20).length,
      results.filter((r) => r.score > 20 && r.score <= 50).length,
      results.filter((r) => r.score > 50 && r.score <= 80).length,
      results.filter((r) => r.score > 80 && r.score <= 100).length,
    ]

    const averageTime = Math.round(results.reduce((sum, r) => sum + r.timeTaken, 0) / results.length)

    const analytics = {
      totalAttempts: results.length,
      averageScore: averageScore,
      passRate: passRate,
      highestScore: highestScore,
      lowestScore: lowestScore,
      averageTime: averageTime,
      difficultyDistribution: [
        { difficulty: "easy", count: 5 },
        { difficulty: "medium", count: 8 },
        { difficulty: "hard", count: 2 },
      ],
      scoreDistribution: [
        { range: "0-20%", count: scoreDistribution[0] },
        { range: "21-50%", count: scoreDistribution[1] },
        { range: "51-80%", count: scoreDistribution[2] },
        { range: "81-100%", count: scoreDistribution[3] },
      ],
      scoresByLevel: [
        { level: "100L", averageScore: 65, attempts: 10 },
        { level: "200L", averageScore: 72, attempts: 15 },
        { level: "300L", averageScore: 78, attempts: 12 },
        { level: "400L", averageScore: 85, attempts: 8 },
        { level: "500L", averageScore: 88, attempts: 5 },
      ],
    }

    return NextResponse.json(analytics, { status: 200 })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
