import { NextRequest, NextResponse } from 'next/server';
import { sendSuccessResponse, sendErrorResponse } from '@/lib/utils/responseHelper';
import { verifyAuthToken } from '@/lib/middleware/auth';
import cloudinary from '@/lib/config/cloudinary';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

// POST /api/upload - Upload single or multiple images (admin only)
export async function POST(request: NextRequest) {
  try {
    // Authenticate admin
    const authResult = await verifyAuthToken(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const searchParams = request.nextUrl.searchParams;
    const multiple = searchParams.get('multiple');

    const formData = await request.formData();

    // Handle multiple images: POST /api/upload?multiple=true
    if (multiple === 'true') {
      const files = formData.getAll('images') as File[];

      if (!files || files.length === 0) {
        return sendErrorResponse('No image files provided', 400);
      }

      if (files.length > 10) {
        return sendErrorResponse('Maximum 10 images allowed', 400);
      }

      const uploadedFiles = [];

      for (const file of files) {
        if (!file || file.size === 0) continue;

        // Save file temporarily
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const tempPath = path.join('/tmp', `upload-${Date.now()}-${file.name}`);
        await writeFile(tempPath, buffer);

        try {
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(tempPath, {
            folder: 'aq-interiors',
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto', fetch_format: 'auto' }
            ]
          });

          // Delete temp file
          await unlink(tempPath);

          uploadedFiles.push({
            filename: result.public_id,
            originalName: file.name,
            url: result.secure_url,
            size: file.size
          });
        } catch (uploadError) {
          // Clean up temp file on error
          try {
            await unlink(tempPath);
          } catch {}
          throw uploadError;
        }
      }

      return sendSuccessResponse('Images uploaded successfully', {
        files: uploadedFiles,
        count: uploadedFiles.length
      }, 201);
    }

    // Handle single image: POST /api/upload
    const file = formData.get('image') as File;

    if (!file || file.size === 0) {
      return sendErrorResponse('No image file provided', 400);
    }

    // Save file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = path.join('/tmp', `upload-${Date.now()}-${file.name}`);
    await writeFile(tempPath, buffer);

    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(tempPath, {
        folder: 'aq-interiors',
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });

      // Delete temp file
      await unlink(tempPath);

      return sendSuccessResponse('Image uploaded successfully', {
        filename: result.public_id,
        originalName: file.name,
        url: result.secure_url,
        size: file.size
      }, 201);
    } catch (uploadError) {
      // Clean up temp file on error
      try {
        await unlink(tempPath);
      } catch {}
      throw uploadError;
    }
  } catch (error) {
    console.error('Upload error:', error);
    return sendErrorResponse('Failed to upload image(s)', 500);
  }
}