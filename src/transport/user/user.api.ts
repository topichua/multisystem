import { UserProfileDto, UserRole } from '../account/account.dto';
import axio2s from '../axios/axios-instance';

import {
  SearchUsersDto,
  SearchUsersDtoResponse,
  UsersAccountsDto,
} from './user.dto';

export const userApi = {
  async getUserById(id: string): Promise<{ data: UserProfileDto }> {
    return axio2s.get(`api/v1/account/${id}`);
  },

  async getUsersByIds({
    accountIds,
    page = 1,
    pageSize = 100,
    sortBy = 'firstName',
  }: UsersAccountsDto): Promise<{
    data: { users: UserProfileDto[] };
  }> {
    // Mock deterministic users aligned with mocked posts/communities (user-1..user-20)
    const buildUser = (id: string): UserProfileDto => {
      const match = id.match(/user-(\d+)/);
      const num =
        match && !Number.isNaN(Number(match[1]))
          ? Number(match[1])
          : Math.abs(
              [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 100
            ) || 1;
      const firstName = `First${num}`;
      const lastName = `Last${num}`;
      const email = `user${num}@example.com`;
      const avatarUrl =
        num % 3 === 0
          ? `https://i.pravatar.cc/150?img=${(num % 70) + 1}`
          : undefined;
      return {
        id,
        role: UserRole.Standard,
        firstName,
        lastName,
        email,
        avatarUrl,
        title: num % 2 === 0 ? 'Member' : 'Contributor',
      };
    };

    const defaultIds =
      accountIds && accountIds.length > 0
        ? accountIds
        : Array.from({ length: 20 }, (_, i) => `user-${i + 1}`);

    let users = defaultIds.map(buildUser);

    if (sortBy === 'firstName') {
      users = users.sort((a, b) =>
        (a.firstName || '').localeCompare(b.firstName || '')
      );
    } else if (sortBy === 'lastName') {
      users = users.sort((a, b) =>
        (a.lastName || '').localeCompare(b.lastName || '')
      );
    } else if (sortBy === 'email') {
      users = users.sort((a, b) => (a.email || '').localeCompare(b.email || ''));
    }

    const start = (page - 1) * pageSize;
    const paged = users.slice(start, start + pageSize);

    return Promise.resolve({
      data: {
        users: paged,
      },
    });
  },

  async searchUsers({
    page = 1,
    pageSize = 1000,
    sortBy = 'firstName',
    ...rest
  }: SearchUsersDto): Promise<SearchUsersDtoResponse> {
    return await axio2s.post('api/v1/account/search', {
      ...rest,
      page,
      pageSize,
      sortBy,
    });
  },
};
