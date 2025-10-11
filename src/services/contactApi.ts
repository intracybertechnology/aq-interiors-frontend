import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;
export const contactApi = {
  submitEnquiry: async (formData: {
    fullName: string;
    emailAddress: string;
    phoneNumber?: string;
    serviceInterestedIn?: string;
    projectDetails?: string;
  }) => {
    const response = await axios.post(`${API_BASE_URL}/contact`, formData);
    return response.data;
  }
};

export default contactApi;