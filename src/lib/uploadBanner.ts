import sharp from 'sharp';
import cloudinary from './cloudinary/config';

interface UploadResult {
  url: string;
  publicId: string;
}

export async function uploadBannerImage(file: File): Promise<UploadResult> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 400, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90, progressive: true })
      .toBuffer();

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nasows/banners',
          resource_type: 'image',
          type: 'upload', 
          access_mode: 'public',
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
      publicId: result.public_id
    };
  } catch (error) {
    console.error('❌ Banner upload error:', error);
    throw new Error('Failed to upload banner image');
  }
}