import { Dayjs } from 'dayjs';
import { action, makeObservable, observable } from 'mobx';

import { communityApi } from 'src/transport/communities/communities.api';
import {
  ExploreMeetStatus,
  MeetingCommunityItem,
  MeetingStatus,
} from 'src/transport/communities/communities.dto';

export enum MeetingType {
  All = 'All',
  YourUpcomingMeetings = 'My upcoming meetings',
  PastMeetings = 'Past meetings',
}

export const PAGE_SIZE = 10;

export class ExploreMeetingsStore {
  public isCommunityLoading: boolean = false;
  public allCommunities: MeetingCommunityItem[] = [];
  public totalIncoming: number | null = null;
  public totalUpcoming: number | null = null;
  public meetingFetchPageSize: number = PAGE_SIZE;

  public selectedCommunities: MeetingCommunityItem[] = [];

  public isMeetingsLoading: boolean = false;
  public updateMeetingStatusLoading: boolean = false;
  public meetings: ExploreMeetStatus[] = [];

  public selectedMeetingType: MeetingType = MeetingType.All;
  public isBookmarked: boolean = false;

  public selectedMeetingStatuses: MeetingStatus[] = [];
  public fromDatePicker: Dayjs | null = null;
  public toDatePicker: Dayjs | null = null;

  constructor() {
    makeObservable(this, {
      isCommunityLoading: observable,
      isMeetingsLoading: observable,
      allCommunities: observable,
      isBookmarked: observable,
      selectedMeetingType: observable,
      selectedCommunities: observable,
      meetings: observable,
      selectedMeetingStatuses: observable,
      fromDatePicker: observable,
      toDatePicker: observable,
      totalIncoming: observable,
      totalUpcoming: observable,
      meetingFetchPageSize: observable,

      toogleBookmarked: action,
      getAllCommunities: action,
      setSelectedMeetingType: action,
      setSelectedCommunities: action,
      setSelectedMeetingStatuses: action,
      setDateRange: action,
      getAllMeetings: action.bound,
      updateMeetingStatus: action,
    });
  }

  public getAllCommunities = async () => {
    this.isCommunityLoading = true;

    communityApi
      .getMeetingPreference()
      .then((resp) => {
        this.allCommunities = resp.communities;
        this.totalIncoming = resp.totalIncoming;
        this.totalUpcoming = resp.totalUpcoming;
      })
      .catch((error) => {
        throw new Error(error);
      })
      .finally(() => {
        this.isCommunityLoading = false;
      });
  };

  public getAllMeetings = async (pageSize = this.meetingFetchPageSize) => {
    this.isMeetingsLoading = true;
    this.meetingFetchPageSize = pageSize;

    return communityApi
      .getExploreMeetings({
        page: 1,
        pageSize,
        communitiesIds: this.selectedCommunities.length
          ? this.selectedCommunities.map((community) => community.id)
          : null,
        statuses: this.selectedMeetingStatuses.length
          ? this.selectedMeetingStatuses.map((value) => Number(value))
          : null,
        showPast: this.selectedMeetingType !== MeetingType.YourUpcomingMeetings,
        showUpcoming: this.selectedMeetingType !== MeetingType.PastMeetings,
        ...(this.fromDatePicker
          ? { startDate: this.fromDatePicker.toISOString() }
          : {}),
        ...(this.toDatePicker
          ? { endDate: this.toDatePicker.toISOString() }
          : {}),
      })
      .then((res) => {
        const formattedResult = {
          list: res.meets.slice(-PAGE_SIZE),
          length: res.meets.length,
        };

        this.meetings = res.meets;
        return formattedResult;
      })
      .finally(() => {
        this.isMeetingsLoading = false;
      });
  };

  public toogleBookmarked = () => {
    this.isBookmarked = !this.isBookmarked;
  };

  public setSelectedMeetingType = (type: MeetingType) => {
    this.selectedMeetingType = type;
  };

  public setSelectedCommunities = (values: MeetingCommunityItem[]) => {
    this.selectedCommunities = values;
  };

  public setSelectedMeetingStatuses = (values: MeetingStatus[]) => {
    this.selectedMeetingStatuses = values;
  };

  public setDateRange = (from: Dayjs | null, to: Dayjs | null) => {
    this.fromDatePicker = from;
    this.toDatePicker = to;
  };

  public updateMeetingStatus = async (
    communityId: string,
    meetingId: string,
    newStatus: string
  ) => {
    this.updateMeetingStatusLoading = true;
    communityApi
      .updateMeetingStatus(communityId, meetingId, newStatus)
      .then(() => {
        this.getAllMeetings();
      })
      .finally(() => {
        this.updateMeetingStatusLoading = false;
      });
  };
}
