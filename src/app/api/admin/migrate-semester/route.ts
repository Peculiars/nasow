import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { connectDB } from '@/src/lib/mongodb/connection';
import Course from '@/src/lib/mongodb/models/Course';

export async function POST(request: NextRequest) {
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

    const coursesWithoutSemester = await Course.find({
      $or: [
        { semester: { $exists: false } },
        { semester: null }
      ]
    });

    console.log(`Found ${coursesWithoutSemester.length} courses without semester field`);

    // Update all courses to have FIRST semester as default
    const updatePromises = coursesWithoutSemester.map(course => 
      Course.findByIdAndUpdate(
        course._id,
        { $set: { semester: 'FIRST' } },
        { new: true }
      )
    );

    const updatedCourses = await Promise.all(updatePromises);

    console.log(`Updated ${updatedCourses.length} courses with default semester`);

    return NextResponse.json({
      success: true,
      message: `Migration completed successfully`,
      data: {
        coursesFound: coursesWithoutSemester.length,
        coursesUpdated: updatedCourses.length,
        updatedCourseIds: updatedCourses.map(c => c?._id)
      }
    });
  } catch (error) {
    console.error('❌ Migration error:', error);
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check courses without semester
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

    const coursesWithoutSemester = await Course.find({
      $or: [
        { semester: { $exists: false } },
        { semester: null }
      ]
    }).select('title courseCode level studentType semester');

    return NextResponse.json({
      success: true,
      message: `Found ${coursesWithoutSemester.length} courses without semester field`,
      data: {
        count: coursesWithoutSemester.length,
        courses: coursesWithoutSemester
      }
    });
  } catch (error) {
    console.error('❌ Check migration error:', error);
    return NextResponse.json(
      { error: 'Check failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}