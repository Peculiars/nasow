import { requireAdmin } from '@/src/lib/auth';
import { connectDB } from '@/src/lib/mongodb/connection';
import { Student, StudentStatus } from '@/src/lib/mongodb/models/Student';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const [
      totalStudents,
      activeStudents,
      suspendedStudents,
      bannedStudents,
      scoreStats
    ] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ status: StudentStatus.ACTIVE }),
      Student.countDocuments({ status: StudentStatus.SUSPENDED }),
      Student.countDocuments({ status: StudentStatus.BANNED }),
      Student.aggregate([
        {
          $group: {
            _id: null,
            totalScore: { $sum: '$totalScore' },
            totalQuizzesTaken: { $sum: '$quizzesTaken' }
          }
        }
      ])
    ]);

    const stats = scoreStats[0] || { totalScore: 0, totalQuizzesTaken: 0 };
    const averageScore = stats.totalQuizzesTaken > 0 
      ? Math.round(stats.totalScore / stats.totalQuizzesTaken) 
      : 0;

    return NextResponse.json({
      data: {
        totalStudents,
        activeStudents,
        suspendedStudents,
        bannedStudents,
        averageScore,
        totalQuizzesTaken: stats.totalQuizzesTaken
      }
    });

  } catch (error) {
    console.error('GET /api/admin/students/stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}