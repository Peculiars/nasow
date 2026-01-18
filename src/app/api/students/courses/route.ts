import { getUser, getUserRoles } from '@/src/lib/auth';
import { connectDB } from '@/src/lib/mongodb/connection';
import Course from '@/src/lib/mongodb/models/Course';
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
      return NextResponse.json(
        { error: 'This endpoint is for students only' },
        { status: 403 }
      );
    }

    await connectDB();

    const student = await Student.findOne({ kindeId: user.id }).lean();

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    if (!student.profileCompleted || !student.level || !student.studentType) {
      return NextResponse.json(
        { error: 'Please complete your profile first' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    // Build the filter - only status and optional search
    const filter: any = {
      status: { $in: ['published', 'PUBLISHED'] }
    };

    // Add search filter if provided
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { courseCode: { $regex: search, $options: 'i' } },
        { lecturerName: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Query filter:', JSON.stringify(filter, null, 2));

    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    console.log('Courses found:', courses.length);

    return NextResponse.json({
      success: true,
      data: courses,
      count: courses.length,
      student: {
        level: student.level,
        studentType: student.studentType,
        fullName: `${student.firstName} ${student.lastName}`
      }
    });
  } catch (error) {
    console.error('GET /api/students/courses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}