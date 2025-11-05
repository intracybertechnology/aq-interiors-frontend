import { NextRequest } from 'next/server';
import Client from '@/lib/models/Client';
import { connectDB } from '@/lib/config/database';
import { verifyAuthToken } from '@/lib/middleware/auth';
import {
  sendSuccessResponse,
  sendErrorResponse
} from '@/lib/utils/responseHelper';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: clientId } = await params;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: clientId } = await params;
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: clientId } = await params;
}