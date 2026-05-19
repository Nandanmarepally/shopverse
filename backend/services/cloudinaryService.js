import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = (buffer, folder = 'products') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `ecommerce/${folder}`, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

export const uploadMultiple = async (files, folder = 'products') => {
  const uploads = files.map((file) => uploadToCloudinary(file.buffer, folder));
  const results = await Promise.all(uploads);
  return results.map((r) => r.secure_url);
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};
