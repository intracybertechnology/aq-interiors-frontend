// Contact form data
export interface ContactFormData {
  fullName: string;
  emailAddress: string;
  phoneNumber?: string;
  serviceInterestedIn?: string;
  projectDetails?: string;
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