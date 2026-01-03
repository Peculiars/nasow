import { connectDB } from "@/src/lib/mongodb/connection";
import Flashcard from "@/src/lib/mongodb/models/Flashcard";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params; // Await params here
    const { action } = await request.json();

    const updateField: any = { $inc: {} };
    
    if (action === 'view') {
      updateField.$inc.viewCount = 1;
    } else if (action === 'mastered') {
      updateField.$inc.masteredCount = 1;
    } else if (action === 'review') {
      updateField.$inc.reviewCount = 1;
    }

    const flashcard = await Flashcard.findByIdAndUpdate(
      id,
      updateField,
      { new: true }
    );

    if (!flashcard) {
      return NextResponse.json(
        { success: false, error: 'Flashcard not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Tracking updated'
    });
  } catch (error: any) {
    console.error('❌ Tracking error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}