import { Bell01, Bell04 } from '@untitled-ui/icons-react';
import { Button, Flex, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { isBoolean } from 'lodash';
import { FC, useMemo } from 'react';

import { Stack } from 'src/components/common/Stack/Stack';
import { SharedCommunitiesDropdown } from 'src/components/shared/communities/SharedCommunitiesDropdown';
import { components } from 'src/styled/definitions/colors';
import {
  AssetsTypeDescriptionEnum,
  AssetsTypeEnum,
  CommunitiyDto,
} from 'src/transport/communities/communities.dto';
import {
  NotificationActivityType as E,
  NotificationActivityListItemModelDTO,
} from 'src/transport/notification/notification.dto';
import { fileTypeIcons } from 'src/utils/file.tsx';

import { InternalLink } from 'src/components/common/Link/Link';
import * as C from './NotificationByType.components';
import * as S from './notifications-types.styled';

const { Text } = Typography;

type NotificationByTypeProps = {
  notificationType: E;
  notification: NotificationActivityListItemModelDTO;
  setDiscussionNotifications: (body: {
    postId: string;
    isEnabled: boolean;
  }) => void;
  isChangeDiscussionNotificationsLoading: (postId: string) => boolean;
};

export const NotificationByType: FC<NotificationByTypeProps> = ({
  notificationType,
  notification,
  setDiscussionNotifications,
  isChangeDiscussionNotificationsLoading,
}) => {
  const _notifications = useMemo(
    () => ({
      [E.NewOpenCommunityCreated]: (
        notification: NotificationActivityListItemModelDTO
      ) => {
        const communityName = notification?.community?.name;
        const communityId = notification?.community?.id;
        const title = (
          <C.NotificationTitle>
            A new open community has been created
          </C.NotificationTitle>
        );

        return (
          <Stack vertical wrap spacing="extraTight">
            {title}
            <Text>
              <C.CommunityLink
                communityId={communityId}
                communityName={communityName}
              />
            </Text>
          </Stack>
        );
      },
      [E.NewPostWasCreated]: (
        notification: NotificationActivityListItemModelDTO
      ) => {
        const postId = notification?.post?.id || '';
        const postTitle = notification?.post?.title || '';
        const postLabel = notification?.post?.label;
        // const postCreatedAt = notification?.post?.createdAt;

        const initiatorFirstName = notification?.initiatorUser?.firstName;
        const initiatorLastName = notification?.initiatorUser?.lastName;

        const communityName = notification?.community?.name;
        const communityId = notification?.community?.id;

        const postTags = notification?.post?.tags;

        const title = (
          <C.NotificationTitle>
            New Post for{' '}
            {
              <C.CommunityLink
                communityId={communityId}
                communityName={communityName}
              />
            }
          </C.NotificationTitle>
        );

        // const test = formatDate(postCreatedAt || '');
        const content = (
          <>
            <C.PostLink
              postId={postId}
              postTitle={postTitle}
              communityId={communityId}
            />
            <span>
              <C.Label postLabel={postLabel} iconOnly />
            </span>
            <C.Username fn={initiatorFirstName} ln={initiatorLastName} />
            <C.Tags tags={postTags} />
          </>
        );

        return (
          <Stack vertical wrap spacing="extraTight">
            {title}
            <Text>{content}</Text>
          </Stack>
        );
      },
      [E.YourPostWasApproved]: (
        notification: NotificationActivityListItemModelDTO
      ) => {
        const postId = notification?.post?.id || '';
        const postTitle = notification?.post?.title || '';

        const communityId = notification?.community?.id;

        const title = (
          <C.NotificationTitle>Your post has been approved</C.NotificationTitle>
        );

        return (
          <Stack vertical wrap spacing="extraTight">
            {title}
            <Text>
              <C.PostLink
                communityId={communityId}
                postId={postId}
                postTitle={postTitle}
              />
            </Text>
          </Stack>
        );
      },
      [E.YourPostWasCommented]: (
        notification: NotificationActivityListItemModelDTO
      ) => {
        const postId = notification?.post?.id || '';
        const postTitle = notification?.post?.title || '';

        const commentTotalLikes = notification?.commentTotalLikes || 0;
        const postTotalViews = notification?.postTotalViews || 0;
        const postTotalCommentsCount =
          notification?.postTotalCommentsCount || 0;

        const commentId = notification?.comment?.id;
        const isReply = !!notification?.comment?.parentCommentId;

        const communityId = notification?.community?.id;

        const title = (
          <C.NotificationTitle>
            {`${isReply ? 'Replies' : 'Comments'} to `}
            {
              <C.PostLink
                postId={postId}
                postTitle={postTitle}
                commentId={commentId}
                communityId={communityId}
              />
            }
          </C.NotificationTitle>
        );

        const content = (
          <>
            <C.PostLink
              postId={postId}
              postTitle={postTitle}
              commentId={commentId}
              communityId={communityId}
            />
            <C.TotalContainer
              totalComments={postTotalCommentsCount}
              totalLikes={commentTotalLikes}
              totalViews={postTotalViews}
            />
          </>
        );

        return (
          <Stack vertical wrap spacing="extraTight">
            {title}
            <Text>{content}</Text>
          </Stack>
        );
      },
      [E.PostInYourGroupWasCommented]: (
        notification: NotificationActivityListItemModelDTO
      ) => {
        const postId = notification?.post?.id || '';
        const postTitle = notification?.post?.title || '';

        const commentTotalLikes = notification?.commentTotalLikes || 0;
        const postTotalViews = notification?.postTotalViews || 0;
        const postTotalCommentsCount =
          notification?.postTotalCommentsCount || 0;

        const commentId = notification?.comment?.id;
        const isReply = !!notification?.comment?.parentCommentId;

        const communityId = notification?.community?.id;

        const title = (
          <C.NotificationTitle>
            {`${isReply ? 'Replies' : 'Comments'} to `}
            {
              <C.PostLink
                postId={postId}
                postTitle={postTitle}
                commentId={commentId}
                communityId={communityId}
              />
            }
          </C.NotificationTitle>
        );

        const content = (
          <>
            <C.PostLink
              postId={postId}
              postTitle={postTitle}
              commentId={commentId}
              communityId={communityId}
            />
            <C.TotalContainer
              totalComments={postTotalCommentsCount}
              totalLikes={commentTotalLikes}
              totalViews={postTotalViews}
            />
          </>
        );

        return (
          <Stack vertical wrap spacing="extraTight">
            {title}
            <Text>{content}</Text>
          </Stack>
        );
      },
      [E.PostWasUpdated]: (
        notification: NotificationActivityListItemModelDTO
      ) => {
        const postId = notification?.post?.id || '';
        const postTitle = notification?.post?.title || '';
        const postLabel = notification?.post?.label;

        const postTags = notification?.post?.tags;

        const postCreatorFirstName = notification?.post?.creatorFirstName || '';
        const postCreatorLastName = notification?.post?.creatorLastName || '';

        const communityName = notification?.community?.name;
        const communityId = notification?.community?.id;

        const title = (
          <C.NotificationTitle>
            Updated Post{' '}
            {
              <C.PostLink
                communityId={communityId}
                postId={postId}
                postTitle={postTitle}
              />
            }
          </C.NotificationTitle>
        );

        const content = (
          <>
            {
              <C.PostLink
                communityId={communityId}
                postId={postId}
                postTitle={postTitle}
              />
            }
            <span>
              <C.Label postLabel={postLabel} iconOnly />
            </span>
            <Text> Originally posted in </Text>
            <C.CommunityLink
              communityId={communityId}
              communityName={communityName}
            />
            {postCreatorFirstName && postCreatorLastName && <Text> by </Text>}
            {postCreatorFirstName && postCreatorLastName && (
              <C.Username fn={postCreatorFirstName} ln={postCreatorLastName} />
            )}
            <C.Tags tags={postTags} />
          </>
        );

        return (
          <Stack vertical wrap spacing="extraTight">
            {title}
            <Text>{content}</Text>
          </Stack>
        );
      },
      [E.NewPostWasShared]: (
        notification: NotificationActivityListItemModelDTO
      ) => {
        const postId = notification?.post?.id || '';
        const postTitle = notification?.post?.title || '';
        const postLabel = notification?.post?.label;
        const postTags = notification?.post?.tags;

        const postCreatorFirstName = notification?.post?.creatorFirstName || '';
        const postCreatorLastName = notification?.post?.creatorLastName || '';

        const communityName = notification?.community?.name;
        const communityId = notification?.community?.id;
        const sharedCommunities = notification?.post?.secondaryCommunities;
        const sharedCommunitiesCount = sharedCommunities?.length ?? 0;
        const communityWord =
          sharedCommunitiesCount === 1 ? 'community' : 'communities';

        const title = (
          <C.NotificationTitle>
            {`New post shared with ${sharedCommunitiesCount} ${communityWord}`}

            <SharedCommunitiesDropdown
              data={
                sharedCommunities?.map((community) => ({
                  community,
                })) as unknown as CommunitiyDto[]
              }
              buttonProps={{
                size: 'small',
                type: 'link',
                style: { display: 'inline-flex', verticalAlign: 'bottom' },
              }}
              iconProps={{ width: 20, height: 20 }}
              isLoading={false}
              isDisabled={false}
              secondaryCommunitiesLength={sharedCommunitiesCount}
            />
          </C.NotificationTitle>
        );

        const content = (
          <>
            <C.PostLink
              communityId={communityId}
              postId={postId}
              postTitle={postTitle}
            />
            <span>
              <C.Label postLabel={postLabel} iconOnly />
            </span>
            <Text> Originally posted in </Text>
            <C.CommunityLink
              communityId={communityId}
              communityName={communityName}
            />
            {postCreatorFirstName && postCreatorLastName && (
              <>
                {`, `}
                <C.Username
                  fn={postCreatorFirstName}
                  ln={postCreatorLastName}
                />
              </>
            )}
            <C.Tags tags={postTags} />
          </>
        );

        return (
          <Stack vertical wrap spacing="extraTight">
            {title}
            <Text>{content}</Text>
          </Stack>
        );
      },
      [E.NewActionRequestToPost]: (
        notification: NotificationActivityListItemModelDTO
      ) => {
        const postId = notification?.post?.id || '';
        const postTitle = notification?.post?.title || '';

        const initiatorUserFn = notification?.initiatorUser?.firstName;
        const initiatorUserLn = notification?.initiatorUser?.lastName;

        const communityId = notification?.community?.id;

        const actionType = notification?.post?.reports?.[0];

        const title = (
          <C.NotificationTitle>
            New Action Request for{' '}
            {
              <C.PostLink
                communityId={communityId}
                postId={postId}
                postTitle={postTitle}
              />
            }
          </C.NotificationTitle>
        );
        const content = (
          <>
            {
              <C.PostLink
                communityId={communityId}
                postId={postId}
                postTitle={postTitle}
              />
            }
            <Text> - Action: </Text>
            <C.ReportTypeTitle reportType={actionType?.type} />
            <Text>{` - ${actionType?.message} by`}</Text>
            <C.Username fn={initiatorUserFn} ln={initiatorUserLn} />
          </>
        );
        return (
          <Stack vertical wrap spacing="extraTight">
            {title}
            <Text>{content}</Text>
          </Stack>
        );
      },
      [E.NewActionRequestToComment]: (
        notification: NotificationActivityListItemModelDTO
      ) => {
        const postId = notification?.post?.id || '';
        const postTitle = notification?.post?.title || '';

        const initiatorUserFn = notification?.initiatorUser?.firstName;
        const initiatorUserLn = `${notification?.initiatorUser?.lastName} `;

        const commentId = notification?.comment?.id;
        const commentUserFn = notification?.comment?.creatorFirstName;
        const commentUserLn = notification?.comment?.creatorLastName;

        const communityId = notification?.community?.id;

        const title = (
          <C.NotificationTitle>
            New Action Request for comment/Reply in{' '}
            {
              <C.PostLink
                postId={postId}
                postTitle={postTitle}
                commentId={commentId}
                communityId={communityId}
              />
            }
          </C.NotificationTitle>
        );

        const content = (
          <>
            <C.PostLink
              postId={postId}
              postTitle={postTitle}
              commentId={commentId}
              communityId={communityId}
            />
            <Text>{` Comment/reply by: `}</Text>
            <C.Username fn={commentUserFn} ln={commentUserLn} />
            <Text strong> - Action: Report</Text>
            <Text>{` by:`}</Text>
            <C.Username fn={initiatorUserFn} ln={initiatorUserLn} />
          </>
        );

        return (
          <Stack vertical wrap spacing="extraTight">
            {title}
            <Text>{content}</Text>
          </Stack>
        );
      },
      [E.NewActionResolutionToPost]: () => {
        return 'NO RENDERER';
      },
      [E.NewActionResolutionToComment]: () => {
        return 'NO RENDERER';
      },
      [E.NewAssetWasCreated]: (
        notification: NotificationActivityListItemModelDTO
      ) => {
        const communityName = notification?.community?.name;
        const communityId = notification?.community?.id;
        const fileType = notification?.asset?.type
          ? AssetsTypeEnum[notification.asset.type].toLowerCase()
          : '';
        const fileTypeIcon = fileTypeIcons[fileType || 'default'];
        const fileDescription =
          AssetsTypeDescriptionEnum[
            (fileType as keyof typeof AssetsTypeDescriptionEnum) || 'default'
          ];

        return (
          <Stack vertical wrap spacing="extraTight">
            <C.NotificationTitle>
              A new {fileDescription} added to the community{' '}
              <C.CommunityLink
                communityId={communityId}
                communityName={communityName}
              />
              <C.AssetIcon
                icon={fileTypeIcon}
                fileName={notification.asset?.name + '.' + fileType}
                communityId={communityId}
              />
            </C.NotificationTitle>
          </Stack>
        );
      },
      [E.NewMeetWasCreated]: (
        notification: NotificationActivityListItemModelDTO
      ) => {
        const communityName = notification?.community?.name;
        const communityId = notification?.community?.id;

        return (
          <Stack vertical wrap spacing="extraTight">
            <C.NotificationTitle>
              A new meeting{' '}
              <Text italic>
                <InternalLink
                  href={`communities/${communityId}/meetings?meetingId=${notification.meet?.id}`}
                >
                  {notification.meet?.name}
                </InternalLink>
              </Text>{' '}
              has been added to the community{' '}
              <C.CommunityLink
                communityId={communityId}
                communityName={communityName}
              />
            </C.NotificationTitle>
          </Stack>
        );
      },
      [E.NewAddedMember]: (
        notification: NotificationActivityListItemModelDTO
      ) => {
        const communityName = notification?.community?.name;
        const communityId = notification?.community?.id;

        return (
          <Stack vertical wrap spacing="extraTight">
            <C.NotificationTitle>
              A new member{' '}
              <Text italic>{notification.member?.memberFullName}</Text> has been
              added to the community{' '}
              <C.CommunityLink
                communityId={communityId}
                communityName={communityName}
              />
            </C.NotificationTitle>
          </Stack>
        );
      },
      [E.NewBlockedMember]: (
        notification: NotificationActivityListItemModelDTO
      ) => {
        const communityName = notification?.community?.name;
        const communityId = notification?.community?.id;

        return (
          <Stack vertical wrap spacing="extraTight">
            <C.NotificationTitle>
              Member <Text italic>{notification.member?.memberFullName}</Text>{' '}
              was removed from the community{' '}
              <C.CommunityLink
                communityId={communityId}
                communityName={communityName}
              />
            </C.NotificationTitle>
          </Stack>
        );
      },
      [E.NewAwaitingMember]: (
        notification: NotificationActivityListItemModelDTO
      ) => {
        const communityName = notification?.community?.name;
        const communityId = notification?.community?.id;

        return (
          <Stack vertical wrap spacing="extraTight">
            <C.NotificationTitle>
              User <Text italic>{notification.member?.memberFullName}</Text>{' '}
              wants to join the community{' '}
              <C.AdminCommunityLink
                communityId={communityId}
                communityName={communityName}
              />
            </C.NotificationTitle>
          </Stack>
        );
      },
    }),
    []
  );

  const _n = useMemo(
    () => _notifications[notificationType]?.(notification),
    [_notifications, notification, notificationType]
  );

  return (
    <Stack vertical wrap spacing="none">
      {_n ? (
        <>
          {_n}
          <Flex justify="space-between" align="center">
            <S.Date>{dayjs(notification?.createdAt).fromNow()}</S.Date>
            {(notificationType === E.YourPostWasCommented ||
              notificationType === E.PostInYourGroupWasCommented) &&
              isBoolean(notification?.postNotificationStatus) && (
                <Tooltip
                  title={`Turn ${notification?.postNotificationStatus ? 'off' : 'on'} notifications for this discussion`}
                >
                  <Button
                    type="text"
                    size="small"
                    loading={isChangeDiscussionNotificationsLoading(
                      notification?.post?.id as string
                    )}
                    icon={
                      notification?.postNotificationStatus ? (
                        <Bell04
                          color={components?.colors?.brandColor}
                          height={12}
                          width={12}
                        />
                      ) : (
                        <Bell01 color="gray" height={12} width={12} />
                      )
                    }
                    style={{ marginRight: 20 }}
                    onClick={() =>
                      setDiscussionNotifications({
                        postId: notification?.post?.id as string,
                        isEnabled: !notification?.postNotificationStatus,
                      })
                    }
                  />
                </Tooltip>
              )}
          </Flex>
        </>
      ) : (
        '[NO RENDERER FOR NOTIFICATION EVENT]'
      )}
    </Stack>
  );
};
