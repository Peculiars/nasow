import { requireAdmin } from '@/src/lib/auth';
import { connectDB } from '@/src/lib/mongodb/connection';
import { Executive } from '@/src/lib/mongodb/models/Executive';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const session = searchParams.get('session');
    const isActive = searchParams.get('isActive');

    const filter: any = {};
    if (session) filter.session = session;
    if (isActive !== null) filter.isActive = isActive === 'true';

    const executives = await Executive.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: executives.map(exec => ({
        ...exec,
        _id: exec._id.toString()
      }))
    });
  } catch (error: any) {
    console.error('GET /api/admin/executives error:', error);
    
    if (error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch executives' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await request.json();

    const requiredFields = ['name', 'position', 'level', 'image', 'bio', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const executive = await Executive.create(body);

    console.log('executive', executive)

    return NextResponse.json({
      success: true,
      message: 'Executive created successfully',
      data: {
        ...(executive as any).toObject(),
        _id: (executive as any)._id.toString()
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/admin/executives error:', error);
    console.error("❌ CREATE EXECUTIVE ERROR");
    console.error("Message:", error?.message);
    console.error("Stack:", error?.stack);
    console.error("Full error:", error);

    if (error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create executive' },
      { status: 500 }
    );
  }
}