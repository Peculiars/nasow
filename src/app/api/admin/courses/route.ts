import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { connectDB } from '@/src/lib/mongodb/connection';
import Course from '@/src/lib/mongodb/models/Course';

export async function GET(request: NextRequest) {
  try {
    const { getPermission } = getKindeServerSession();
    const adminAccess = await getPermission('admin:access');

    if (!adminAccess?.isGranted) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const studentType = searchParams.get('studentType');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const filter: any = {};
    if (level) filter.level = level;
    if (studentType) filter.studentType = studentType;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { courseCode: { $regex: search, $options: 'i' } },
        { lecturerName: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: courses,
      count: courses.length
    });
  } catch (error) {
    console.error('❌ GET /api/admin/courses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { getPermission, getUser } = getKindeServerSession();
    const adminAccess = await getPermission('admin:access');
    const user = await getUser();

    if (!adminAccess?.isGranted) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await request.json();

    const requiredFields = [
      'title',
      'courseCode',
      'level',
      'studentType',
      'lecturerName',
      'coverImage'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const course = await Course.create({
      ...body,
      createdBy: user?.id,
      weeks: body.weeks || []
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Course created successfully',
        data: course
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ POST /api/admin/courses error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}