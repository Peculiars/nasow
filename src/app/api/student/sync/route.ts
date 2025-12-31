import { getOrCreateStudent } from "@/src/lib/students"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] GET /api/student/sync called")

    const { getUser, isAuthenticated } = getKindeServerSession()

    if (!isAuthenticated()) {
      console.log("[v0] User not authenticated")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUser()
    console.log("[v0] User retrieved:", user?.id)

    if (!user) {
      console.log("[v0] No user found")
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const student = await getOrCreateStudent(user)

    if (!student) {
      console.log("[v0] Failed to create or fetch student")
      return NextResponse.json({ error: "Failed to sync student" }, { status: 500 })
    }

    console.log("[v0] Student synced successfully:", student._id)
    return NextResponse.json({
      studentId: student._id.toString(),
      level: student.level,
      studentType: student.studentType,
    })
  } catch (error) {
    console.error("[v0] Error syncing student:", error)
    return NextResponse.json({ error: "Failed to sync student", details: String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}