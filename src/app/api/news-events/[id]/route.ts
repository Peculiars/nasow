import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { connectDB } from '@/src/lib/mongodb/connection';
import NewsEvent from '@/src/lib/mongodb/models/NewsEvent';
import {
  deleteNewsEventImages,
  uploadNewsEventGalleryImage,
  uploadNewsEventImage
} from '@/src/lib/uploadNewsEventImage';

/* ===================== GET ===================== */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    const newsEvent = await NewsEvent.findById(id);

    if (!newsEvent) {
      return NextResponse.json(
        { error: 'News/Event not found' },
        { status: 404 }
      );
    }

    // Return the news/event data WITHOUT incrementing views
    // View tracking will be handled by a separate endpoint
    return NextResponse.json({
      success: true,
      data: newsEvent
    });
  } catch (error: any) {
    console.error('❌ Get news/event error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch news/event' },
      { status: 500 }
    );
  }
}

/* ===================== PUT ===================== */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getUser, getPermission } = getKindeServerSession();
    const user = await getUser();
    const isAdmin = await getPermission('admin:access');

    if (!user || !isAdmin?.isGranted) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await params;

    const existingNewsEvent = await NewsEvent.findById(id);
    if (!existingNewsEvent) {
      return NextResponse.json(
        { error: 'News/Event not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;

    let slug = existingNewsEvent.slug;
    if (title !== existingNewsEvent.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      let uniqueSlug = slug;
      let counter = 1;
      while (
        await NewsEvent.findOne({ slug: uniqueSlug, _id: { $ne: id } })
      ) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
      slug = uniqueSlug;
    }

    const updateData: any = {
      title,
      slug,
      category: formData.get('category') as string,
      type: formData.get('type') as string,
      description: formData.get('description') as string,
      content: formData.get('content') as string,
      date: new Date(formData.get('date') as string),
      time: (formData.get('time') as string) || undefined,
      endDate: formData.get('endDate')
        ? new Date(formData.get('endDate') as string)
        : undefined,
      location: (formData.get('location') as string) || undefined,
      maxAttendees: formData.get('maxAttendees')
        ? parseInt(formData.get('maxAttendees') as string)
        : undefined,
      registrationLink:
        (formData.get('registrationLink') as string) || undefined,
      registrationDeadline: formData.get('registrationDeadline')
        ? new Date(formData.get('registrationDeadline') as string)
        : undefined,
      featured: formData.get('featured') === 'true',
      published: formData.get('published') === 'true',
      tags: formData.get('tags')
        ? (formData.get('tags') as string)
            .split(',')
            .map(tag => tag.trim())
        : [],
      organizer: {
        name: formData.get('organizerName') as string,
        contact:
          (formData.get('organizerContact') as string) || undefined
      }
    };

    const featuredImage = formData.get('featuredImage') as File;
    if (featuredImage && featuredImage.size > 0) {
      await deleteNewsEventImages([existingNewsEvent.image.publicId]);
      const imageUpload = await uploadNewsEventImage(featuredImage);
      updateData.image = {
        url: imageUpload.url,
        publicId: imageUpload.publicId
      };
    }

    const galleryFiles = formData.getAll('gallery') as File[];
    if (galleryFiles.length > 0 && galleryFiles[0].size > 0) {
      if (existingNewsEvent.gallery?.length) {
        await deleteNewsEventImages(
          existingNewsEvent.gallery.map(img => img.publicId)
        );
      }

      const galleryImages = [];
      for (const file of galleryFiles) {
        if (file.size > 0) {
          const upload = await uploadNewsEventGalleryImage(file);
          galleryImages.push(upload);
        }
      }
      updateData.gallery = galleryImages;
    }

    const updatedNewsEvent = await NewsEvent.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'News/Event updated successfully',
      data: updatedNewsEvent
    });
  } catch (error: any) {
    console.error('❌ Update news/event error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update news/event' },
      { status: 500 }
    );
  }
}

/* ===================== DELETE ===================== */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getUser, getPermission } = getKindeServerSession();
    const user = await getUser();
    const isAdmin = await getPermission('admin:access');

    if (!user || !isAdmin?.isGranted) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await params;

    const newsEvent = await NewsEvent.findById(id);
    if (!newsEvent) {
      return NextResponse.json(
        { error: 'News/Event not found' },
        { status: 404 }
      );
    }

    const publicIds = [newsEvent.image.publicId];
    if (newsEvent.gallery?.length) {
      publicIds.push(...newsEvent.gallery.map(img => img.publicId));
    }

    await deleteNewsEventImages(publicIds);
    await NewsEvent.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'News/Event deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ Delete news/event error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete news/event' },
      { status: 500 }
    );
  }
}