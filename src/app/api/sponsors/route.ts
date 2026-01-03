import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { connectDB } from '@/src/lib/mongodb/connection';
import Sponsor from '@/src/lib/mongodb/models/Sponsor';
import { deleteSponsorLogo, uploadSponsorLogo } from '@/src/lib/uploadSponsorLogo';

async function checkAdminAuth() {
  const { getUser, getPermission } = getKindeServerSession();
  const user = await getUser();
  const isAdmin = await getPermission('admin:access');

  if (!user || !isAdmin?.isGranted) {
    throw new Error('Unauthorized');
  }

  return user;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('active');
    const tier = searchParams.get('tier');

    const query: any = {};
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    if (tier) {
      query.tier = tier;
    }

    const sponsors = await Sponsor.find(query)
      .sort({ tier: 1, displayOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: sponsors
    });
  } catch (error: any) {
    console.error('❌ GET sponsors error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch sponsors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await checkAdminAuth();
    await connectDB();

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const website = formData.get('website') as string;
    const tier = formData.get('tier') as string;
    const displayOrder = formData.get('displayOrder') as string;
    const logoFile = formData.get('logo') as File;

    if (!name || !description || !website || !tier || !logoFile) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    const logoUpload = await uploadSponsorLogo(logoFile);

    const sponsor = await Sponsor.create({
      name,
      description,
      website,
      tier,
      displayOrder: displayOrder ? parseInt(displayOrder) : 0,
      logo: {
        url: logoUpload.url,
        publicId: logoUpload.publicId
      }
    });

    return NextResponse.json({
      success: true,
      data: sponsor
    }, { status: 201 });
  } catch (error: any) {
    console.error('❌ POST sponsor error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create sponsor' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await checkAdminAuth();
    await connectDB();

    const formData = await request.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const website = formData.get('website') as string;
    const tier = formData.get('tier') as string;
    const displayOrder = formData.get('displayOrder') as string;
    const isActive = formData.get('isActive') as string;
    const logoFile = formData.get('logo') as File | null;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Sponsor ID is required' },
        { status: 400 }
      );
    }

    const sponsor = await Sponsor.findById(id);
    if (!sponsor) {
      return NextResponse.json(
        { success: false, error: 'Sponsor not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (website) updateData.website = website;
    if (tier) updateData.tier = tier;
    if (displayOrder) updateData.displayOrder = parseInt(displayOrder);
    if (isActive !== null) updateData.isActive = isActive === 'true';

    if (logoFile && logoFile.size > 0) {
      await deleteSponsorLogo(sponsor.logo.publicId);
      const logoUpload = await uploadSponsorLogo(logoFile);
      updateData.logo = {
        url: logoUpload.url,
        publicId: logoUpload.publicId
      };
    }

    const updatedSponsor = await Sponsor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedSponsor
    });
  } catch (error: any) {
    console.error('❌ PUT sponsor error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update sponsor' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await checkAdminAuth();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Sponsor ID is required' },
        { status: 400 }
      );
    }

    const sponsor = await Sponsor.findById(id);
    if (!sponsor) {
      return NextResponse.json(
        { success: false, error: 'Sponsor not found' },
        { status: 404 }
      );
    }

    await deleteSponsorLogo(sponsor.logo.publicId);
    await Sponsor.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Sponsor deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ DELETE sponsor error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete sponsor' },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}