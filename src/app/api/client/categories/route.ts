import { NextRequest } from 'next/server';
import Client from '@/lib/models/Client';
import { connectDB } from '@/lib/config/database';
import { sendSuccessResponse, sendErrorResponse } from '@/lib/utils/responseHelper';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const categories = await Client.distinct('category', { isActive: true });

    return sendSuccessResponse(
      'Client categories retrieved successfully',
      { categories: ['All', ...categories.sort()] }
    );
  } catch (error) {
    console.error('Get client categories error:', error);
    return sendErrorResponse('Failed to retrieve categories', 500);
  }
}