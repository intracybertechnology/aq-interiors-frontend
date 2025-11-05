// Contact form data

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
  service: string;
}

// Contact form validation errors
export interface ContactFormErrors {
  fullName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  projectDetails?: string;
}

// Contact submission response
export interface ContactSubmissionResponse {
  enquiryId: string;
  submittedAt: string;
}