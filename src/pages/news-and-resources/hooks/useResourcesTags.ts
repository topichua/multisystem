import { useCallback, useEffect, useState } from 'react';
import { useResourceTagStore } from '../store/resources.store';

export const useResourcesTags = () => {
  const { getTags, tags, isLoading } = useResourceTagStore();
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
    getTags();
  }, []);

  return {
    tags,
    isLoading,
    selectedTags,
    handleTagsChange,
    handleResetTags,
    isTagChecked,
  };
};
