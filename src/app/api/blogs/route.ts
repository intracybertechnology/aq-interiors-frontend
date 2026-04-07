import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/database';
import Blog from '@/lib/models/Blog';

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
    console.error('Get blogs error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}