import { NextRequest, NextResponse } from 'next/server';
import  { connectDB } from '@/lib/config/database';
import Contact from '@/lib/models/Contact';

// POST /api/contact - Submit contact form (public)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      fullName,
      phoneNumber,
      emailAddress,
      serviceInterestedIn,
      projectDetails
    } = body;

    // Validation: Required fields
    if (!fullName || !phoneNumber || !emailAddress || !projectDetails) {
      return NextResponse.json(
        {
          success: false,
          message: 'Full name, phone number, email address, and project details are required'
        },
        { status: 400 }
      );
    }

    // Validation: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Validation: Phone number format
    const phoneRegex = /^[\+]?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid phone number' },
        { status: 400 }
      );
    }

    // Create new contact
    const newContact = new Contact({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      emailAddress: emailAddress.toLowerCase().trim(),
      serviceInterestedIn: serviceInterestedIn?.trim(),
      projectDetails: projectDetails.trim(),
      status: 'new'
    });

    const savedContact = await newContact.save();

    // Log for monitoring
    console.log(`New enquiry received from ${fullName} (${emailAddress})`);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your enquiry! We will get back to you soon.',
        data: {
          enquiryId: savedContact._id,
          submittedAt: savedContact.createdAt
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Contact submission error:', error);

    // Handle duplicate email (if unique constraint exists)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'An enquiry with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to submit enquiry. Please try again later.' },
      { status: 500 }
    );
  }
}