import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { uploadCourseImage, uploadCourseMaterial } from '@/src/lib/cloudinary/upload';

export async function POST(request: NextRequest) {
  try {
    const { getPermission } = getKindeServerSession();
    const adminAccess = await getPermission('admin:access');

    if (!adminAccess?.isGranted) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null; 

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!type || !['image', 'material'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid upload type. Must be "image" or "material"' },
        { status: 400 }
      );
    }

    let result;

    if (type === 'image') {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'File must be an image' },
          { status: 400 }
        );
      }

      result = await uploadCourseImage(file);
    } else {
      result = await uploadCourseMaterial(file);
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        ...result,
        name: file.name
      }
    });
  } catch (error: any) {
    console.error('❌ POST /api/admin/upload error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Upload endpoint is working',
    acceptedTypes: {
      image: ['image/jpeg', 'image/png', 'image/webp'],
      material: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    },
    limits: {
      image: '5MB',
      material: '10MB'
    }
  });
}