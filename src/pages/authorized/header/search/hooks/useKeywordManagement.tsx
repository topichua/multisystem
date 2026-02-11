import { ChangeEvent, useCallback, useState } from 'react';

export const useKeywordManagement = (handleSearch: (value: string) => void) => {
  const [keyword, setKeyword] = useState('');

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement> | string) => {
      const value =
        typeof event === 'string' ? event : event.currentTarget.value;
      setKeyword(value);
      handleSearch(value);
    },
    [handleSearch]
  );

  return { keyword, handleInputChange };
};
