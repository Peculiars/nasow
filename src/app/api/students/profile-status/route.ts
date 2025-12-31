import { getUser, getUserRoles } from '@/src/lib/auth';
import { connectDB } from '@/src/lib/mongodb/connection';
import { Student } from '@/src/lib/mongodb/models/Student';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { isAdmin } = await getUserRoles();

    if (isAdmin) {
      return NextResponse.json({
        profileCompleted: true,
        isAdmin: true
      });
    }

    await connectDB();

    const student = await Student.findOne({ kindeId: user.id }).lean();

    if (!student) {
      return NextResponse.json({
        profileCompleted: false,
        exists: false
      });
    }

    return NextResponse.json({
      profileCompleted: student.profileCompleted || false,
      exists: true,
      data: {
        level: student.level,
        studentType: student.studentType
      }
    });

  } catch (error) {
    console.error('GET /api/students/profile-status error:', error);
    return NextResponse.json(
      { error: 'Failed to check profile status' },
      { status: 500 }
    );
  }
}