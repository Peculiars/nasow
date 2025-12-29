import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { connectDB } from '@/src/lib/mongodb/connection';
import Course from '@/src/lib/mongodb/models/Course';
import { deleteFromCloudinary, deleteMultipleFromCloudinary } from '@/src/lib/cloudinary/upload';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const course = await Course.findById(id).lean();

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('❌ GET /api/admin/courses/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}


export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const body = await request.json();

    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    if (body.coverImage && body.coverImage.publicId !== existingCourse.coverImage.publicId) {
      await deleteFromCloudinary(existingCourse.coverImage.publicId, 'image');
    }


    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });
  } catch (error: any) {
    console.error('❌ PATCH /api/admin/courses/[id] error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const publicIdsToDelete: string[] = [course.coverImage.publicId];

    course.weeks.forEach(week => {
      week.materials.forEach(material => {
        publicIdsToDelete.push(material.publicId);
      });
    });

    await deleteFromCloudinary(course.coverImage.publicId, 'image');

    const materialIds = publicIdsToDelete.filter(id => id !== course.coverImage.publicId);
    if (materialIds.length > 0) {
      await deleteMultipleFromCloudinary(materialIds, 'raw');
    }

    await Course.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Course and all associated files deleted successfully'
    });
  } catch (error) {
    console.error('❌ DELETE /api/admin/courses/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}