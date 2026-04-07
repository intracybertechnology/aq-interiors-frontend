import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/database';
import Blog from '@/lib/models/Blog';
import { v2 as cloudinary } from 'cloudinary';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Upload helper
const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'aq-interiors/blogs',
      },
      (error, result) => {
        if (error || !result) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(buffer);
  });
};

//
// ✅ GET ALL BLOGS
//
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let filter: any = { isPublished: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v');

    return NextResponse.json({
      success: true,
      data: blogs,
    });

  } catch (error) {
    console.error('GET blogs error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

//
// ✅ CREATE BLOG (POST)
//
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

    // validation
    if (!title || !excerpt || !content || !category || !image) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // upload image
    const buffer = Buffer.from(await image.arrayBuffer());
    const imageUrl = await uploadToCloudinary(buffer);

    // generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // create blog
    const newBlog = await Blog.create({
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      author: author || 'AQ Design Team',
      category: category.trim(),
      image: imageUrl,
      slug,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
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

    return NextResponse.json(
      { success: false, message: 'Failed to create blog' },
      { status: 500 }
    );
  }
}