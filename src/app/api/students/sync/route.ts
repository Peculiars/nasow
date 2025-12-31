import { connectDB } from '@/src/lib/mongodb/connection';
import { Student, StudentStatus } from '@/src/lib/mongodb/models/Student';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kindeId, email, firstName, lastName, picture } = body;

    if (!kindeId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingStudent = await Student.findOne({ kindeId });

    if (existingStudent) {
      existingStudent.lastActive = new Date();
      
      if (email && existingStudent.email !== email) {
        existingStudent.email = email;
      }
      if (firstName && existingStudent.firstName !== firstName) {
        existingStudent.firstName = firstName;
      }
      if (lastName && existingStudent.lastName !== lastName) {
        existingStudent.lastName = lastName;
      }
      if (picture && existingStudent.profileImage !== picture) {
        existingStudent.profileImage = picture;
      }

      await existingStudent.save();

      return NextResponse.json({
        data: {
          ...existingStudent.toObject(),
          _id: existingStudent._id.toString()
        },
        message: 'Student profile updated'
      });
    }

    const newStudent = await Student.create({
      kindeId,
      email: email || '',
      firstName: firstName || 'Student',
      lastName: lastName || 'User',
      profileImage: picture,
      status: StudentStatus.ACTIVE,
      profileCompleted: false,
      totalScore: 0,
      quizzesTaken: 0,
      registrationDate: new Date(),
      lastActive: new Date()
    });

    return NextResponse.json({
      data: {
        ...newStudent.toObject(),
        _id: newStudent._id.toString()
      },
      message: 'Student profile created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/students/sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync student profile' },
      { status: 500 }
    );
  }
}