import { NextRequest, NextResponse } from 'next/server';
import HeroImage from '@/lib/models/HeroImage';
import { sendSuccessResponse, sendErrorResponse } from '@/lib/utils/responseHelper';
import { verifyAuthToken } from '@/lib/middleware/auth';
import { connectDB } from '@/lib/config/database';

// GET /api/hero-image - Get hero images (public or admin)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const admin = searchParams.get('admin');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    // Admin route: GET /api/hero-image?admin=true
    if (admin === 'true') {
      // Authenticate admin
      const authResult = await verifyAuthToken(request);
      if (authResult instanceof NextResponse) {
        return authResult;
      }

      const pageNum = Math.max(1, Number(page) || 1);
      const limitNum = Math.min(Math.max(1, Number(limit) || 10), 100);
      const skip = (pageNum - 1) * limitNum;

      const [images, total] = await Promise.all([
        HeroImage.find({})
          .select('-__v')
          .sort({ order: 1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        HeroImage.countDocuments({})
      ]);

      return sendSuccessResponse('Hero images retrieved successfully', {
        images,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          totalImages: total,
          limit: limitNum
        }
      });
    }

    // Public route: GET /api/hero-image
    const heroImages = await HeroImage.find({ isActive: true })
      .select('-__v')
      .sort({ order: 1 })
      .lean();

    return sendSuccessResponse('Hero images retrieved successfully', heroImages);
  } catch (error) {
    console.error('Get hero images error:', error);
    return sendErrorResponse('Failed to retrieve hero images', 500);
  }
}

// POST /api/hero-image - Create hero image (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const reorder = searchParams.get('reorder');

    // Authenticate admin
    const authResult = await verifyAuthToken(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const body = await request.json();

    // Handle reorder: POST /api/hero-image?reorder=true
    if (reorder === 'true') {
      const { images } = body;

      if (!Array.isArray(images) || images.length === 0) {
        return sendErrorResponse('Images array is required', 400);
      }

      const updatePromises = images.map(({ id, order }: any) =>
        HeroImage.findByIdAndUpdate(id, { order }, { new: true })
      );

      await Promise.all(updatePromises);

      const reorderedImages = await HeroImage.find({})
        .select('-__v')
        .sort({ order: 1 });

      return sendSuccessResponse('Hero images reordered successfully', reorderedImages);
    }

    // Regular create: POST /api/hero-image
    const { title, imageUrl, order, isActive } = body;

    if (!title || !imageUrl) {
      return sendErrorResponse('Title and image URL are required', 400);
    }

    let finalOrder = order || 1;
    if (!order) {
      const lastImage = await HeroImage.findOne({}).sort({ order: -1 }).select('order');
      finalOrder = (lastImage?.order || 0) + 1;
    }

    const newHeroImage = new HeroImage({
      title: title.trim(),
      imageUrl: imageUrl.trim(),
      order: finalOrder,
      isActive: isActive !== undefined ? isActive : true
    });

    const savedImage = await newHeroImage.save();
    return sendSuccessResponse('Hero image created successfully', savedImage, 201);
  } catch (error: any) {
    console.error('Create hero image error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return sendErrorResponse(messages.join(', '), 400);
    }

    return sendErrorResponse('Failed to create hero image', 500);
  }
}

// PUT /api/hero-image?id=xxx - Update hero image (admin only)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    // Authenticate admin
    const authResult = await verifyAuthToken(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return sendErrorResponse('Image ID is required', 400);
    }

    const body = await request.json();
    const { title, imageUrl, order, isActive } = body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl.trim();
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedImage = await HeroImage.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedImage) {
      return sendErrorResponse('Hero image not found', 404);
    }

    return sendSuccessResponse('Hero image updated successfully', updatedImage);
  } catch (error: any) {
    console.error('Update hero image error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return sendErrorResponse(messages.join(', '), 400);
    }

    return sendErrorResponse('Failed to update hero image', 500);
  }
}

// DELETE /api/hero-image?id=xxx - Delete hero image (admin only)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    // Authenticate admin
    const authResult = await verifyAuthToken(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return sendErrorResponse('Image ID is required', 400);
    }

    const image = await HeroImage.findByIdAndDelete(id);

    if (!image) {
      return sendErrorResponse('Hero image not found', 404);
    }

    return sendSuccessResponse('Hero image deleted successfully', {
      deletedId: id,
      title: image.title
    });
  } catch (error) {
    console.error('Delete hero image error:', error);
    return sendErrorResponse('Failed to delete hero image', 500);
  }
}