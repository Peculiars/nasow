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

    // Extract numeric part from both student and course levels
    const studentLevelNumber = student.level.replace(/\D/g, '');
    const courseLevelNumber = (course.level || '').toString().replace(/\D/g, '');

    // Check if levels match (comparing numeric parts)
    const levelMatches =
      course.level === student.level ||
      courseLevelNumber === studentLevelNumber ||
      course.level === `${studentLevelNumber}L` ||
      course.level === `${studentLevelNumber} Level` ||
      `${course.level}`.startsWith(studentLevelNumber);

    console.log('Student level:', student.level, '(numeric:', studentLevelNumber, ')');
    console.log('Course level:', course.level, '(numeric:', courseLevelNumber, ')');
    console.log('Level matches:', levelMatches);

    if (!levelMatches) {
      return NextResponse.json(
        { error: 'This course is not available for your level' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: course });
  } catch (error) {
    console.error('GET /api/students/courses/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}