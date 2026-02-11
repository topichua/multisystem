import { useCallback, useEffect, useState } from 'react';
import { useNewsStore } from '../store/news.store';

export const useNewsTags = () => {
  const { getNewsTags, newsTags, isNewsTagsLoading } = useNewsStore();
  const [selectedTags, setSelectedTags] = useState<number[]>();

  const handleTagsChange = useCallback(
    (tag: number, checked: boolean) => {
      const nextSelectedTags = checked
        ? [...(selectedTags || []), tag]
        : selectedTags?.filter((t) => t !== tag);
      setSelectedTags(nextSelectedTags);
    },
    [selectedTags]
  );

  const handleResetTags = useCallback(() => {
    if (!selectedTags?.length) return;
    setSelectedTags(undefined);
  }, [selectedTags?.length]);

  const isTagChecked = useCallback(
    (tagId: number) => {
      return !!selectedTags?.find((_tagId) => _tagId === tagId);
    },
    [selectedTags]
  );

  useEffect(() => {
    getNewsTags();
  }, []);

  return {
    newsTags,
    isNewsTagsLoading,
    selectedTags,
    handleTagsChange,
    handleResetTags,
    isTagChecked,
  };
};
