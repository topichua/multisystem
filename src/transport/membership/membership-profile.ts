import axios from '../axios/axios-bond-instance';
import {
  GetMembershipManageLinkResponse,
  GetUpdatePaymentLinkResponse,
} from './membership-profile.dto';

export const membershipProfileApi = {
  getMembershipProfile: async (): Promise<any> => {
    return await axios.get(`/api/user/membership`);
  },

  getMembershipManageLink:
    async (): Promise<GetMembershipManageLinkResponse> => {
      return await axios.get(`/api/user/membership/managelink`);
    },

  getUpdatePaymentLink: async (): Promise<GetUpdatePaymentLinkResponse> => {
    return await axios.get(`/api/user/membership/updatepaymentlink`);
  },

  getPreviewMembershipLink: async (id: string) => {
    return await axios.get(`api/user/membership/${id}/printview`);
  },

  downloadPdf: async (id: string) => {
    return await axios.get(`/api/user/membership/${id}/download`, {
      responseType: 'blob',
    });
  },
};
