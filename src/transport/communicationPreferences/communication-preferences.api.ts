import axios, { getAuthorizationHeader } from '../axios/axios-bond-instance';
import originAxios from 'axios';

export const communicationPreferencesApi = {
  async getAllCommunicationPreferences() {
    const authorization = getAuthorizationHeader();
    const res = await originAxios.get(
      import.meta.env.VITE_API_BOND_URL + '/api/segment/commprefs',
      {
        headers: {
          Authorization: authorization,
        },
      }
    );

    return res.data;
  },

  async getUserCommunicationPreferences() {
    return await axios.get(`/api/user/segment/commprefs`);
  },
};
