import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

const COMPANY_EMAIL = process.env.SMTP_USER || 'noreply@aqinteriors.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sales@aqdecor.com';

let transporter: nodemailer.Transporter;

const getTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    transporter = nodemailer.createTransport(SMTP_CONFIG);
  }
  return transporter;
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: `"AQ Interiors" <${COMPANY_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    await getTransporter().sendMail(mailOptions);
  } catch (error) {
    throw new Error('Failed to send email');
  }
};

export const sendContactNotification = async (contactData: any): Promise<void> => {
  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${contactData.fullName}</p>
    <p><strong>Email:</strong> ${contactData.emailAddress}</p>
    <p><strong>Phone:</strong> ${contactData.phoneNumber}</p>
    <p><strong>Service:</strong> ${contactData.serviceInterestedIn || 'Not specified'}</p>
    <p><strong>Details:</strong></p>
    <p>${contactData.projectDetails}</p>
    <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
  `;

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: 'New Contact Form Submission - AQ Interiors',
    html
  });
};

export const sendContactAutoReply = async (contactData: any): Promise<void> => {
  const html = `
    <h2>Thank you for contacting AQ Interiors!</h2>
    <p>Dear ${contactData.fullName},</p>
    <p>Thank you for reaching out. We have received your enquiry and will get back to you within 24 hours.</p>
    
    <h3>Your Enquiry Details:</h3>
    <p><strong>Service:</strong> ${contactData.serviceInterestedIn || 'General Enquiry'}</p>
    <p><strong>Details:</strong> ${contactData.projectDetails}</p>
    
    <p>Feel free to browse our portfolio and services on our website.</p>
    
    <p>Best regards,<br>
    The AQ Interiors Team</p>
  `;

  await sendEmail({
    to: contactData.emailAddress,
    subject: 'Thank you for your enquiry - AQ Interiors',
    html
  });
};