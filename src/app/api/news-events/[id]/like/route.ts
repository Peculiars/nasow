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
    const body = await request.json();
    const { action } = body; // 'like' or 'unlike'

    if (!['like', 'unlike'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "like" or "unlike"' },
        { status: 400 }
      );
    }

    // Increment or decrement likes based on action
    const increment = action === 'like' ? 1 : -1;
    
    const newsEvent = await NewsEvent.findByIdAndUpdate(
      id,
      { $inc: { likes: increment } },
      { new: true }
    );

    if (!newsEvent) {
      return NextResponse.json(
        { error: 'News/Event not found' },
        { status: 404 }
      );
    }

    // Ensure likes never go below 0
    if (newsEvent.likes < 0) {
      newsEvent.likes = 0;
      await newsEvent.save();
    }

    return NextResponse.json({
      success: true,
      likes: newsEvent.likes,
      action: action
    });
  } catch (error: any) {
    console.error('❌ Like/Unlike error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update like' },
      { status: 500 }
    );
  }
}