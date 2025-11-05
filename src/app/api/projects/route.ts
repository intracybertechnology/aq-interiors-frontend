import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Project from '@/lib/models/Project';
import { sendSuccessResponse, sendErrorResponse } from '@/lib/utils/responseHelper';
import { verifyAuthToken } from '@/lib/middleware/auth';

// GET /api/projects - Get all projects (public) OR Get categories
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Check if requesting categories
    const getCategories = searchParams.get('categories');
    if (getCategories === 'true') {
      const categories = await Project.distinct('category', { isActive: true });
      const allCategories = ['All', ...categories.sort()];
      return sendSuccessResponse('Project categories retrieved successfully', allCategories);
    }

    // Regular project listing
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    const filter: any = { isActive: true };
    
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { location: searchRegex }
      ];
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(Math.max(1, Number(limit) || 10), 100);
    const skip = (pageNum - 1) * limitNum;

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Project.countDocuments(filter)
    ]);

    return sendSuccessResponse('Projects retrieved successfully', {
      projects,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalProjects: total,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return sendErrorResponse('Failed to retrieve projects', 500);
  }
}

// POST /api/projects - Create project (admin only)
export async function POST(request: NextRequest) {
  try {
    // Authenticate admin
    const authResult = await verifyAuthToken(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response if auth fails
    }

    const body = await request.json();
    const { id, title, category, description, images, location, year } = body;

    // Validation
    if (!id || !title || !category || !description || !images || images.length === 0) {
      return sendErrorResponse(
        'ID, title, category, description, and at least one image are required',
        400
      );
    }

    // Check if project already exists
    const existingProject = await Project.findOne({ id });
    if (existingProject) {
      return sendErrorResponse('Project with this ID already exists', 409);
    }

    // Create new project
    const newProject = new Project({
      id: id.trim(),
      title: title.trim(),
      category,
      description: description.trim(),
      images,
      location: location?.trim(),
      year: year?.trim()
    });

    const savedProject = await newProject.save();
    return sendSuccessResponse('Project created successfully', savedProject, 201);
  } catch (error: any) {
    console.error('Create project error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return sendErrorResponse(messages.join(', '), 400);
    }

    return sendErrorResponse('Failed to create project', 500);
  }
}