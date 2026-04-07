import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/database';
import Blog from '@/lib/models/Blog';
import { verifyAuthToken } from '@/lib/middleware/auth';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Helper: Upload buffer to Cloudinary
const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'aq-interiors/blogs',
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'));
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(buffer);
  });
};

// Helper: Delete image from Cloudinary by URL
const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123/folder/filename.ext
    const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    if (matches && matches[1]) {
      await cloudinary.uploader.destroy(matches[1]);
    }
  } catch (error) {
    console.error('Failed to delete old image from Cloudinary:', error);
    // Don't throw - deletion failure shouldn't block the update
  }
};

// GET /api/blogs/[id] - Get single blog by ID or slug (public)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Handle special routes
    if (id === 'featured') {
      const { searchParams } = new URL(req.url);
      const limit = Math.min(Math.max(1, Number(searchParams.get('limit')) || 3), 10);

      const featuredBlogs = await Blog.find({
        isPublished: true,
        featured: true
      })
        .select('-__v')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return NextResponse.json({
        success: true,
        message: 'Featured blogs retrieved successfully',
        data: featuredBlogs
      });
    }

    if (id === 'categories') {
      const categories = await Blog.distinct('category', { isPublished: true });

      return NextResponse.json({
        success: true,
        message: 'Blog categories retrieved successfully',
        data: {
          categories: ['All', ...categories.sort()]
        }
      });
    }

    // Regular blog fetch by ID or slug
    let blog;

    if (isValidObjectId(id)) {
      blog = await Blog.findOne({ _id: id, isPublished: true }).select('-__v');
    } else {
      blog = await Blog.findOne({ slug: id, isPublished: true }).select('-__v');
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog retrieved successfully',
      data: blog
    });
  } catch (error) {
    console.error('Get blog by ID error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve blog' },
      { status: 500 }
    );
  }
}

// PUT /api/blogs/[id] - Update blog (protected)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuthToken(req);
    if (!authResult.success || !authResult.admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid blog ID' },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const updateData: any = {};

    const title = formData.get('title') as string | null;
    const excerpt = formData.get('excerpt') as string | null;
    const content = formData.get('content') as string | null;
    const author = formData.get('author') as string | null;
    const category = formData.get('category') as string | null;
    const tags = formData.get('tags') as string | null;
    const readTime = formData.get('readTime') as string | null;
    const featured = formData.get('featured') as string | null;
    const isPublished = formData.get('isPublished') as string | null;
    const image = formData.get('image') as File | null;

    // ✅ FIXED: Upload to Cloudinary instead of local filesystem
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Delete old image from Cloudinary if it's a Cloudinary URL
      const oldBlog = await Blog.findById(id);
      if (oldBlog?.image && oldBlog.image.includes('cloudinary.com')) {
        await deleteFromCloudinary(oldBlog.image);
      }

      // Upload new image to Cloudinary
      updateData.image = await uploadToCloudinary(buffer);
    }

    if (title) {
      updateData.title = title.trim();
      updateData.slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    if (excerpt) updateData.excerpt = excerpt.trim();
    if (content) updateData.content = content.trim();
    if (author) updateData.author = author.trim();
    if (category) updateData.category = category.trim();
    if (readTime) updateData.readTime = readTime;
    if (featured !== null) updateData.featured = featured === 'true';
    if (isPublished !== null) updateData.isPublished = isPublished === 'true';

    if (tags) {
      try {
        updateData.tags = JSON.parse(tags);
      } catch {
        updateData.tags = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedBlog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog
    });

  } catch (error: any) {
    console.error('Update blog error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[id] - Delete blog (protected)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAuthToken(req);
    if (!authResult.success || !authResult.admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid blog ID' },
        { status: 400 }
      );
    }

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }

    // ✅ FIXED: Delete from Cloudinary instead of local filesystem
    if (blog.image && blog.image.includes('cloudinary.com')) {
      await deleteFromCloudinary(blog.image);
    }

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
      data: {
        deletedId: id,
        title: blog.title
      }
    });

  } catch (error) {
    console.error('Delete blog error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}