import { connectDB } from '@/src/lib/mongodb/connection';
import { Executive } from '@/src/lib/mongodb/models/Executive';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const session = searchParams.get('session');

    const executives = await Executive.find({
      isActive: true
    })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: executives.map(exec => ({
        ...exec,
        _id: exec._id.toString()
      })),
    });
  } catch (error) {
    console.error('GET /api/executives error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch executives' },
      { status: 500 }
    );
  }
}