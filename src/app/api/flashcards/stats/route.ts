import { connectDB } from "@/src/lib/mongodb/connection";
import Flashcard from "@/src/lib/mongodb/models/Flashcard";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const [
      totalFlashcards,
      byLevel,
      byDifficulty,
      topCategories
    ] = await Promise.all([
      Flashcard.countDocuments({ isActive: true }),
      Flashcard.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$level', count: { $sum: 1 } } }
      ]),
      Flashcard.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$difficulty', count: { $sum: 1 } } }
      ]),
      Flashcard.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total: totalFlashcards,
        byLevel,
        byDifficulty,
        topCategories
      }
    });
  } catch (error: any) {
    console.error('❌ Stats fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}