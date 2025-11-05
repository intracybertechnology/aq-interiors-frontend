import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Project from '@/lib/models/Project';
import { sendSuccessResponse, sendErrorResponse } from '@/lib/utils/responseHelper';
import { verifyAuthToken } from '@/lib/middleware/auth';

// Validation helper
const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

// GET /api/projects/[id] - Get project by ID (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    let project;

    if (isValidObjectId(id)) {
      project = await Project.findOne({ 
        $or: [{ id }, { _id: id }], 
        isActive: true 
      }).select('-__v');
    } else {
      project = await Project.findOne({ id, isActive: true }).select('-__v');
    }

    if (!project) {
      return sendErrorResponse('Project not found', 404);
    }

    return sendSuccessResponse('Project retrieved successfully', project);
  } catch (error) {
    console.error('Get project by ID error:', error);
    return sendErrorResponse('Failed to retrieve project', 500);
  }
}

// PUT /api/projects/[id] - Update project (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate admin
    const authResult = await verifyAuthToken(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response if auth fails
    }

    const { id } = params;
    const body = await request.json();
    const { _id, createdAt, updatedAt, __v, ...updateData } = body;

    // Trim string fields
    if (updateData.id) updateData.id = updateData.id.trim();
    if (updateData.title) updateData.title = updateData.title.trim();
    if (updateData.description) updateData.description = updateData.description.trim();
    if (updateData.location) updateData.location = updateData.location.trim();
    if (updateData.year) updateData.year = updateData.year.trim();

    const updatedProject = await Project.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!updatedProject) {
      return sendErrorResponse('Project not found', 404);
    }

    return sendSuccessResponse('Project updated successfully', updatedProject);
  } catch (error: any) {
    console.error('Update project error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return sendErrorResponse(messages.join(', '), 400);
    }
    
    return sendErrorResponse('Failed to update project', 500);
  }
}

// DELETE /api/projects/[id] - Delete project (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate admin
    const authResult = await verifyAuthToken(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response if auth fails
    }

    const { id } = await params;
    const project = await Project.findOneAndDelete({ id });
    
    if (!project) {
      return sendErrorResponse('Project not found', 404);
    }

    return sendSuccessResponse('Project deleted successfully', { 
      deletedId: id,
      title: project.title 
    });
  } catch (error) {
    console.error('Delete project error:', error);
    return sendErrorResponse('Failed to delete project', 500);
  }
}