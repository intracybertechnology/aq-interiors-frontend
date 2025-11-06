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
  await connectDB();
  
  try {
    const { id: clientId } = await params;
    
    const deletedClient = await Client.findOneAndDelete({ id: clientId });
    
    if (!deletedClient) {
      return sendErrorResponse('Client not found', 404);
    }
    
    return sendSuccessResponse('Client deleted successfully', deletedClient);
  } catch (error) {
    console.error('Delete client error:', error);
    return sendErrorResponse('Failed to delete client', 500);
  }
}