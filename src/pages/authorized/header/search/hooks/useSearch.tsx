import { useRequest } from 'ahooks';
import { useCallback } from 'react';

import { searchApi } from 'src/transport/search/search.api';

export const useSearch = () => {
  const { data, loading, run } = useRequest(searchApi.search, {
    manual: true,
    debounceWait: 400,
  });

  const handleSearch = useCallback(
    (value: string) => {
      run(value);
    },
    [run]
  );

  return { data, loading, handleSearch };
};
