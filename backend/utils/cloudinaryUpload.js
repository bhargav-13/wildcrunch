import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image buffer from multer
 * @param {String} folder - Cloudinary folder name (default: 'wildcrunch/products')
 * @returns {Promise} - Cloudinary upload result
 */
export const uploadToCloudinary = (buffer, folder = 'wildcrunch/products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const bufferStream = Readable.from(buffer);
    bufferStream.pipe(uploadStream);
  });
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise} - Cloudinary deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {String} url - Cloudinary image URL
 * @returns {String} - Public ID
 */
export const getPublicIdFromUrl = (url) => {
  if (!url) return null;

  // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/wildcrunch/products/image.jpg
  // Extract: wildcrunch/products/image
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');

  if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
    // Get everything after 'upload/v1234567890/'
    const pathParts = parts.slice(uploadIndex + 2);
    const fullPath = pathParts.join('/');
    // Remove file extension
    return fullPath.substring(0, fullPath.lastIndexOf('.'));
  }

  return null;
};
