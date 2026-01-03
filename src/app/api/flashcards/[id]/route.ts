import { connectDB } from "@/src/lib/mongodb/connection";
import Flashcard from "@/src/lib/mongodb/models/Flashcard";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params; // Await params here

    const body = await request.json();
    const flashcard = await Flashcard.findByIdAndUpdate(
      id,
      {
        ...body,
        tags: body.tags?.map((tag: string) => tag.trim().toLowerCase()),
        courseCode: body.courseCode?.trim().toUpperCase()
      },
      { new: true, runValidators: true }
    );

    if (!flashcard) {
      return NextResponse.json(
        { success: false, error: 'Flashcard not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: flashcard,
      message: 'Flashcard updated successfully'
    });
  } catch (error: any) {
    console.error('❌ Flashcard update error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update flashcard' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params; // Await params here

    const flashcard = await Flashcard.findByIdAndDelete(id);

    if (!flashcard) {
      return NextResponse.json(
        { success: false, error: 'Flashcard not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Flashcard deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ Flashcard deletion error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete flashcard' },
      { status: 500 }
    );
  }
}