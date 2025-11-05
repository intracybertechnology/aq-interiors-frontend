import fs from 'fs';
import path from 'path';

const ALLOWED_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; 

export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (error) {
    throw new Error('Failed to delete file');
  }
};

export const validateImageFile = (file: any): boolean => {
  if (!ALLOWED_MIMES.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only JPEG, PNG and WebP are allowed');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size too large. Maximum 10MB allowed');
  }

  return true;
};

export const generateUniqueFilename = (originalName: string): string => {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext).replace(/[^a-zA-Z0-9]/g, '-');
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  return `${name}-${uniqueSuffix}${ext}`;
};

export const getFileUrl = (filePath: string): string => {
  return filePath.replace(/\\/g, '/').replace('uploads/', '/uploads/');
};