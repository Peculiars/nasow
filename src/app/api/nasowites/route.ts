import { deleteFromCloudinary, uploadCourseImage } from '@/src/lib/cloudinary/upload';
import { connectDB } from '@/src/lib/mongodb/connection';
import Nasowite from '@/src/lib/mongodb/models/Nasowite';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const current = searchParams.get('current');

    if (current === 'true') {
      const nasowite = await Nasowite.findOne({ isCurrent: true });
      return NextResponse.json({ success: true, data: nasowite });
    }

    const nasowites = await Nasowite.find().sort({ weekStartDate: -1 });
    return NextResponse.json({ success: true, data: nasowites });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    
    const image = formData.get('image') as File;
    if (!image) {
      return NextResponse.json({ success: false, error: 'Image is required' }, { status: 400 });
    }

    const uploadResult = await uploadCourseImage(image);

    const isCurrent = formData.get('isCurrent') === 'true';
    if (isCurrent) {
      await Nasowite.updateMany({ isCurrent: true }, { isCurrent: false });
    }

    const achievements = JSON.parse(formData.get('achievements') as string || '[]');
    const socials = JSON.parse(formData.get('socials') as string);

    const nasowite = await Nasowite.create({
      name: formData.get('name'),
      level: formData.get('level'),
      position: formData.get('position'),
      image: uploadResult.url,
      imagePublicId: uploadResult.publicId,
      quote: formData.get('quote'),
      socials,
      achievements,
      isCurrent,
      weekStartDate: new Date(formData.get('weekStartDate') as string),
      weekEndDate: new Date(formData.get('weekEndDate') as string),
    });

    return NextResponse.json({ success: true, data: nasowite }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const formData = await req.formData();
    const nasowite = await Nasowite.findById(id);

    if (!nasowite) {
      return NextResponse.json({ success: false, error: 'Nasowite not found' }, { status: 404 });
    }

    let imageUrl = nasowite.image;
    let imagePublicId = nasowite.imagePublicId;

    const image = formData.get('image') as File | null;
    if (image && image.size > 0) {
      await deleteFromCloudinary(nasowite.imagePublicId);
      const uploadResult = await uploadCourseImage(image);
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }

    const isCurrent = formData.get('isCurrent') === 'true';
    if (isCurrent && !nasowite.isCurrent) {
      await Nasowite.updateMany({ isCurrent: true, _id: { $ne: id } }, { isCurrent: false });
    }

    const achievements = JSON.parse(formData.get('achievements') as string || '[]');
    const socials = JSON.parse(formData.get('socials') as string);

    const updated = await Nasowite.findByIdAndUpdate(
      id,
      {
        name: formData.get('name'),
        level: formData.get('level'),
        position: formData.get('position'),
        image: imageUrl,
        imagePublicId,
        quote: formData.get('quote'),
        socials,
        achievements,
        isCurrent,
        weekStartDate: new Date(formData.get('weekStartDate') as string),
        weekEndDate: new Date(formData.get('weekEndDate') as string),
        updatedAt: new Date(),
      },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    const nasowite = await Nasowite.findById(id);
    if (!nasowite) {
      return NextResponse.json({ success: false, error: 'Nasowite not found' }, { status: 404 });
    }

    await deleteFromCloudinary(nasowite.imagePublicId);
    await Nasowite.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}