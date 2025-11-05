import { NextRequest, NextResponse } from 'next/server';
import Client from '@/lib/models/Client';
import { connectDB } from '@/lib/config/database'; 
import { sendSuccessResponse, sendErrorResponse } from '@/lib/utils/responseHelper';

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const page = Number(searchParams.get('page') || 1);
  const limit = Number(searchParams.get('limit') || 50);

  try {

    // Normal client listing
    const filter: any = { isActive: true };
    if (category && category !== 'All') filter.category = category;

    const skip = (page - 1) * limit;

    const [clients, total] = await Promise.all([
      Client.find(filter)
        .sort({ order: 1, name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Client.countDocuments(filter),
    ]);

    return sendSuccessResponse(
      'Clients retrieved successfully',
      {
        clients,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalClients: total,
          limit,
        },
      }
    );
  } catch (error) {
    console.error('Get clients error:', error);
    return sendErrorResponse('Failed to retrieve clients', 500);
  }
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { id, name, logo, location, category, order } = body;

    const existingClient = await Client.findOne({ id });
    if (existingClient) {
      return sendErrorResponse(
        'Client with this ID already exists',
        409
      );
    }

    const newClient = new Client({
      id,
      name,
      logo,
      location,
      category,
      order,
    });

    const savedClient = await newClient.save();
    return sendSuccessResponse(
      'Client created successfully',
      savedClient,
      201
    );
  } catch (error) {
    console.error('Create client error:', error);
    return sendErrorResponse('Failed to create client', 500);
  }
}