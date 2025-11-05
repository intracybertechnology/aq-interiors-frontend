const API_BASE_URL = '/api';

export const contactApi = {
  submitEnquiry: async (formData: {
    fullName: string;
    emailAddress: string;
    phoneNumber?: string;
    serviceInterestedIn?: string;
    projectDetails?: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`
        }));
        throw new Error(errorData.message || 'Failed to submit enquiry');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      throw error;
    }
  }
};

export default contactApi;