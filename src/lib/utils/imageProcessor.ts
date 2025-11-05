import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const DEFAULT_WIDTH = 1200;
const DEFAULT_QUALITY = 80;
const THUMBNAIL_SIZE = 300;
const THUMBNAIL_QUALITY = 70;

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}



export const processImage = async (
  inputPath: string,
  options: ImageOptions = {}
): Promise<string> => {
  try {
    const {
      width = DEFAULT_WIDTH,
      height,
      quality = DEFAULT_QUALITY,
      format = 'jpeg'
    } = options;

    const ext = path.extname(inputPath);
    const outputPath = inputPath.replace(ext, `.${format}`);

    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFormat(format as any)
      [format]({ quality })
      .toFile(outputPath);

    if (outputPath !== inputPath && fs.existsSync(inputPath)) {
      await fs.promises.unlink(inputPath);
    }

    return outputPath;
  } catch (error) {
    throw new Error('Failed to process image');
  }
};

export const createThumbnail = async (
  inputPath: string,
  size: number = THUMBNAIL_SIZE
): Promise<string> => {
  try {
    const ext = path.extname(inputPath);
    const thumbnailPath = inputPath.replace(ext, `_thumb${ext}`);

    await sharp(inputPath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: THUMBNAIL_QUALITY })
      .toFile(thumbnailPath);

    return thumbnailPath;
  } catch (error) {
    throw new Error('Failed to create thumbnail');
  }
};

export const getUrlPath = (filePath: string): string => {
  const normalized = filePath.replace(/\\/g, '/');
  const uploadIndex = normalized.indexOf('uploads/');

  if (uploadIndex !== -1) {
    return '/' + normalized.substring(uploadIndex);
  }

  const filename = path.basename(filePath);
  return `/uploads/blogs/${filename}`;
};