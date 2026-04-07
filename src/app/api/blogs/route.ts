import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/database';
import Blog from '@/lib/models/Blog';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'aq-interiors/blogs' },
      (error, result) => {
        if (error || !result) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(Math.max(1, Number(searchParams.get('limit')) || 10), 50);
    const skip = (page - 1) * limit;

    let filter: any = { isPublished: true };
    if (category && category !== 'All') filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-__v'),
      Blog.countDocuments(filter)
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        blogs,
        pagination: {
          page, limit, total, pages,
          hasNext: page < pages,
          hasPrev: page > 1,
        }
      }
    });

  } catch (error) {
    console.error('GET blogs error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const author = formData.get('author') as string;
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    const readTime = formData.get('readTime') as string;
    const featured = formData.get('featured') as string;
    const isPublished = formData.get('isPublished') as string;
    const image = formData.get('image') as File;

    if (!title || !excerpt || !content || !category || !image) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: title, excerpt, content, category, image' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const imageUrl = await uploadToCloudinary(buffer);

    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const newBlog = await Blog.create({
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      author: author?.trim() || 'AQ Design Team',
      category: category.trim(),
      image: imageUrl,
      slug,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      readTime: readTime || '5 min read',
      featured: featured === 'true',
      isPublished: isPublished !== 'false',
    });

    return NextResponse.json({
      success: true,
      message: 'Blog created successfully',
      data: newBlog,
    });

  } catch (error: any) {
    console.error('POST blog error:', error);

    // Handle duplicate slug
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'A blog with this title already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create blog' },
      { status: 500 }
    );
  }
}