import { action, computed, makeObservable, observable } from 'mobx';
import {
  PermissionDto,
  UserDataMapDto,
  UserProfileDto,
  UserRole,
} from '../transport/account/account.dto';
import { accountAPI } from 'src/transport/account/account.api';
import { communityApi } from 'src/transport/communities/communities.api';
import { CommunitiesPreference } from '../transport/communities/communities.dto';

export class AuthStore {
  public user: UserProfileDto | null = null;
  public isLoading: boolean = false;
  public map: UserDataMapDto | null = null;
  public preference: CommunitiesPreference | null = null;
  public globalPermission: PermissionDto | null = null;

  constructor() {
    makeObservable(this, {
      user: observable,
      loadUser: action.bound,
      refreshCurrent: action.bound,
      loadUserHidden: action.bound,
      loadUserMap: action.bound,
      isLoading: observable,
      map: observable,
      canAccessAdmin: computed,
      canCreateCommunity: computed,
      preference: observable,
      loadPreference: action.bound,
      getUserSegments: action.bound,
      globalPermission: observable,
      loadGlobalPreference: action.bound,
    });
    this.loadUser();
  }

  public async loadUser() {
    try {
      this.isLoading = true;
      const { data } = await accountAPI.getCurrent();
      this.user = data;

      await this.loadUserMap();
      await this.loadPreference();
      await this.loadGlobalPreference();
    } catch (e) {
      console.error('fetch current user error', e);
    } finally {
      this.isLoading = false;
    }
  }

  public async loadUserMap() {
    // this.map = await accountAPI.getMap();
  }

  public async loadPreference() {
    this.preference = await communityApi.getPreference();
  }

  public async loadGlobalPreference() {
    accountAPI.getUserGlobalPermission().then((res) => {
      this.globalPermission = res;
    });
  }

  public loadUserHidden() {
    // accountAPI.getCurrent().then((result) => {
    //   this.user = result;
    // });
  }

  public get canAccessAdmin() {
    if (this.preference == null) return false;
    return (
      this.user?.role == UserRole.Admin ||
      this.user?.role == UserRole.WorkSpaceOwner ||
      this.preference?.topModerated?.length > 0
    );
  }

  public get canCreateCommunity() {
    if (this.map == null) return false;
    return this.user?.role == UserRole.Admin;
  }

  public refreshCurrent(newCurrent: UserProfileDto) {
    this.user = newCurrent;
  }

  public getUserSegments() {
    return this?.user?.segments;
  }
}

// const PERMISSION = {
//   generalManagers: true,
//   generalCommunities: true,
//   generalCategories: true,
//   generalTags: true,
//   generalFAQ: true,
//   generalAnnouncements: true,
//   generalTC: true,
//   communityCreate: true,
//   communityEdit: true,
//   communityClose: true,
//   communityAddModerator: true,
//   communityAddEditor: true,
//   communityAddMember: true,
//   communityBlacklist: true,
//   postCreate: true,
//   postApprove: true,
//   postEdit: true,
//   postDelete: true,
//   commentCreate: true,
//   commentEdit: true,
//   commentDelete: true,
//   meetingAll: true,
//   assetsAll: true,
// };
