import { useDebounce } from 'ahooks';
import { Spin } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useRef } from 'react';
import MeetingList from 'src/pages/explore-meetings/components/Content/MeetingList.tsx';
import { useExploreMeetingsStore } from 'src/pages/explore-meetings/explore-meetings.provider.tsx';
import * as S from '../common.styled.ts';
import useMeetingsInfiniteScroll from './useMeetingsInfiniteScroll.ts';

export const Content = observer(() => {
  const {
    getAllMeetings,
    isMeetingsLoading,
    selectedCommunities,
    fromDatePicker,
    toDatePicker,
    selectedMeetingType,
    selectedMeetingStatuses,
    totalUpcoming,
    totalIncoming,
  } = useExploreMeetingsStore();

  const debouncedSelectedCommunities = useDebounce(selectedCommunities, {
    wait: 400,
  });
  const debouncedSelectedMeetingType = useDebounce(selectedMeetingType, {
    wait: 400,
  });
  const debouncedSelectedMeetingStatuses = useDebounce(
    selectedMeetingStatuses,
    { wait: 400 }
  );

  useEffect(() => {
    getAllMeetings();
  }, [
    getAllMeetings,
    debouncedSelectedCommunities,
    debouncedSelectedMeetingType,
    fromDatePicker,
    toDatePicker,
    debouncedSelectedMeetingStatuses,
  ]);

  const ref = useRef<HTMLDivElement>(null);
  useMeetingsInfiniteScroll(
    ref,
    getAllMeetings,
    totalUpcoming || 0,
    totalIncoming || 0
  );

  return (
    <Spin spinning={isMeetingsLoading}>
      <S.StyledScroll ref={ref}>
        <S.StyledPage>
          <MeetingList />
        </S.StyledPage>
      </S.StyledScroll>
    </Spin>
  );
});
