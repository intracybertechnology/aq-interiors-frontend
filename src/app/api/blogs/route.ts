import { NextRequest, NextResponse } from 'next/server';
import  { connectDB } from '@/lib/config/database';
import Blog from '@/lib/models/Blog';
import { verifyAuthToken } from '@/lib/middleware/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// GET /api/blogs - Get blogs (public or admin)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const admin = searchParams.get('admin'); // ?admin=true for admin view
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const limit = Math.min(Math.max(1, Number(searchParams.get('limit')) || 10), 100);

    // If admin mode, verify authentication
   if (admin === 'true') {
  const authResult = await verifyAuthToken(req);
  if (!authResult.success || !authResult.admin) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }
}


    const filter: any = admin === 'true' ? {} : { isPublished: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex },
        { tags: searchRegex }
      ];
    }

    const skip = (page - 1) * limit;

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      message: 'Blogs retrieved successfully',
      data: {
        blogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve blogs' },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create new blog (protected)
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
   const authResult = await verifyAuthToken(req);
if (!authResult.success || !authResult.admin) {
  return NextResponse.json(
    { success: false, message: 'Unauthorized' },
    { status: 401 }
  );
}

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
    const image = formData.get('image') as File | null;

    // Validation
    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { success: false, message: 'Title, excerpt, and content are required' },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { success: false, message: 'Blog image is required' },
        { status: 400 }
      );
    }

    // Check for duplicate title
    const existingBlog = await Blog.findOne({
      title: { $regex: new RegExp(`^${title}$`, 'i') }
    });

    if (existingBlog) {
      return NextResponse.json(
        { success: false, message: 'A blog with this title already exists' },
        { status: 409 }
      );
    }

    // Handle file upload
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = image.name.replace(/\s+/g, '-');
    const filename = `${timestamp}-${originalName}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'blogs');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file
    const filepath = path.join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/blogs/${filename}`;

    // Parse tags
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      }
    }

    // Create blog
    const blogData = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      author: author?.trim() || 'AQ Design Team',
      category: category?.trim() || 'General',
      tags: parsedTags,
      image: imageUrl,
      readTime: readTime || '5 min read',
      featured: featured === 'true',
      isPublished: true
    };

    const newBlog = new Blog(blogData);
    const savedBlog = await newBlog.save();

    return NextResponse.json({
      success: true,
      message: 'Blog created successfully',
      data: savedBlog
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create blog error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to create blog' },
      { status: 500 }
    );
  }
}