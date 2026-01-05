// app/api/students/profile/route.ts
import { connectDB } from "@/src/lib/mongodb/connection"
import { Student } from "@/src/lib/mongodb/models/Student"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const student = await Student.findOne({ kindeId: user.id }).select("-__v")

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const studentData = {
      kindeId: student.kindeId,
      email: student.email,
      firstName: student.firstName,
      lastName: student.lastName,
      profileImage: student.profileImage || null,
      phoneNumber: student.phoneNumber || null,
      level: student.level || null,
      studentType: student.studentType || null,
      matricNumber: student.matricNumber || null,
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.toISOString() : null,
      address: student.address || null,
      city: student.city || null,
      state: student.state || null,
      bio: student.bio || null,
      faculty: "Faculty of Social Sciences",
      department: "Social Work",
      profileCompleted: student.profileCompleted,
      status: student.status,
      totalScore: student.totalScore,
      quizzesTaken: student.quizzesTaken,
      registrationDate: student.registrationDate.toISOString(),
      lastActive: student.lastActive ? student.lastActive.toISOString() : null,
      createdAt: student.createdAt.toISOString(),
      updatedAt: student.updatedAt.toISOString(),
      _id: student._id.toString(),
    }

    return NextResponse.json(studentData)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("📥 Received update data:", body)
    
    await connectDB()

    // Build update object - only include fields that are actually provided
    const updateData: any = {}

    // String fields that can be updated
    const stringFields = ['firstName', 'lastName', 'phoneNumber', 'matricNumber', 'address', 'city', 'state', 'bio']
    
    for (const field of stringFields) {
      if (field in body) {
        const value = body[field]
        if (value === null || value === undefined || value === '') {
          // Skip empty values - don't update them
          continue
        }
        // Trim and update non-empty values
        const trimmed = String(value).trim()
        if (trimmed) {
          updateData[field] = trimmed
        }
      }
    }

    // Handle enum fields (level, studentType)
    if (body.level && body.level !== '') {
      updateData.level = body.level
    }
    if (body.studentType && body.studentType !== '') {
      updateData.studentType = body.studentType
    }

    // Handle dateOfBirth
    if (body.dateOfBirth && body.dateOfBirth !== '') {
      try {
        const date = new Date(body.dateOfBirth)
        if (!isNaN(date.getTime())) {
          updateData.dateOfBirth = date
        }
      } catch (error) {
        console.error('❌ Invalid date format:', body.dateOfBirth)
      }
    }

    // Always update lastActive
    updateData.lastActive = new Date()

    console.log("✅ Final update data:", updateData)

    if (Object.keys(updateData).length === 1 && updateData.lastActive) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    // Update the student
    const updatedStudent = await Student.findOneAndUpdate(
      { kindeId: user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-__v")

    if (!updatedStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Check if profile should be marked as completed
    if (updatedStudent.level && updatedStudent.studentType && !updatedStudent.profileCompleted) {
      updatedStudent.profileCompleted = true
      await updatedStudent.save()
    }

    const studentData = {
      kindeId: updatedStudent.kindeId,
      email: updatedStudent.email,
      firstName: updatedStudent.firstName,
      lastName: updatedStudent.lastName,
      profileImage: updatedStudent.profileImage || null,
      phoneNumber: updatedStudent.phoneNumber || null,
      level: updatedStudent.level || null,
      studentType: updatedStudent.studentType || null,
      matricNumber: updatedStudent.matricNumber || null,
      dateOfBirth: updatedStudent.dateOfBirth ? updatedStudent.dateOfBirth.toISOString() : null,
      address: updatedStudent.address || null,
      city: updatedStudent.city || null,
      state: updatedStudent.state || null,
      bio: updatedStudent.bio || null,
      faculty: "Faculty of Social Sciences",
      department: "Social Work",
      profileCompleted: updatedStudent.profileCompleted,
      status: updatedStudent.status,
      totalScore: updatedStudent.totalScore,
      quizzesTaken: updatedStudent.quizzesTaken,
      registrationDate: updatedStudent.registrationDate.toISOString(),
      lastActive: updatedStudent.lastActive ? updatedStudent.lastActive.toISOString() : null,
      createdAt: updatedStudent.createdAt.toISOString(),
      updatedAt: updatedStudent.updatedAt.toISOString(),
      _id: updatedStudent._id.toString(),
    }

    console.log("📤 Returning student data:", studentData)

    return NextResponse.json(studentData)
  } catch (error: any) {
    console.error("❌ Error updating profile:", error)
    return NextResponse.json({ 
      error: "Failed to update profile", 
      details: error.message 
    }, { status: 500 })
  }
}