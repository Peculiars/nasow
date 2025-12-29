import { NextRequest, NextResponse } from 'next/server';
import { getUser, requireAdmin } from '@/src/lib/auth';
import { connectDB } from '@/src/lib/mongodb/connection';
import { Student, StudentStatus } from '@/src/lib/mongodb/models/Student';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const user = await getUser();
    const body = await request.json();
    const { studentId, action, reason } = body;

    if (!studentId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const adminEmail = user?.email || 'admin';
    const timestamp = new Date();

    switch (action) {
      case 'suspend':
        student.status = StudentStatus.SUSPENDED;
        student.suspensionReason = reason || 'No reason provided';
        student.suspendedBy = adminEmail;
        student.suspendedAt = timestamp;
        break;

      case 'ban':
        student.status = StudentStatus.BANNED;
        student.banReason = reason || 'No reason provided';
        student.bannedBy = adminEmail;
        student.bannedAt = timestamp;
        break;

      case 'activate':
        student.status = StudentStatus.ACTIVE;
        student.suspensionReason = undefined;
        student.suspendedBy = undefined;
        student.suspendedAt = undefined;
        student.banReason = undefined;
        student.bannedBy = undefined;
        student.bannedAt = undefined;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    student.updatedBy = adminEmail;
    await student.save();

    return NextResponse.json({
      data: {
        ...student.toObject(),
        _id: student._id.toString()
      },
      message: `Student ${action}d successfully`
    });

  } catch (error) {
    console.error('POST /api/admin/students/actions error:', error);
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    );
  }
}