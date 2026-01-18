import { deleteFromCloudinary } from '@/src/lib/cloudinary/upload';
import { connectDB } from '@/src/lib/mongodb/connection';
import Banner from '@/src/lib/mongodb/models/Banner';
import { uploadBannerImage } from '@/src/lib/uploadBanner';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get('active') === 'true';

    const query = activeOnly ? { isActive: true } : {};
    const banners = await Banner.find(query).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: banners
    });
  } catch (error: any) {
    console.error('❌ Fetch banners error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File;
    const website = formData.get('website') as string;
    const twitter = formData.get('twitter') as string;
    const facebook = formData.get('facebook') as string;
    const instagram = formData.get('instagram') as string;
    const linkedin = formData.get('linkedin') as string;
    const isActive = formData.get('isActive') === 'true';
    const order = parseInt(formData.get('order') as string) || 0;

    if (!title || !description || !imageFile) {
      return NextResponse.json(
        { success: false, error: 'Title, description, and image are required' },
        { status: 400 }
      );
    }

    const uploadedImage = await uploadBannerImage(imageFile);

    const banner = await Banner.create({
      title,
      description,
      image: {
        url: uploadedImage.url,
        publicId: uploadedImage.publicId
      },
      socialLinks: {
        website: website || undefined,
        twitter: twitter || undefined,
        facebook: facebook || undefined,
        instagram: instagram || undefined,
        linkedin: linkedin || undefined
      },
      isActive,
      order
    });

    return NextResponse.json({
      success: true,
      data: banner
    }, { status: 201 });
  } catch (error: any) {
    console.error('❌ Create banner error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update banner
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const bannerId = formData.get('bannerId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File | null;
    const website = formData.get('website') as string;
    const twitter = formData.get('twitter') as string;
    const facebook = formData.get('facebook') as string;
    const instagram = formData.get('instagram') as string;
    const linkedin = formData.get('linkedin') as string;
    const isActive = formData.get('isActive') === 'true';
    const order = parseInt(formData.get('order') as string) || 0;

    if (!bannerId) {
      return NextResponse.json(
        { success: false, error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    const banner = await Banner.findById(bannerId);
    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      );
    }

    let imageData = banner.image;

    if (imageFile) {
      await deleteFromCloudinary(banner.image.publicId, 'image');
      const uploadedImage = await uploadBannerImage(imageFile);
      imageData = {
        url: uploadedImage.url,
        publicId: uploadedImage.publicId
      };
    }

    banner.title = title || banner.title;
    banner.description = description || banner.description;
    banner.image = imageData;
    banner.socialLinks = {
      website: website || undefined,
      twitter: twitter || undefined,
      facebook: facebook || undefined,
      instagram: instagram || undefined,
      linkedin: linkedin || undefined
    };
    banner.isActive = isActive;
    banner.order = order;

    await banner.save();

    return NextResponse.json({
      success: true,
      data: banner
    });
  } catch (error: any) {
    console.error('❌ Update banner error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const bannerId = searchParams.get('id');

    if (!bannerId) {
      return NextResponse.json(
        { success: false, error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    const banner = await Banner.findById(bannerId);
    if (!banner) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      );
    }

    await deleteFromCloudinary(banner.image.publicId, 'image');

    await Banner.findByIdAndDelete(bannerId);

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ Delete banner error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}