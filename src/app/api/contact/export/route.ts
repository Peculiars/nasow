import { connectDB } from '@/src/lib/mongodb/connection';
import { NextRequest, NextResponse } from 'next/server';
import ContactSubmission from '@/src/lib/mongodb/models/Contact'

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const query = status ? { status } : {};

    const submissions = await ContactSubmission.find(query)
      .sort({ submittedAt: -1 })
      .lean();

    const headers = ['Name', 'Email', 'Level', 'Subject', 'Message', 'Status', 'Submitted At'];
    const csvRows = [headers.join(',')];

    submissions.forEach(sub => {
      const row = [
        `"${sub.name}"`,
        `"${sub.email}"`,
        `"${sub.level}"`,
        `"${sub.subject.replace(/"/g, '""')}"`, // Escape quotes
        `"${sub.message.replace(/"/g, '""')}"`,
        `"${sub.status}"`,
        `"${new Date(sub.submittedAt).toLocaleString()}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="contact-submissions-${Date.now()}.csv"`
      }
    });

  } catch (error) {
    console.error('❌ CSV export error:', error);
    return NextResponse.json(
      { error: 'Failed to export CSV' },
      { status: 500 }
    );
  }
}