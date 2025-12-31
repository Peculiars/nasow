import { getUser, requireAdmin } from '@/src/lib/auth';
import { connectDB } from '@/src/lib/mongodb/connection';
import { Student } from '@/src/lib/mongodb/models/Student';
import { StudentStatus } from '@/src/lib/types/students';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const user = await getUser();
    const body = await request.json();
    const { studentIds, action, reason } = body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        { error: 'Student IDs are required' },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    const adminEmail = user?.email || 'admin';
    const timestamp = new Date();
    let updateQuery: any = {};

    switch (action) {
      case 'suspend':
        updateQuery = {
          status: StudentStatus.SUSPENDED,
          suspensionReason: reason || 'Bulk suspension',
          suspendedBy: adminEmail,
          suspendedAt: timestamp,
          updatedBy: adminEmail
        };
        break;

      case 'ban':
        updateQuery = {
          status: StudentStatus.BANNED,
          banReason: reason || 'Bulk ban',
          bannedBy: adminEmail,
          bannedAt: timestamp,
          updatedBy: adminEmail
        };
        break;

      case 'activate':
        updateQuery = {
          status: StudentStatus.ACTIVE,
          $unset: {
            suspensionReason: 1,
            suspendedBy: 1,
            suspendedAt: 1,
            banReason: 1,
            bannedBy: 1,
            bannedAt: 1
          },
          updatedBy: adminEmail
        };
        break;

      case 'delete':
        const deleteResult = await Student.deleteMany({
          _id: { $in: studentIds }
        });

        return NextResponse.json({
          message: `Successfully deleted ${deleteResult.deletedCount} student(s)`,
          deletedCount: deleteResult.deletedCount
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const result = await Student.updateMany(
      { _id: { $in: studentIds } },
      updateQuery
    );

    return NextResponse.json({
      message: `Successfully ${action}d ${result.modifiedCount} student(s)`,
      modifiedCount: result.modifiedCount
    });

  } catch (error: any) {
    console.error('POST /api/admin/students/bulk error:', error);
    
    if (error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to perform bulk action' },
      { status: 500 }
    );
  }
}