import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/database';
import Contact from '@/lib/models/Contact';
import { verifyAuthToken } from '@/lib/middleware/auth';

// GET /api/admin/enquiries
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const filter: any = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { emailAddress: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { serviceInterestedIn: { $regex: search, $options: 'i' } },
        { projectDetails: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const sortConfig: any = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [enquiries, totalEnquiries] = await Promise.all([
      Contact.find(filter)
        .sort(sortConfig)
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalEnquiries / limit);

    return NextResponse.json(
      {
        success: true,
        message: 'Enquiries retrieved successfully',
        data: {
          enquiries,
          pagination: {
            page,
            limit,
            total: totalEnquiries,
            pages: totalPages
          }
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get enquiries error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve enquiries' },
      { status: 500 }
    );
  }
}