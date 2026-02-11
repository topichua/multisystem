import axio2s from '../axios/axios-bond-instance';
import axios from '../axios/axios-instance';
import { PermissionDto, UserProfileDto, UserRole } from './account.dto';

export const accountAPI = {
  async getOneTimeCode(email: string, password: string) {
    return await axios.post('api/v1/auth/request-one-time-login-code', {
      email,
      password,
    });
  },

  async login(
    email: string,
    password: string,
    impersonatorId?: string
  ): Promise<string> {
    return await axios.post('api/v1/auth/sign-in', {
      email: email,
      password: password,
      impersonatorId,
    });
  },

  async forgotPassword(email: string): Promise<boolean> {
    try {
      await axios.post('api/v1/auth/forgot-password', { email: email });
      return true;
    } catch (error: any) {
      return false;
    }
  },

  async resetPassword(
    token: string,
    password: string,
    userId: string
  ): Promise<boolean> {
    try {
      await axios.post('/api/v1/auth/reset-password', {
        token,
        password,
        userId,
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  async getCurrent(): Promise<{ data: UserProfileDto }> {
    // Mocked current user aligned with other mocks (e.g., user-1)
    const user: UserProfileDto = {
      id: 'user-1',
      firstName: 'First1',
      lastName: 'Last1',
      email: 'user1@example.com',
      role: UserRole.Admin,
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      title: 'Administrator',
      pronoun: 'they/them',
      postCounter: 42,
    };
    return Promise.resolve({ data: user });
  },

  async getBondMxCurrent(): Promise<{ data: UserProfileDto }> {
    return await axio2s.get(`/api/User`);
  },

  async saveBondMxCurrentProfile(values: any) {
    await axio2s.put(`/api/User`, {
      title: values.title,
      firstName: values.fName,
      lastName: values.lName,
      middleName: values.mName,
      prefName: values.pref,
      registeredEmail: values.email,
      gender: values.gender,
      dob: values.dob ? values.dob.format('YYYY-MM-DD') : '',
      graduationDate: values.graduationDate
        ? values.graduationDate.format('YYYY-MM-DD')
        : '',
      mobile: values.phone,
      postalAddress1: values.postalAddress1,
      postalSuburb: values.postalSuburb,
      postalState: values.postalState,
      postalPostcode: values.postalPostcode,
      postalCountry: values.postalCountry,
      pronoun: values.pronoun,
    });
  },

  async setFirstLogin() {
    return await axios.post(`/api/v1/community/users/set-first-login`);
  },

  async getUserGlobalPermission(): Promise<PermissionDto> {
    return await axios.get(`/api/v1/permission`);
  },

  // async getUserCommunitiesPermission() {
  //   return await axios.get(`/api/v1/permission`);
  // }
};
