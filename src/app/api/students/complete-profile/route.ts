import { getUser, getUserRoles } from '@/src/lib/auth';
import { connectDB } from '@/src/lib/mongodb/connection';
import { Student } from '@/src/lib/mongodb/models/Student';
import { StudentLevel, StudentType } from '@/src/lib/types/students';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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
      return NextResponse.json(
        { error: 'Admin users cannot complete student profile' },
        { status: 400 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { level, studentType, phoneNumber, matricNumber } = body;

    if (!level || !studentType) {
      return NextResponse.json(
        { error: 'Level and student type are required' },
        { status: 400 }
      );
    }

    if (!Object.values(StudentLevel).includes(level)) {
      return NextResponse.json(
        { error: 'Invalid level' },
        { status: 400 }
      );
    }

    if (!Object.values(StudentType).includes(studentType)) {
      return NextResponse.json(
        { error: 'Invalid student type' },
        { status: 400 }
      );
    }

    const student = await Student.findOne({ kindeId: user.id });

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    if (student.profileCompleted) {
      return NextResponse.json(
        { error: 'Profile already completed' },
        { status: 400 }
      );
    }

    student.level = level;
    student.studentType = studentType;
    student.profileCompleted = true;
    
    if (phoneNumber) {
      student.phoneNumber = phoneNumber;
    }

    await student.save();

    return NextResponse.json({
      data: {
        ...student.toObject(),
        _id: student._id.toString()
      },
      message: 'Profile completed successfully'
    });

  } catch (error) {
    console.error('POST /api/students/complete-profile error:', error);
    return NextResponse.json(
      { error: 'Failed to complete profile' },
      { status: 500 }
    );
  }
}