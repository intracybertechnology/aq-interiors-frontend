import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/database';
import Blog from '@/lib/models/Blog';
import { verifyAuthToken } from '@/lib/middleware/auth';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Upload
const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'aq-interiors/blogs' },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    ).end(buffer);
  });
};

// Delete
const deleteFromCloudinary = async (url: string) => {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    if (match?.[1]) {
      await cloudinary.uploader.destroy(match[1]);
    }
  } catch (e) {
    console.log('Cloudinary delete error');
  }
};

//
// ✅ GET
//
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } } // ✅ FIXED
) {
  try {
    await connectDB();

    const { id } = params; // ✅ NO await

    if (id === 'featured') {
      const blogs = await Blog.find({ featured: true, isPublished: true })
        .sort({ createdAt: -1 })
        .limit(3);

      return NextResponse.json({ success: true, data: blogs });
    }

    if (id === 'categories') {
      const categories = await Blog.distinct('category', { isPublished: true });
      return NextResponse.json({ success: true, data: categories });
    }

    let blog;

    if (isValidObjectId(id)) {
      blog = await Blog.findById(id);
    } else {
      blog = await Blog.findOne({ slug: id });
    }

    if (!blog) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: blog });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

//
// ✅ PUT
//
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } } // ✅ FIXED
) {
  try {
    const auth = await verifyAuthToken(req);
    if (!auth.success || !auth.admin) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    await connectDB();

    const { id } = params;

    const formData = await req.formData();
    const updateData: any = {};

    const title = formData.get('title') as string;
    const image = formData.get('image') as File | null;

    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());

      const old = await Blog.findById(id);
      if (old?.image?.includes('cloudinary.com')) {
        await deleteFromCloudinary(old.image);
      }

      updateData.image = await uploadToCloudinary(buffer);
    }

    if (title) {
      updateData.title = title;
      updateData.slug = title.toLowerCase().replace(/\s+/g, '-');
    }

    const updated = await Blog.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json({ success: true, data: updated });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

//
// ✅ DELETE
//
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } } // ✅ FIXED
) {
  try {
    const auth = await verifyAuthToken(req);
    if (!auth.success || !auth.admin) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    await connectDB();

    const { id } = params;

    const blog = await Blog.findByIdAndDelete(id);

    if (blog?.image?.includes('cloudinary.com')) {
      await deleteFromCloudinary(blog.image);
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}