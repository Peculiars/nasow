import { connectDB } from "@/src/lib/mongodb/connection"
import { QuizResult } from "@/src/lib/mongodb/models/QuizResult"
import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get("quizId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!quizId || !mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ error: "Invalid or missing quizId" }, { status: 400 })
    }

    const leaderboard = await QuizResult.aggregate([
      { $match: { quizId: new mongoose.Types.ObjectId(quizId) } },
      { $sort: { score: -1, completedAt: 1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $project: {
          rank: 1,
          score: 1,
          totalPoints: 1,
          timeTaken: 1,
          completedAt: 1,
          "student.firstName": 1,
          "student.lastName": 1,
          "student.email": 1,
          "student.level": 1,
          "student.studentType": 1,
          "student.profileImage": 1,
        },
      },
    ])

    const leaderboardWithRanks = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }))

    return NextResponse.json(leaderboardWithRanks, { status: 200 })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
