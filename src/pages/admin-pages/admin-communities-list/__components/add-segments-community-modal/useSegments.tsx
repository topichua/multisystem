import { useEffect, useMemo, useState } from 'react';
import { useBoolean, useDebounce } from 'ahooks';
import { notification } from 'antd';

import { SegmentProps } from 'src/transport/communities/communities.dto.ts';
import { communityApi } from 'src/transport/communities/communities.api.ts';

const SEGMENTS_CATEGORIES = [
  'Career Stage',
  'Areas of Practice',
  'Other Areas of Interest',
  'Location',
  'Funding Scheme',
  'Custom Rule Segment',
];

type CategorySegments = {
  category: string;
  segments: SegmentProps[];
};

export const useSegments = (segmentIds: string[], isOpen: boolean) => {
  const [selectedSegmentsIds, setSelectedSegmentsIds] = useState<string[]>(
    segmentIds ?? []
  );
  const [
    isSegmentsLoading,
    { setTrue: startLoading, setFalse: finishLoading },
  ] = useBoolean(false);

  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(
    keyword && keyword.trim()?.length >= 3 ? keyword : undefined,
    { wait: 500 }
  );
  const isKeywordShort = keyword.trim().length < 3;

  const [segments, setSegments] = useState<CategorySegments[]>([]);

  const [collapsedActiveKeys, setCollapsedActiveKeys] = useState<string[]>([]);

  useEffect(() => {
    setCollapsedActiveKeys(isKeywordShort ? [] : SEGMENTS_CATEGORIES);
  }, [isKeywordShort]);

  useEffect(() => {
    if (!isOpen || segments.length) return;

    startLoading();

    communityApi
      .getCommunitySegments()
      .then(({ data }) => {
        const updatedSegments: CategorySegments[] = data.map(
          (fetchedSegments) => {
            return {
              category: fetchedSegments.segCategoryName,
              segments: fetchedSegments.segments.map(
                ({ segmentId, segmentName }) => ({
                  segmentId: segmentId,
                  segmentName: segmentName,
                })
              ),
            };
          }
        );

        setSegments(updatedSegments);
      })
      .catch(() => {
        notification.error({ message: 'Error fetching segments. Try again' });
      })
      .finally(finishLoading);
  }, [isOpen]);

  const allSegments = useMemo(() => {
    return segments.map((segment) => ({
      category: segment.category,
      segments: segment.segments.filter(
        (s) => !selectedSegmentsIds.includes(s.segmentId)
      ),
    }));
  }, [segments, selectedSegmentsIds]);

  const searchSegments = useMemo(() => {
    return debouncedKeyword
      ? allSegments.reduce((acc, segment) => {
          const filteredSegments = segment.segments.filter((s) =>
            s.segmentName.toLowerCase().includes(debouncedKeyword.toLowerCase())
          );

          if (filteredSegments.length > 0) {
            acc.push({
              category: segment.category,
              segments: filteredSegments,
            });
            return acc;
          } else {
            return acc;
          }
        }, [] as CategorySegments[])
      : [];
  }, [allSegments, debouncedKeyword]);

  const selectedSegments: SegmentProps[] = useMemo(() => {
    return segments.reduce((acc, current) => {
      const filteredSelectedSegments = current.segments.filter((s) =>
        selectedSegmentsIds.includes(s.segmentId)
      );

      acc = [...acc, ...filteredSelectedSegments];
      return acc;
    }, [] as SegmentProps[]);
  }, [segments, selectedSegmentsIds]);

  const toggleSegmentIds = (id: string) => {
    setSelectedSegmentsIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return {
    allSegments,
    selectedSegmentsIds,
    isSegmentsLoading,
    searchSegments,
    selectedSegments,
    keyword,
    isKeywordShort,
    filteredSegments: isKeywordShort ? allSegments : searchSegments,
    collapsedActiveKeys,
    setCollapsedActiveKeys,
    setSelectedSegmentsIds,
    setKeyword,
    toggleSegmentIds,
  };
};
