import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/database';
import Admin from '@/lib/models/Admin';
import { generateTokenPair } from '@/lib/config/jwt';

// POST /api/admin/login
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { success: false, message: 'Account is deactivated' },
        { status: 401 }
      );
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    await admin.updateLastLogin();

    const adminId = String(admin._id);

    const tokens = generateTokenPair({
       id: adminId,
      email: admin.email,
      role: 'admin'
    });

    const adminInfo = {
      id: adminId,
      name: admin.name,
      email: admin.email,
      role: 'admin',
      lastLogin: admin.lastLogin?.toISOString()
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          admin: adminInfo,
          tokens
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}