import { requireAdmin } from '@/src/lib/auth';
import { deleteFromCloudinary } from '@/src/lib/cloudinary/upload';
import { connectDB } from '@/src/lib/mongodb/connection';
import { Executive } from '@/src/lib/mongodb/models/Executive';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // await the Promise

  try {
    await requireAdmin();
    await connectDB();

    const executive = await Executive.findById(id).lean();

    if (!executive) {
      return NextResponse.json({ error: 'Executive not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...executive,
        _id: executive._id.toString(),
      },
    });
  } catch (error: any) {
    console.error('GET /api/admin/executives/[id] error:', error);

    if (error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Failed to fetch executive' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await requireAdmin();
    await connectDB();

    const body = await request.json();

    const existingExecutive = await Executive.findById(id);
    if (!existingExecutive) {
      return NextResponse.json({ error: 'Executive not found' }, { status: 404 });
    }

    if (body.image && body.image.publicId !== existingExecutive.image.publicId) {
      await deleteFromCloudinary(existingExecutive.image.publicId, 'image');
    }

    const updatedExecutive = await Executive.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Executive updated successfully',
      data: {
        ...updatedExecutive!.toObject(),
        _id: updatedExecutive!._id.toString(),
      },
    });
  } catch (error: any) {
    console.error('PATCH /api/admin/executives/[id] error:', error);

    if (error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to update executive' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await requireAdmin();
    await connectDB();

    const executive = await Executive.findById(id);

    if (!executive) {
      return NextResponse.json(
        { error: 'Executive not found' },
        { status: 404 }
      );
    }

    await deleteFromCloudinary(executive.image.publicId, 'image');
    await Executive.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Executive deleted successfully'
    });
  } catch (error: any) {
    console.error('DELETE /api/admin/executives/[id] error:', error);

    if (error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Failed to delete executive' },
      { status: 500 }
    );
  }
}