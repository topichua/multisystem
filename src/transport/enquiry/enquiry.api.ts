import { SendEnquiryApiResponse } from 'src/transport/enquiry/enquiry.dto.ts';
import axios from '../axios/axios-bond-instance';

export const enquiryApi = {
  submitEnquiry: async (data: FormData): Promise<SendEnquiryApiResponse> => {
    return await axios.post(`/api/user/enquire`, data);
  },
};
