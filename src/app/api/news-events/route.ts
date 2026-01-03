import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { connectDB } from '@/src/lib/mongodb/connection';
import { uploadNewsEventGalleryImage, uploadNewsEventImage } from '@/src/lib/uploadNewsEventImage';
import NewsEvent from '@/src/lib/mongodb/models/NewsEvent';

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const endDate = formData.get('endDate') as string;
    const location = formData.get('location') as string;
    const maxAttendees = formData.get('maxAttendees') as string;
    const registrationLink = formData.get('registrationLink') as string;
    const registrationDeadline = formData.get('registrationDeadline') as string;
    const featured = formData.get('featured') === 'true';
    const published = formData.get('published') === 'true';
    const tags = formData.get('tags') as string;
    const organizerName = formData.get('organizerName') as string;
    const organizerContact = formData.get('organizerContact') as string;
    const featuredImage = formData.get('featuredImage') as File;

    if (!title || !category || !type || !description || !content || !date || !featuredImage || !organizerName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const imageUpload = await uploadNewsEventImage(featuredImage);

    const galleryImages = [];
    const galleryFiles = formData.getAll('gallery') as File[];
    
    for (const file of galleryFiles) {
      if (file.size > 0) {
        const galleryUpload = await uploadNewsEventGalleryImage(file);
        galleryImages.push(galleryUpload);
      }
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    let uniqueSlug = slug;
    let counter = 1;
    while (await NewsEvent.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const newsEvent = await NewsEvent.create({
      title,
      slug: uniqueSlug,
      category,
      type,
      description,
      content,
      date: new Date(date),
      time: time || undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      location: location || undefined,
      image: {
        url: imageUpload.url,
        publicId: imageUpload.publicId
      },
      gallery: galleryImages.length > 0 ? galleryImages : undefined,
      maxAttendees: maxAttendees ? parseInt(maxAttendees) : undefined,
      registrationLink: registrationLink || undefined,
      registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
      featured,
      published,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      organizer: {
        name: organizerName,
        contact: organizerContact || undefined
      },
      createdBy: user.id
    });

    return NextResponse.json(
      {
        success: true,
        message: `${type === 'event' ? 'Event' : 'News'} created successfully`,
        data: newsEvent
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Create news/event error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create news/event' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const filter: any = {};
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    if (published) filter.published = published === 'true';

    const [newsEvents, total] = await Promise.all([
      NewsEvent.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      NewsEvent.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      data: newsEvents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('❌ Get news/events error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch news/events' },
      { status: 500 }
    );
  }
}