import { deleteFromCloudinary } from '@/src/lib/cloudinary/upload';
import { uploadLecturerImage } from '@/src/lib/lecturer';
import { connectDB } from '@/src/lib/mongodb/connection';
import Lecturer from '@/src/lib/mongodb/models/Lecturer';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const lecturerId = searchParams.get('id');

    if (lecturerId) {
      const lecturer = await Lecturer.findById(lecturerId);
      if (!lecturer) {
        return NextResponse.json(
          { error: 'Lecturer not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(lecturer);
    }

    const query = status ? { status } : {};
    const lecturers = await Lecturer.find(query).sort({ order: 1, name: 1 });

    return NextResponse.json(lecturers);
  } catch (error) {
    console.error('GET /api/lecturers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lecturers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    const imageUpload = await uploadLecturerImage(imageFile);

    const lecturerData = {
      name: formData.get('name') as string,
      title: formData.get('title') as string,
      specialization: formData.get('specialization') as string,
      qualifications: formData.get('qualifications') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      bio: formData.get('bio') as string || undefined,
      image: imageUpload.url,
      imagePublicId: imageUpload.publicId,
      courses: JSON.parse(formData.get('courses') as string || '[]'),
      researchInterests: JSON.parse(formData.get('researchInterests') as string || '[]'),
      publications: JSON.parse(formData.get('publications') as string || '[]'),
      education: JSON.parse(formData.get('education') as string || '[]'),
      officeLocation: formData.get('officeLocation') as string || undefined,
      officeHours: formData.get('officeHours') as string || undefined,
      linkedIn: formData.get('linkedIn') as string || undefined,
      googleScholar: formData.get('googleScholar') as string || undefined,
      status: formData.get('status') as string || 'active',
      order: parseInt(formData.get('order') as string || '0'),
    };

    const lecturer = await Lecturer.create(lecturerData);

    return NextResponse.json(lecturer, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/lecturers error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create lecturer' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const lecturerId = formData.get('id') as string;

    if (!lecturerId) {
      return NextResponse.json(
        { error: 'Lecturer ID is required' },
        { status: 400 }
      );
    }

    const lecturer = await Lecturer.findById(lecturerId);
    if (!lecturer) {
      return NextResponse.json(
        { error: 'Lecturer not found' },
        { status: 404 }
      );
    }

    const updateData: any = {
      name: formData.get('name') as string,
      title: formData.get('title') as string,
      specialization: formData.get('specialization') as string,
      qualifications: formData.get('qualifications') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || undefined,
      bio: formData.get('bio') as string || undefined,
      courses: JSON.parse(formData.get('courses') as string || '[]'),
      researchInterests: JSON.parse(formData.get('researchInterests') as string || '[]'),
      publications: JSON.parse(formData.get('publications') as string || '[]'),
      education: JSON.parse(formData.get('education') as string || '[]'),
      officeLocation: formData.get('officeLocation') as string || undefined,
      officeHours: formData.get('officeHours') as string || undefined,
      linkedIn: formData.get('linkedIn') as string || undefined,
      googleScholar: formData.get('googleScholar') as string || undefined,
      status: formData.get('status') as string || 'active',
      order: parseInt(formData.get('order') as string || '0'),
    };

    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.size > 0) {
      await deleteFromCloudinary(lecturer.imagePublicId, 'image');
      const imageUpload = await uploadLecturerImage(imageFile);
      updateData.image = imageUpload.url;
      updateData.imagePublicId = imageUpload.publicId;
    }

    const updatedLecturer = await Lecturer.findByIdAndUpdate(
      lecturerId,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedLecturer);
  } catch (error: any) {
    console.error('PUT /api/lecturers error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update lecturer' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const lecturerId = searchParams.get('id');

    if (!lecturerId) {
      return NextResponse.json(
        { error: 'Lecturer ID is required' },
        { status: 400 }
      );
    }

    const lecturer = await Lecturer.findById(lecturerId);
    if (!lecturer) {
      return NextResponse.json(
        { error: 'Lecturer not found' },
        { status: 404 }
      );
    }

    await deleteFromCloudinary(lecturer.imagePublicId, 'image');
    await Lecturer.findByIdAndDelete(lecturerId);

    return NextResponse.json({ message: 'Lecturer deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/lecturers error:', error);
    return NextResponse.json(
      { error: 'Failed to delete lecturer' },
      { status: 500 }
    );
  }
}