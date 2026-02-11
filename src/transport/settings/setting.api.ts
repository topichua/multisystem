import {
  InterestsDataResponse,
  UserInterestsDataResponse,
  WorkplaceDetailsDto,
} from 'src/pages/settings/workplace-detals/workplace-details.dto';
import axios, { getAuthorizationHeader } from '../axios/axios-bond-instance';
import axio2s from '../axios/axios-instance';
import originAxios from 'axios';

export const settingsAPI = {
  async getWorkplaceDetails(): Promise<WorkplaceDetailsDto> {
    return await axios.get(`api/user/organisation`);
  },

  async getUpdateDetailsLink(): Promise<any> {
    return await axios.get(`api/user/updatedetailslink`);
  },

  async getDietaryRequirements() {
    return await axios.get(`api/user/requirements`);
  },

  async getDietaryRequirementOptions() {
    return await axios.get(`api/value/dietaryrequirements`);
  },

  async saveDietaryRequirements(data: {
    dietaryRequirements: string[];
    otherDietaryRequirement: string;
    accessibilityRequirement: string;
  }) {
    return await axios.post(`api/user/requirements`, data);
  },

  async get2FaValue() {
    return await axio2s.get('api/v1/account/settings');
  },

  async update2FaValue(data: any) {
    return await axio2s.put('api/v1/account/settings', data);
  },

  async changePassword(data: any) {
    return axio2s.post('api/v1/account/change-password', data);
  },

  async getAllAreaOfInterests(): Promise<InterestsDataResponse['data']> {
    const res = await originAxios.get(
      import.meta.env.VITE_API_BOND_URL + '/api/segment/interests'
    );
    return res.data.data;
  },

  async getUserInterests(): Promise<UserInterestsDataResponse['data']> {
    const authorization = getAuthorizationHeader();
    const res = await axios.get('api/user/segment/interests', {
      headers: {
        Authorization: authorization,
      },
    });

    return res.data;
  },

  async addInterestToUser(id: string) {
    await axios.post(`api/user/segment/${id}`);
  },

  async removeInterestFromUser(id: string) {
    await axios.delete(`api/user/segment/${id}`);
  },

  async searchOrganisations(query: string) {
    const url = query ? `/api/org/names?query=${query}` : '/api/org/names';
    const response = await originAxios.get(
      import.meta.env.VITE_API_BOND_URL + url
    );

    return response.data;
  },

  async updateWorkplaceDetails(details: any) {
    const response = await axios.put('/api/user/organisation', details);
    return response.data;
  },

  async uploadAvatar(formData: FormData) {
    return axios.post('/api/user/profileimage', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
