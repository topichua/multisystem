import { useState } from 'react';
import { useBoolean, useDebounce, useUpdateEffect } from 'ahooks';
import { AutoCompleteProps, Typography } from 'antd';

import { userApi } from 'src/transport/user/user.api';
import { Stack } from 'src/components/common/Stack/Stack';
import { CommunityMember } from 'src/transport/user/user.dto';

const { Text } = Typography;

export const useFindUsers = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, {
    wait: 400,
  });

  const [usersOptions, setUsersOptions] = useState<
    AutoCompleteProps['options']
  >([]);

  const [isLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);
  const [selectedUser, setSelectedUser] = useState<CommunityMember | null>(
    null
  );

  useUpdateEffect(() => {
    if (debouncedQuery.trim().length > 2) {
      fetchUsers();
    } else {
      setUsersOptions([]);
    }
  }, [debouncedQuery]);

  const fetchUsers = () => {
    startLoading();

    userApi
      .searchUsers({ keyword: debouncedQuery, pageSize: 50 })
      .then(({ data }) => {
        setUsersOptions(
          data.users.map((user) => ({
            label: (
              <Stack vertical spacing="none">
                <Text>
                  {user.firstName} {user.lastName}
                </Text>
                <Text type="secondary">{user.registeredEmail}</Text>
              </Stack>
            ),
            value: user.id,
            user,
          }))
        );
      })
      .finally(finishLoading);
  };

  const onSelectUser = (userId: string | null) => {
    const findUser = usersOptions?.find(
      (option) => option?.user?.id === userId
    );

    if (findUser) {
      setQuery(`${findUser?.user?.firstName} ${findUser?.user?.lastName}`);
      setSelectedUser(findUser.user);
    } else {
      setSelectedUser(null);
    }
  };

  return {
    query,
    usersOptions,
    isLoading,
    disabledContinue: !selectedUser,
    selectedUser,
    setQuery,
    onSelectUser,
  };
};
