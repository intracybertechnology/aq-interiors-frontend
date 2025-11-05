import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/database';
import Contact from '@/lib/models/Contact';
import { verifyAuthToken } from '@/lib/middleware/auth';

// GET /api/admin/dashboard/stats
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

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [
      totalEnquiries,
      newEnquiries,
      monthlyEnquiries,
      weeklyEnquiries
    ] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Contact.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Contact.countDocuments({ createdAt: { $gte: startOfWeek } })
    ]);

    const statusStats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const serviceStats = await Contact.aggregate([
      {
        $group: {
          _id: '$serviceInterestedIn',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const recentEnquiries = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fullName emailAddress serviceInterestedIn status createdAt')
      .lean();

    const stats = {
      overview: {
        totalEnquiries,
        newEnquiries,
        monthlyEnquiries,
        weeklyEnquiries
      },
      statusBreakdown: statusStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>),
      serviceInterest: serviceStats.map(item => ({
        service: item._id || 'Not specified',
        count: item.count
      })),
      recentEnquiries
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Dashboard stats retrieved successfully',
        data: stats
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve dashboard statistics' },
      { status: 500 }
    );
  }
}