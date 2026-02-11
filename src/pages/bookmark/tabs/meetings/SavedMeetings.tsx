import { Spin } from 'antd';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header.tsx';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header.tsx';
import { useBookmarkStore } from 'src/pages/bookmark/bookmark.provider.tsx';
import MeetingList from 'src/pages/bookmark/tabs/meetings/MeetingList.tsx';
import * as S from './common.styled.ts';

export const SavedMeetings = observer(() => {
  const { getAllMeetings, isMeetingsLoading, meetings } = useBookmarkStore();

  useEffect(() => {
    getAllMeetings();
  }, [getAllMeetings]);

  return (
    <Spin spinning={isMeetingsLoading}>
      <FixedContentHeader>
        <InnerPageHeader
          title={
            !isMeetingsLoading ? `${meetings.length} bookmarked meetings` : ' '
          }
        />
      </FixedContentHeader>
      <S.StyledPage>
        <MeetingList />
      </S.StyledPage>
    </Spin>
  );
});
