import { useEffect, useState } from 'react';
import { useBoolean } from 'ahooks';
import { difference, uniq } from 'lodash';

import { UserProfileDto } from 'src/transport/account/account.dto';
import { userApi } from 'src/transport/user/user.api';

export const useGetUsersByIds = (usersIds: string[]) => {
  const [isLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);
  const [users, setUsers] = useState<Record<string, UserProfileDto>>({});

  useEffect(() => {
    if (usersIds.length > 0) {
      fetchUsers();
    }
  }, [usersIds]);

  const fetchUsers = async () => {
    startLoading();

    const localUsersIds = Object.keys(users);
    const newUsersIds = uniq(difference(usersIds, localUsersIds));

    const newUsers = await userApi
      .getUsersByIds({ accountIds: newUsersIds })
      .then((res) => res.data.users);

    const updatedUsers = newUsers.reduce(
      (acc, user) => {
        acc[user.id] = user;
        return acc;
      },
      { ...users }
    );

    setUsers(updatedUsers);
    finishLoading();
  };

  return { isLoading, users };
};
