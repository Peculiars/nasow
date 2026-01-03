import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { connectDB } from '@/src/lib/mongodb/connection';
import Flashcard from '@/src/lib/mongodb/models/Flashcard';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const level = searchParams.get('level');
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const semester = searchParams.get('semester');
    const tags = searchParams.get('tags');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const sort = searchParams.get('sort') || '-createdAt';

    const query: any = { isActive: true };

    if (level && level !== 'All') query.level = level;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (semester) query.semester = { $in: [semester, 'Both'] };
    if (tags) query.tags = { $in: tags.split(',') };

    const skip = (page - 1) * limit;

    const [flashcards, total] = await Promise.all([
      Flashcard.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Flashcard.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: flashcards,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error: any) {
    console.error('❌ Flashcards fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch flashcards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      category,
      question,
      answer,
      difficulty,
      level,
      keyPoints,
      relatedTopics,
      explanation,
      tags,
      semester,
      courseCode
    } = body;

    // Validation
    if (!category || !question || !answer || !difficulty || !level) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!keyPoints || keyPoints.length < 2) {
      return NextResponse.json(
        { success: false, error: 'At least 2 key points are required' },
        { status: 400 }
      );
    }

    if (!relatedTopics || relatedTopics.length < 1) {
      return NextResponse.json(
        { success: false, error: 'At least 1 related topic is required' },
        { status: 400 }
      );
    }

    const flashcard = await Flashcard.create({
      category: category.trim(),
      question: question.trim(),
      answer: answer.trim(),
      difficulty,
      level,
      keyPoints: keyPoints.map((kp: string) => kp.trim()),
      relatedTopics: relatedTopics.map((rt: string) => rt.trim()),
      explanation: explanation.trim(),
      tags: tags?.map((tag: string) => tag.trim().toLowerCase()) || [],
      semester,
      courseCode: courseCode?.trim().toUpperCase(),
      createdBy: user.id
    });

    return NextResponse.json({
      success: true,
      data: flashcard,
      message: 'Flashcard created successfully'
    }, { status: 201 });
  } catch (error: any) {
    console.error('❌ Flashcard creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create flashcard' },
      { status: 500 }
    );
  }
}
