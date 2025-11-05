import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/database';
import Admin from '@/lib/models/Admin';
import { generateTokenPair, verifyRefreshToken } from '@/lib/config/jwt';

// POST /api/admin/refresh
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'Refresh token is required' },
        { status: 400 }
      );
    }

    const decoded = verifyRefreshToken(refreshToken);

    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { success: false, message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    const adminId = String(admin._id);

    const tokens = generateTokenPair({
      id: adminId,
      email: admin.email,
      role: 'admin'
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Token refreshed successfully',
        data: { tokens }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Refresh token error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Token refresh failed' },
      { status: 500 }
    );
  }
}