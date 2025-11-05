export interface SubmitContactRequest {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  serviceInterestedIn?: string;
  projectDetails: string;
}
export interface SubmitContactResponse {
  enquiryId: string;
  submittedAt: Date;
}
export interface ContactValidationError {
  field: string;
  message: string;
}