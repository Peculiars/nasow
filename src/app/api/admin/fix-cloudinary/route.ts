// app/api/admin/fix-cloudinary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { connectDB } from '@/src/lib/mongodb/connection';
import Course from '@/src/lib/mongodb/models/Course';
import cloudinary from '@/src/lib/cloudinary/config';

export async function POST(request: NextRequest) {
  try {
    // Only allow admin access
    const { getPermission } = getKindeServerSession();
    const adminAccess = await getPermission('admin:access');

    if (!adminAccess?.isGranted) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    console.log('🔧 Starting Cloudinary access fix...');
    
    await connectDB();
    
    // Get all courses
    const courses = await Course.find({});
    console.log(`📚 Found ${courses.length} courses`);
    
    let fixedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    
    for (const course of courses) {
      console.log(`\n📖 Processing: ${course.title}`);
      
      for (const week of course.weeks) {
        for (const material of week.materials) {
          try {
            console.log(`  📄 Fixing: ${material.name}`);
            
            // Update the resource to make it public
            await cloudinary.uploader.explicit(material.publicId, {
              resource_type: 'raw',
              type: 'upload',
              access_mode: 'public'
            });
            
            fixedCount++;
            console.log(`  ✅ Fixed: ${material.name}`);
          } catch (error: any) {
            errorCount++;
            const errorMsg = `Error fixing ${material.name}: ${error.message}`;
            errors.push(errorMsg);
            console.error(`  ❌ ${errorMsg}`);
          }
        }
      }
    }
    
    console.log('\n✨ Done!');
    console.log(`✅ Fixed: ${fixedCount} files`);
    console.log(`❌ Errors: ${errorCount} files`);
    
    return NextResponse.json({
      success: true,
      message: 'Cloudinary access fix completed',
      data: {
        totalCourses: courses.length,
        fixedCount,
        errorCount,
        errors: errors.slice(0, 10) // Only return first 10 errors
      }
    });
    
  } catch (error: any) {
    console.error('❌ Fix Cloudinary error:', error);
    return NextResponse.json(
      { error: 'Failed to fix Cloudinary access', details: error.message },
      { status: 500 }
    );
  }
}