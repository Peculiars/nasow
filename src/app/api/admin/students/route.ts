import { requireAdmin } from '@/src/lib/auth';
import { connectDB } from '@/src/lib/mongodb/connection';
import { Student } from '@/src/lib/mongodb/models/Student';
import { StudentStatus } from '@/src/lib/types/students';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as StudentStatus | null;
    const search = searchParams.get('search') || '';
    const minScore = searchParams.get('minScore');
    const maxScore = searchParams.get('maxScore');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortBy = searchParams.get('sortBy') || 'registrationDate';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (minScore || maxScore) {
      query.totalScore = {};
      if (minScore) query.totalScore.$gte = parseInt(minScore);
      if (maxScore) query.totalScore.$lte = parseInt(maxScore);
    }

    if (startDate || endDate) {
      query.registrationDate = {};
      if (startDate) query.registrationDate.$gte = new Date(startDate);
      if (endDate) query.registrationDate.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments(query)
    ]);

    const studentsWithVirtuals = students.map(student => ({
      ...student,
      _id: student._id.toString(),
      fullName: `${student.firstName} ${student.lastName}`,
      averageScore: student.quizzesTaken > 0 
        ? Math.round(student.totalScore / student.quizzesTaken) 
        : 0
    }));

    return NextResponse.json({
      data: studentsWithVirtuals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('GET /api/admin/students error:', error);
    
    if (error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await request.json();
    const { kindeId, email, firstName, lastName, phoneNumber, profileImage } = body;

    if (!kindeId || !email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingStudent = await Student.findOne({
      $or: [{ kindeId }, { email }]
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: 'Student already exists' },
        { status: 409 }
      );
    }

    const student = await Student.create({
      kindeId,
      email,
      firstName,
      lastName,
      phoneNumber,
      profileImage,
      status: StudentStatus.ACTIVE,
      totalScore: 0,
      quizzesTaken: 0,
      registrationDate: new Date()
    });

    return NextResponse.json(
      { 
        data: {
          ...student.toObject(),
          _id: student._id.toString()
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('POST /api/admin/students error:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}