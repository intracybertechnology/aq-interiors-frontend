import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/database';
import Blog from '@/lib/models/Blog';
import { verifyAuthToken } from '@/lib/middleware/auth';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Upload to Cloudinary
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

// Delete from Cloudinary
const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    if (matches && matches[1]) {
      await cloudinary.uploader.destroy(matches[1]);
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

//
// ✅ GET BLOG BY ID / SLUG
//
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Featured blogs
    if (id === 'featured') {
      const { searchParams } = new URL(req.url);
      const limit = Math.min(Math.max(1, Number(searchParams.get('limit')) || 3), 10);

      const blogs = await Blog.find({ isPublished: true, featured: true })
        .select('-__v')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return NextResponse.json({ success: true, data: blogs });
    }

    // Categories
    if (id === 'categories') {
      const categories = await Blog.distinct('category', { isPublished: true });

      return NextResponse.json({
        success: true,
        data: ['All', ...categories.sort()],
      });
    }

    // Fetch by ID or slug
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

    return NextResponse.json({ success: true, data: blog });

  } catch (error) {
    console.error('GET blog error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

//
// ✅ UPDATE BLOG
//
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuthToken(req);
    if (!auth.success || !auth.admin) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }

    const formData = await req.formData();
    const updateData: any = {};

    const title = formData.get('title') as string;
    const image = formData.get('image') as File | null;

    // Image upload
    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const oldBlog = await Blog.findById(id);
      if (oldBlog?.image?.includes('cloudinary.com')) {
        await deleteFromCloudinary(oldBlog.image);
      }

      updateData.image = await uploadToCloudinary(buffer);
    }

    if (title) {
      updateData.title = title.trim();
      updateData.slug = title.toLowerCase().replace(/\s+/g, '-');
    }

    const updated = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-__v');

    if (!updated) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Update failed' },
      { status: 500 }
    );
  }
}

//
// ✅ DELETE BLOG
//
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuthToken(req);
    if (!auth.success || !auth.admin) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    if (blog.image?.includes('cloudinary.com')) {
      await deleteFromCloudinary(blog.image);
    }

    return NextResponse.json({
      success: true,
      data: { deletedId: id },
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Delete failed' },
      { status: 500 }
    );
  }
}