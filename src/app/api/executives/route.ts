import { connectDB } from '@/src/lib/mongodb/connection';
import { Executive } from '@/src/lib/mongodb/models/Executive';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');      
    const session = searchParams.get('session'); 
    if (id) {
      const executive = await Executive.findOne({
        _id: id,
        isActive: true,
      }).lean();

      if (!executive) {
        return NextResponse.json(
          { success: false, message: 'Executive not found' },
          { status: 404 }
        );
      }

      const formattedExecutive = {
        ...executive,
        _id: executive._id.toString(),
      };

      return NextResponse.json(formattedExecutive);
    }
    const executives = await Executive.find({
      isActive: true,
    })
      .sort({ order: 1 })
      .lean();

    const formattedExecutives = executives.map((exec) => ({
      ...exec,
      _id: exec._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedExecutives,
    });
  } catch (error) {
    console.error('GET /api/executives error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch executives' },
      { status: 500 }
    );
  }
}