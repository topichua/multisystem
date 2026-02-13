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
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex.morgan@example.com',
      role: UserRole.Admin,
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      title: 'Administrator',
      pronoun: 'he/him',
      postCounter: 42,
    };
    return Promise.resolve({ data: user });
  },

  async getBondMxCurrent(): Promise<{ data: UserProfileDto }> {
    // Mock: replace with real API when backend is ready
    const user: UserProfileDto = {
      id: 'bond-user-1',
      firstName: 'Demo',
      lastName: 'Demo',
      email: 'alex.morgan@example.com',
      role: UserRole.Admin,
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      title: 'Dr',
      pronoun: 'they/them',
      prefName: 'Alex',
      mobile: '+61 400 000 000',
      postalAddress1: '123 Example St',
      postalSuburb: 'Sydney',
      postalState: 'NSW',
      postalPostcode: '2000',
      postalCountry: 'Australia',
      postCounter: 12,
    };
    return Promise.resolve({ data: user });
    // return await axio2s.get(`/api/User`);
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
    // Mock: full permissions so UI and role checks work in development
    const permissions: PermissionDto = {
      generalManagers: true,
      generalCommunities: true,
      generalCategories: true,
      generalTags: true,
      generalFaq: true,
      generalAnnouncements: true,
      generalTc: true,
      communityCreate: true,
      communityEdit: true,
      communityClose: true,
      communityAddModerator: true,
      communityAddEditor: true,
      communityAddMember: true,
      communityBlacklist: true,
      postCreate: true,
      postApprove: true,
      postEdit: true,
      postDelete: true,
      commentCreate: true,
      commentEdit: true,
      commentDelete: true,
      meetingAll: true,
      assetsAll: true,
    };
    return Promise.resolve(permissions);
    // return await axios.get(`/api/v1/permission`);
  },

  // async getUserCommunitiesPermission() {
  //   return await axios.get(`/api/v1/permission`);
  // }
};
