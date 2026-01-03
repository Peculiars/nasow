import sharp from 'sharp';
import cloudinary from './cloudinary/config';

interface SponsorLogoUploadResult {
  url: string;
  publicId: string;
  fileSize: number;
}

export async function uploadSponsorLogo(
  file: File
): Promise<SponsorLogoUploadResult> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const optimizedBuffer = await sharp(buffer)
      .resize(400, 200, {
        fit: 'inside',
        withoutEnlargement: true,
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png({ quality: 90, compressionLevel: 9 })
      .toBuffer();

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nasows/sponsors/logos',
          resource_type: 'image',
          format: 'png',
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
      fileSize: result.bytes
    };
  } catch (error) {
    console.error('❌ Sponsor logo upload error:', error);
    throw new Error('Failed to upload sponsor logo');
  }
}

export async function deleteSponsorLogo(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    console.log('✅ Sponsor logo deleted from Cloudinary:', publicId);
  } catch (error) {
    console.error('❌ Delete error:', error);
    throw new Error('Failed to delete sponsor logo');
  }
}