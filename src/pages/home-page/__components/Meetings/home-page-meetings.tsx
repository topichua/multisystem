import { VideoRecorder } from '@untitled-ui/icons-react';
import { useUpdateEffect } from 'ahooks';
import { Affix, Col, ColProps, Empty, Flex, Typography } from 'antd';
import isNil from 'lodash/isNil';
import { FC, useCallback, useMemo, useRef, useState } from 'react';

import { MainNewsTextSkeleton } from 'src/components/common/ArticleCard/ArticleCard.styled.tsx';

import { Avatar, AvatarType } from 'src/components/common/Avatar/Avatar.tsx';
import { MeetingCard } from 'src/components/common/MeetingCard/MeetingCard.tsx';
import MeetingStatusDropdown from 'src/components/common/MeetingCard/MeetingStatusDropdown.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { useDashboardMeetings } from 'src/pages/home-page/hooks/useDashboardMeetings.ts';
import * as ES from '../../home.page.styled.tsx';
import { HomePageMeetingsHeader } from './home-page-meetings-header.tsx';

const { Text } = Typography;
const COL_LAYOUT: ColProps = {
  xxl: 12,
  xl: 12,
  lg: 12,
  md: 12,
  sm: 12,
  xs: 24,
};

export const HomePageMeetings: FC = () => {
  const { dashBoardMeetings, isDashboardMeetingsLoading, updateMeetingStatus } =
    useDashboardMeetings();
  const headerWrapperRef = useRef<HTMLDivElement | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = useCallback(() => setIsExpanded((prev) => !prev), []);

  const visibleMeetings = useMemo(
    () => (isExpanded ? dashBoardMeetings : dashBoardMeetings?.slice(0, 2)),
    [dashBoardMeetings, isExpanded]
  );

  useUpdateEffect(() => {
    if (headerWrapperRef.current && !isExpanded) {
      headerWrapperRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isExpanded]);

  return (
    <ES.Section>
      <ES.SectionWrapper>
        <Flex
          gap={16}
          vertical
          style={{
            position: 'relative',
          }}
          ref={headerWrapperRef}
        >
          <Affix offsetTop={isExpanded ? 68 : 0}>
            <HomePageMeetingsHeader
              isOpen={isExpanded}
              onToggle={toggleExpand}
              showToggle={!!(dashBoardMeetings && dashBoardMeetings.length > 3)}
            />
          </Affix>

          <ES.StyledMeetingBlock gutter={[16, 16]}>
            {isDashboardMeetingsLoading &&
              [1, 2].map((id) => {
                return (
                  <Col {...COL_LAYOUT} key={id}>
                    <MainNewsTextSkeleton
                      active
                      paragraph={{ rows: 4 }}
                      avatar={false}
                    />
                  </Col>
                );
              })}

            {!isNil(visibleMeetings) &&
              !isDashboardMeetingsLoading &&
              visibleMeetings?.map(({ meet, status, isFavorite }) => (
                <Col key={meet.id} {...COL_LAYOUT}>
                  <MeetingCard
                    imagePlaceholder
                    meeting={meet}
                    communityId={meet?.communityId || ''}
                    isFavorite={isFavorite}
                    bgColor="#FCFCFD"
                    cardHeader={
                      <Stack alignment="center">
                        <Avatar
                          shape="square"
                          type={AvatarType.organisations}
                          avatarSrc={meet?.community?.imageUrl}
                        />
                        <Text strong>{meet?.community?.name}</Text>
                      </Stack>
                    }
                  >
                    <Stack alignment="center">
                      {meet.meetingLink && (
                        <Stack alignment="trailing">
                          <MeetingStatusDropdown
                            meet={meet}
                            status={status}
                            updateMeetingStatus={updateMeetingStatus}
                            communityId={meet?.communityId || ''}
                            isFavorite={isFavorite}
                          />
                          <ES.StyledButtonMeeting
                            type="link"
                            href={meet.meetingLink}
                            target="_blank"
                            color="red"
                          >
                            <VideoRecorder height={20} />
                            <Text strong> Join meeting</Text>
                          </ES.StyledButtonMeeting>
                        </Stack>
                      )}
                    </Stack>
                  </MeetingCard>
                </Col>
              ))}

            {!visibleMeetings?.length && !isDashboardMeetingsLoading && (
              <Stack
                style={{ width: '100%' }}
                alignment="center"
                distribution="center"
              >
                <Empty description="No upcoming meetings" />
              </Stack>
            )}
          </ES.StyledMeetingBlock>
        </Flex>
      </ES.SectionWrapper>
    </ES.Section>
  );
};
