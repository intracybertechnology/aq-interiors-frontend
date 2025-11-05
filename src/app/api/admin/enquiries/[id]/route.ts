import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/database';
import Contact from '@/lib/models/Contact';
import mongoose from 'mongoose';
import { verifyAuthToken } from '@/lib/middleware/auth';

// GET /api/admin/enquiries/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuthToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid enquiry ID' },
        { status: 400 }
      );
    }

    const enquiry = await Contact.findById(id);

    if (!enquiry) {
      return NextResponse.json(
        { success: false, message: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Enquiry retrieved successfully',
        data: enquiry
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get enquiry by ID error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve enquiry' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/enquiries/[id] - Update enquiry status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuthToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    await connectDB();

    const { id } = params;
    const { status, adminNotes } = await request.json();

    const validStatuses = ['new', 'contacted', 'closed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }

    const updateData: any = { status };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    const updatedEnquiry = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEnquiry) {
      return NextResponse.json(
        { success: false, message: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Enquiry status updated successfully',
        data: updatedEnquiry
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update enquiry status error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update enquiry status' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/enquiries/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAuthToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.status }
      );
    }

    await connectDB();

    const { id } = params;

    const enquiry = await Contact.findById(id);
    if (!enquiry) {
      return NextResponse.json(
        { success: false, message: 'Enquiry not found' },
        { status: 404 }
      );
    }

    await Contact.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: 'Enquiry deleted successfully',
        data: { deletedId: id }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Delete enquiry error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete enquiry' },
      { status: 500 }
    );
  }
}