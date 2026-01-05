import { connectDB } from '@/src/lib/mongodb/connection';
import { NextRequest, NextResponse } from 'next/server';
import ContactSubmission from '@/src/lib/mongodb/models/Contact'

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, level, subject, message } = body;

    if (!name || !email || !level || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const submission = await ContactSubmission.create({
      name,
      email,
      level,
      subject,
      message
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Your message has been submitted successfully!',
        submissionId: submission._id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Contact submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');

    const query = status ? { status } : {};

    const submissions = await ContactSubmission.find(query)
      .sort({ submittedAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      count: submissions.length,
      submissions
    });

  } catch (error) {
    console.error('❌ Fetch submissions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}