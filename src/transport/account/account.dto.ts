export type AccountSignInDto = {
  login: string;
  password: string;
};

export type LoginResponseDto = {
  accessToken: string;
  appUserId: string;
  userName: string;
  userToken: string;
};

export type CurrentUserDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  profileImg: string;
};

export enum UserRole {
  Standard = 0,
  Admin = 1,
  WorkSpaceOwner = 2,
  Manager = 3,
}

export type UserDataMapDto = {
  pinnedPostIds: Array<string>;
  savedPostIds: Array<string>;
};

export type UserProfileDto = {
  anzcapPostNorminals?: string;
  avatarSrc?: string;
  avatarUrl?: string;
  awardSubscriptionDetails?: object[];
  bondPostNorminals?: string;
  committees?: object[];
  coverSrc?: string | null;
  dob?: string;
  email?: string;
  firstName?: string;
  gender?: string;
  homeAddress?: string;
  homeAddressPrefix?: string;
  homeCountry?: string;
  homeNumber?: string;
  homePostcode?: string;
  homeState?: string;
  homeSuburb?: string;
  honorific?: string;
  id: string;
  inWhatCountryDoYouHoldPracticingRegistration?: string;
  isCommunityPharmacyResidentAdminsOfTheseOrganisations?: object[];
  isHospitalRegistrarAdminsOfTheseOrganisations?: object[];
  isHospitalResidentAdminsOfTheseOrganisations?: object[];
  lastName?: string;
  memberNum?: string;
  membershipType?: string;
  membershipTypeId?: string;
  middleName?: string;
  mobile?: string;
  nextFiveYearReviewDate?: object;
  postalAddress1?: string;
  postalPostcode?: string;
  postalState?: string;
  postalCountry?: string;
  postalSuburb?: string;
  postNominal?: string;
  preferredName?: string;
  prefName?: string;
  pronoun?: string;
  registrationNum?: string;
  registeredEmail?: string;
  role: UserRole;
  specialitNames?: string;
  specialityIds?: string;
  title?: string;
  workplaces?: object[];
  workTypeIds?: string;
  workTypes?: string;
  postCounter?: number;
  segments?: Array<UserSegmentDto> | null;
  isFirstLogin?: boolean;
  graduationDate?: string;
};

export type UserSegmentDto = {
  id: string;
  name: string;
};

export type PermissionDto = {
  generalManagers: boolean;
  generalCommunities: boolean;
  generalCategories: boolean;
  generalTags: boolean;
  generalFaq: boolean;
  generalAnnouncements: boolean;
  generalTc: boolean;
  communityCreate: boolean;
  communityEdit: boolean;
  communityClose: boolean;
  communityAddModerator: boolean;
  communityAddEditor: boolean;
  communityAddMember: boolean;
  communityBlacklist: boolean;
  postCreate: boolean;
  postApprove: boolean;
  postEdit: boolean;
  postDelete: boolean;
  commentCreate: boolean;
  commentEdit: boolean;
  commentDelete: boolean;
  meetingAll: boolean;
  assetsAll: boolean;
};
