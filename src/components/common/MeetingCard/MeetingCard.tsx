import {
  ChevronDown,
  ChevronUp,
  DownloadCloud02,
} from '@untitled-ui/icons-react';

import { useBoolean } from 'ahooks';
import { Button, Flex, notification, Spin, Typography } from 'antd';
import dayjs from 'dayjs';
import { forwardRef, ReactNode, useCallback, useState } from 'react';
import { Card } from 'src/components/common/Card/Card.tsx';
import ClickCopyItem from 'src/components/common/ClickCopyItem/ClickCopyItem';
import { Divider } from 'src/components/common/Divider/Divider.tsx';
import ImagePlaceholder from 'src/components/common/ImagePlaceholder/ImagePlaceholder.tsx';
import MeetingBookmark from 'src/components/common/MeetingCard/MeetingBookmark.tsx';
import { MeetingDropdown } from 'src/components/common/MeetingCard/MeetingDropdown.tsx';
import { getMeetingBadge } from 'src/components/common/MeetingCard/utils';
import { Title } from 'src/components/common/Typography/Title.tsx';
import { MEETING_VISIBILITY } from 'src/pages/admin-pages/admin-community/__components/share_meeting_modal/const.tsx';
import { AttachmentsList } from 'src/pages/community-pages/community-post-details/__components/attachments-list/attachments-list.tsx';
import { components } from 'src/styled/definitions/colors.ts';
import {
  CommunityMeeting,
  ExploreMeet,
} from 'src/transport/communities/communities.dto';
import { dateMeetingFormat } from 'src/utils/date-time.ts';
import { Stack } from '../Stack/Stack';
import { useCopyMeetingUrl } from './hooks/useCopyMeetingUrl.tsx';
import { MeetingActionsDropdown } from './MeetingActionsDropdown.tsx';
import * as S from './MeetingCard.styled.ts';
import { useAssets } from './useAssets.ts';
import { downloadFile } from './utils/index.tsx';

const { Text, Paragraph } = Typography;

type MeetingCardProps = {
  meeting: CommunityMeeting | ExploreMeet;
  onEditClick?: () => void;
  handleInviteMembersClick?: () => void;
  handleShareMeetingClick?: () => void;
  children: ReactNode;
  isHighlighted?: boolean;
  communityId: string;
  communityAlias?: string;
  cardHeader?: ReactNode;
  isFavorite?: boolean;
  bgColor?: string;
  disableCollapsing?: boolean;
  canActionMeeting?: boolean;
  reloadMeetings?: () => void;
  imagePlaceholder?: boolean;
};

