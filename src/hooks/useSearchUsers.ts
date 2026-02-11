import { useBoolean, useDebounce, useInfiniteScroll } from 'ahooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { userApi } from 'src/transport/user/user.api.ts';
import { CommunityMember } from 'src/transport/user/user.dto.ts';

export const PAGE_SIZE = 50;

export interface ICommunityMembers {
  list: CommunityMember[];
  total: number;
}

export const fetchUsersList = async (
  page: number,
  keyword: string,
  communityId: string
): Promise<ICommunityMembers> => {
  const response = await userApi.searchUsers({
    page,
    pageSize: PAGE_SIZE,
    keyword,
    communityId,
  });

  return new Promise((resolve) =>
    resolve({
      list: response.data.users,
      total: response.data.totalItems,
    })
  );
};

export const useCommunityUsers = (communityId: string) => {
  const ref = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState('');
  const [isLoading, { setTrue: startLoading, setFalse: stopLoading }] =
    useBoolean(false);

  const debouncedKeyword = useDebounce(keyword, { wait: 500 });

  const [reload, { toggle: toggleReload }] = useBoolean(true);

  const usersResult = useInfiniteScroll(
    (d) => {
      const page = d ? Math.ceil(d.list.length / PAGE_SIZE) + 1 : 1;

      if (debouncedKeyword.trim().length < 3) {
        return Promise.resolve({ list: [], total: 0 });
      }

      startLoading();
      return fetchUsersList(page, debouncedKeyword.trim(), communityId).finally(
        stopLoading
      );
    },
    {
      target: ref,
      isNoMore: (users) =>
        users
          ? users.list.length >= users.total || users.list.length === 0
          : true,
      reloadDeps: [debouncedKeyword, reload],
      manual: true,
    }
  );

  useEffect(() => {
    if (debouncedKeyword.trim().length < 3) {
      usersResult.mutate({ list: [], total: 0 });
    } else {
      usersResult.reload();
    }
  }, [debouncedKeyword]);

  useEffect(() => {
    if (keyword.trim().length < 3) {
      usersResult.mutate({ list: [], total: 0 });
    }
  }, [keyword]);

  const users = useMemo(
    () => usersResult?.data?.list || [],
    [usersResult.data]
  );

  return {
    users,
    isLoading: usersResult.loading || isLoading,
    keyword,
    setKeyword,
    ref,
    reload: toggleReload,
  };
};
