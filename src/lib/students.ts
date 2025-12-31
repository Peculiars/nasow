import { connectDB } from "./mongodb/connection"
import { IStudent, Student } from "./mongodb/models/Student"

export async function getOrCreateStudent(kindeUser: any): Promise<IStudent | null> {
  try {
    await connectDB()

    let student = await Student.findOne({ kindeId: kindeUser.id })

    if (!student) {
      student = await Student.create({
        kindeId: kindeUser.id,
        email: kindeUser.email,
        firstName: kindeUser.given_name || "Student",
        lastName: kindeUser.family_name || "",
        profileImage: kindeUser.picture,
        profileCompleted: false,
      })
    }

    return student
  } catch (error) {
    console.error("Error getting or creating student:", error)
    return null
  }
}

export async function getStudentByKindeId(kindeId: string): Promise<IStudent | null> {
  try {
    await connectDB()
    const student = await Student.findOne({ kindeId })
    return student
  } catch (error) {
    console.error("Error fetching student:", error)
    return null
  }
}

export async function getStudentMongoId(kindeId: string): Promise<string | null> {
  try {
    await connectDB()
    const student = await Student.findOne({ kindeId }, { _id: 1 })
    return student?._id?.toString() || null
  } catch (error) {
    console.error("Error fetching student ID:", error)
    return null
  }
}
