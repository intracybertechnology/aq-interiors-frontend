import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/database';
import Project from '@/lib/models/Project';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const categories = await Project.distinct('category', { isActive: true });

    return NextResponse.json({
      success: true,
      message: 'Project categories retrieved successfully',
      data: {
        categories: ['All', ...categories.sort()]
      }
    });
  } catch (error) {
    console.error('Get project categories error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve categories' },
      { status: 500 }
    );
  }
}