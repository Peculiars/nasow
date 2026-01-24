// app/api/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to download files.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const filename = searchParams.get('filename');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Verify the URL is from your Cloudinary account
    if (!url.includes('res.cloudinary.com/deym5qcv5')) {
      return NextResponse.json(
        { error: 'Invalid file URL' },
        { status: 400 }
      );
    }

    console.log('📥 Fetching file from:', url);

    // Fetch the file from Cloudinary with a longer timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error('❌ Cloudinary fetch failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Failed to fetch file: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the file as a buffer
    const buffer = await response.arrayBuffer();
    
    console.log('✅ File fetched successfully, size:', buffer.byteLength);

    // Get content type from the original response or infer from filename
    let contentType = response.headers.get('content-type');
    
    if (!contentType && filename) {
      const ext = filename.split('.').pop()?.toLowerCase();
      const mimeTypes: Record<string, string> = {
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'ppt': 'application/vnd.ms-powerpoint',
        'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      };
      contentType = mimeTypes[ext || ''] || 'application/octet-stream';
    }

    // Return the file with download headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename || 'download')}"`,
        'Content-Type': contentType || 'application/octet-stream',
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error: any) {
    console.error('❌ Download error:', error);
    
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout - file too large or network issue' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to download file: ${error.message}` },
      { status: 500 }
    );
  }
}