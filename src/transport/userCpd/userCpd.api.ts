import axiosInstance from '../axios/axios-bond-instance';
import {
  CpdCertificateResponse,
  GetCreateCPDEntityUrlResponse,
  UserCpdResponse,
} from './userCpd.dto';

export const userCpdApi = {
  getUserCpds(): Promise<UserCpdResponse> {
    return axiosInstance.get(`api/user/cpds`);
  },

  getCpdCertificate(spdId: string): Promise<CpdCertificateResponse> {
    return axiosInstance.get(`api/cpd/${spdId}/printview`);
  },

  downloadCpdCertificate(spdId: string): Promise<ArrayBuffer> {
    return axiosInstance.get(`api/cpd/${spdId}/download`, {
      responseType: 'arraybuffer',
    });
  },

  getCreateCPDEntityUrl(): Promise<GetCreateCPDEntityUrlResponse> {
    return axiosInstance.get(`api/cpd/new`);
  },

  getCpdPeriodSummary(spdId: string): Promise<CpdCertificateResponse> {
    return axiosInstance.get(`api/cpd/period/${spdId}/printview`);
  },

  downloadCpdPeriodSummary(spdId: string): Promise<ArrayBuffer> {
    return axiosInstance.get(`api/cpd/period/${spdId}/download`, {
      responseType: 'arraybuffer',
    });
  },

  downloadCPDAttachment(atachmentId: string): Promise<ArrayBuffer> {
    return axiosInstance.get(
      `api/user/cpd/attachment/${atachmentId}/download`,
      {
        responseType: 'arraybuffer',
      }
    );
  },
};
