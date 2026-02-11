import {
  GetGlobalTermsResponse,
  GetServerValuesResponse,
} from "./serverValues.dto.ts";
import axio2s from 'src/transport/axios/axios-instance.ts';

export const serverValueApi = {
  async getGlobalAgreement(): Promise<GetGlobalTermsResponse> {
    return axio2s.get(`api/v1/admin/community/global-tc`);
  },

  async getAllServerValue(keyword: string): Promise<GetServerValuesResponse> {
    return axio2s.get(
      `api/v1/admin/server-values?page=1&pageSize=1000&keyword=${keyword}`
    );
  },

  async createServerValue(key: string, value: string) {
    return axio2s.post(`api/v1/admin/server-values`, {
      key: key,
      value: value,
    });
  },

  async updateServerValue(serverValueId: string, value: string) {
    return axio2s.put(`api/v1/admin/server-values/${serverValueId}`, {
      value: value,
    });
  },

  async deleteServerValue(serverValueId: string) {
    return axio2s.delete(`api/v1/admin/server-values/${serverValueId}`);
  },
};
