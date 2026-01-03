import sharp from 'sharp';
import cloudinary from './cloudinary/config';

interface UploadResult {
  url: string;
  publicId: string;
  fileType: string;
  fileSize: number;
}

export async function uploadLecturerImage(
  file: File
): Promise<UploadResult> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const optimizedBuffer = await sharp(buffer)
      .resize(800, 800, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90, progressive: true })
      .toBuffer();

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nasows/lecturers',
          resource_type: 'image',
          transformation: [
            { quality: 'auto:best' },
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
      fileType: result.format || 'image',
      fileSize: result.bytes
    };
  } catch (error) {
    console.error('❌ Lecturer image upload error:', error);
    throw new Error('Failed to upload lecturer image');
  }
}