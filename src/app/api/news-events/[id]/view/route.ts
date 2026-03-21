
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb/connection';
import NewsEvent from '@/src/lib/mongodb/models/NewsEvent';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Increment view count
    const newsEvent = await NewsEvent.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!newsEvent) {
      return NextResponse.json(
        { error: 'News/Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      views: newsEvent.views
    });
  } catch (error: any) {
    console.error('❌ Track view error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to track view' },
      { status: 500 }
    );
  }
}