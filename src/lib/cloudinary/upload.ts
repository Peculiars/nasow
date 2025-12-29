import cloudinary from './config';
import sharp from 'sharp';

interface UploadResult {
  url: string;
  publicId: string;
  fileType: string;
  fileSize: number;
}


export async function uploadCourseImage(
  file: File
): Promise<UploadResult> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 675, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nasows/courses/covers',
          resource_type: 'image',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(optimizedBuffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      fileType: result.format,
      fileSize: result.bytes
    };
  } catch (error) {
    console.error('❌ Image upload error:', error);
    throw new Error('Failed to upload course image');
  }
}

export async function uploadCourseMaterial(
  file: File
): Promise<UploadResult> {
  try {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only PDF and DOC/DOCX files are allowed');
    }

    const maxSize = 10 * 1024 * 1024; 
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nasows/courses/materials',
          resource_type: 'raw', 
          format: file.name.split('.').pop()
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      fileType: result.format,
      fileSize: result.bytes
    };
  } catch (error) {
    console.error('❌ Material upload error:', error);
    throw error;
  }
}


export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'raw' = 'image'
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log('✅ File deleted from Cloudinary:', publicId);
  } catch (error) {
    console.error('❌ Delete error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
}


export async function deleteMultipleFromCloudinary(
  publicIds: string[],
  resourceType: 'image' | 'raw' = 'image'
): Promise<void> {
  try {
    await Promise.all(
      publicIds.map(id => deleteFromCloudinary(id, resourceType))
    );
  } catch (error) {
    console.error('❌ Bulk delete error:', error);
    throw new Error('Failed to delete files from Cloudinary');
  }
}