import { getUser, getUserRoles } from '@/src/lib/auth';
import { connectDB } from '@/src/lib/mongodb/connection';
import Course from '@/src/lib/mongodb/models/Course';
import { Student } from '@/src/lib/mongodb/models/Student';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const course = await Course.findById(id).lean();
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    if (course.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Course is not available' },
        { status: 403 }
      );
    }

    // No level or student type filtering - all students can access all published courses
    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    console.error('GET /api/students/courses/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}