import sharp from 'sharp';
import cloudinary from './cloudinary/config';

interface UploadResult {
  url: string;
  publicId: string;
}

export async function uploadNewsEventImage(file: File): Promise<UploadResult> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 800, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 90, progressive: true })
      .toBuffer();

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nasows/news-events/featured',
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
      publicId: result.public_id
    };
  } catch (error) {
    console.error('❌ Featured image upload error:', error);
    throw new Error('Failed to upload featured image');
  }
}

export async function uploadNewsEventGalleryImage(file: File): Promise<UploadResult> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const optimizedBuffer = await sharp(buffer)
      .resize(1000, 750, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nasows/news-events/gallery',
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
      publicId: result.public_id
    };
  } catch (error) {
    console.error('❌ Gallery image upload error:', error);
    throw new Error('Failed to upload gallery image');
  }
}

export async function deleteNewsEventImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    console.log('✅ Image deleted from Cloudinary:', publicId);
  } catch (error) {
    console.error('❌ Delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

export async function deleteNewsEventImages(publicIds: string[]): Promise<void> {
  try {
    await Promise.all(publicIds.map(id => deleteNewsEventImage(id)));
  } catch (error) {
    console.error('❌ Bulk delete error:', error);
    throw new Error('Failed to delete images from Cloudinary');
  }
}