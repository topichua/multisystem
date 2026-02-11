import { UserProfileDto } from '../account/account.dto';
import { CommunityStatus } from '../communities/communities.dto';
import { PaginationParams } from '../types';

export type UsersAccountsDto = PaginationParams & {
  accountIds: string[];
  sortBy?: string;
  sortAscending?: boolean;
};

export type SearchUsersDto = PaginationParams & {
  keyword: string;
  communityId?: string;
  sortBy?: string;
};

export type CommunityMember = UserProfileDto & {
  isInCommunity: boolean;
  status?: CommunityStatus | null;
  isBlocked: boolean;
};

export type SearchUsersDtoResponse = {
  data: {
    users: CommunityMember[];
    totalItems: number;
    page: number;
    size: number;
    sortField: string;
    sortOrder: string;
  };
};