export const MeetingCard = forwardRef<HTMLDivElement, MeetingCardProps>(
  (
    {
      meeting,
      onEditClick,
      children,
      isHighlighted = false,
      disableCollapsing = false,
      communityId,
      communityAlias,
      cardHeader = null,
      isFavorite,
      bgColor,
      canActionMeeting = true,
      reloadMeetings,
      handleInviteMembersClick,
      handleShareMeetingClick,
      imagePlaceholder = false,
    },
    ref
  ) => {
    const [isDownloading, { set: setIsDownloading }] = useBoolean(false);
    const [isFetchEnabled, { setTrue: setTrueFetchEnabled }] =
      useBoolean(disableCollapsing);
    const [isExpanded, setIsExpanded] = useState(false);

    const { meetingAssets, isLoading: isAttachmentsLoading } = useAssets(
      meeting,
      communityId,
      isFetchEnabled // when it`s changed, fetch assets
    );

    const { handleCopy } = useCopyMeetingUrl(
      meeting.id,
      communityId,
      communityAlias
    );

    const formattedDate = dayjs(meeting.startDate).format(dateMeetingFormat);

    const downloadAllFiles = useCallback(async () => {
      setIsDownloading(true);
      try {
        const downloadPromises = meetingAssets.map((asset) =>
          downloadFile(asset.path, asset?.name)
        );
        await Promise.all(downloadPromises);
      } catch {
        notification.error({ message: 'Error downloading files' });
      } finally {
        setIsDownloading(false);
      }
    }, [meetingAssets, setIsDownloading]);

    return (
      <S.HighlightedCard
        ref={ref}
        id={`meeting-${meeting.id}`}
        $isHighlighted={isHighlighted}
        $bgColor={bgColor}
      >
        {meeting.imageUrl && (
          <img
            alt="cover"
            src={meeting.imageUrl}
            style={{ width: '100%', aspectRatio: 3 }}
          />
        )}
        {!meeting.imageUrl && imagePlaceholder && (
          <ImagePlaceholder style={{ width: '100%', aspectRatio: 3 }} />
        )}
        <S.MeetingCardContent vertical spacing="tight">
          <Stack distribution="equalSpacing" wrap={false}>
            <Stack vertical>
              {cardHeader}
              <Stack alignment="center">
                <S.StartTime strong>{formattedDate}</S.StartTime>
                {getMeetingBadge[meeting.visible as MEETING_VISIBILITY]}
              </Stack>
            </Stack>
            {onEditClick &&
            handleInviteMembersClick &&
            handleShareMeetingClick ? (
              <MeetingDropdown
                meeting={meeting}
                canActionMeeting={canActionMeeting}
                onEditClick={onEditClick}
                handleInviteMembersClick={handleInviteMembersClick}
                handleShareMeetingClick={handleShareMeetingClick}
              />
            ) : (
              <Stack alignment="center" spacing="extraTight">
                <MeetingBookmark
                  initIsFavorite={!!isFavorite}
                  communityId={communityId}
                  metingId={meeting.id}
                  reloadMeetings={reloadMeetings}
                />
                <MeetingActionsDropdown
                  meeting={meeting}
                  handleCopy={handleCopy}
                />
              </Stack>
            )}
          </Stack>
          <Stack vertical spacing="extraLoose">
            <S.Collapse
              $bgColor={bgColor}
              $cursor={disableCollapsing ? 'default' : ''}
              defaultActiveKey={disableCollapsing ? [meeting.id] : undefined}
              collapsible={disableCollapsing ? 'disabled' : undefined}
              onChange={(activeKeys) => {
                setTrueFetchEnabled();
                setIsExpanded(activeKeys.includes(meeting.id));
              }}
              expandIcon={({ isActive }) => {
                if (disableCollapsing) return null;
                return isActive ? <ChevronUp /> : <ChevronDown />;
              }}
              items={[
                {
                  key: meeting.id,
                  label: (
                    <Paragraph ellipsis={!isExpanded ? { rows: 2 } : false}>
                      <Title level={4}>{meeting.name}</Title>
                    </Paragraph>
                  ),
                  children: (
                    <Stack vertical spacing="loose">
                      <Text>{meeting.description}</Text>
                      <Spin spinning={isAttachmentsLoading}>
                        {meetingAssets?.length !== 0 ? (
                          <Card>
                            <Flex
                              align="center"
                              justify="space-between"
                              style={{ marginBottom: 10 }}
                            >
                              <Title level={5}>Attachments</Title>

                              <Button
                                onClick={downloadAllFiles}
                                icon={
                                  <DownloadCloud02
                                    color={components.colors.brandColor}
                                    width={14}
                                    height={14}
                                  />
                                }
                                style={{
                                  color: components.colors.brandColor,
                                  fontWeight: 'bold',
                                }}
                                size="small"
                                type="text"
                                loading={isDownloading}
                              >
                                Download all
                              </Button>
                            </Flex>

                            <AttachmentsList
                              attachments={meetingAssets}
                              label={null}
                            />
                          </Card>
                        ) : (
                          <Divider spacing="none" />
                        )}
                      </Spin>

                      <Stack spacing="extraLoose">
                        {meeting.meetingId && (
                          <Stack vertical spacing="none">
                            <Text>Meeting ID</Text>
                            <ClickCopyItem text={meeting.meetingId} />
                          </Stack>
                        )}
                        {meeting.meetingPassword && (
                          <Stack vertical spacing="none">
                            <Text>Meeting password</Text>
                            <ClickCopyItem text={meeting.meetingPassword} />
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                  ),
                },
              ]}
              expandIconPosition="end"
            />
            {children}
          </Stack>
        </S.MeetingCardContent>
      </S.HighlightedCard>
    );
  }
);

MeetingCard.displayName = 'MeetingCard';
