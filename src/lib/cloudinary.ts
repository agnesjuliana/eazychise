import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  success: boolean;
  url?: string;
  public_id?: string;
  error?: string;
  secure_url?: string;
  original_filename?: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
}

/**
 * Upload file to Cloudinary
 * @param buffer - File buffer
 * @param filename - Original filename
 * @param folder - Cloudinary folder (optional)
 * @returns Upload result with URL and metadata
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  folder?: string
): Promise<CloudinaryUploadResult> {
  try {
    // Create unique public_id based on filename and timestamp
    const timestamp = Date.now();
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
    const publicId = `${nameWithoutExt}_${timestamp}`;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          folder: folder || 'eazychise/uploads',
          resource_type: 'auto', // Automatically detect file type
          quality: 'auto', // Auto optimize quality
          fetch_format: 'auto', // Auto optimize format
          secure: true, // Force HTTPS URLs
          overwrite: false, // Don't overwrite existing files
          unique_filename: true, // Ensure unique filenames
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    const uploadResult = result as {
      secure_url: string;
      public_id: string;
      original_filename?: string;
      format?: string;
      bytes?: number;
      width?: number;
      height?: number;
    };

    return {
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
      original_filename: uploadResult.original_filename,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Delete file from Cloudinary
 * @param publicId - Cloudinary public ID
 * @returns Deletion result
 */
export async function deleteFromCloudinary(
  publicId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      return { success: true };
    } else {
      return {
        success: false,
        error: `Deletion failed: ${result.result}`,
      };
    }
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Deletion failed',
    };
  }
}

/**
 * Generate optimized Cloudinary URL
 * @param publicId - Cloudinary public ID
 * @param transformations - Optional transformations
 * @returns Optimized URL
 */
export function getOptimizedUrl(
  publicId: string,
  transformations?: Record<string, string | number | boolean>
): string {
  return cloudinary.url(publicId, {
    secure: true,
    quality: 'auto',
    fetch_format: 'auto',
    ...transformations,
  });
}

/**
 * Get file type category based on mime type
 * @param mimeType - File MIME type
 * @returns Category for Cloudinary folder organization
 */
export function getFileTypeCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) {
    return 'images';
  } else if (mimeType.startsWith('video/')) {
    return 'videos';
  } else if (mimeType === 'application/pdf') {
    return 'documents';
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    return 'documents';
  } else {
    return 'files';
  }
}

// Generate optimized URL for images (keeping for backwards compatibility)
export function getOptimizedImageUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
}) {
  return cloudinary.url(publicId, {
    quality: options?.quality || 'auto',
    fetch_format: options?.format || 'auto',
    width: options?.width,
    height: options?.height,
    crop: 'fill',
  });
}

export default cloudinary;
