import { FC, ReactNode, useMemo } from 'react';

import { Avatar, AvatarType } from 'src/components/common/Avatar/Avatar';
import {
  NotificationActivityListItemModelDTO,
  NotificationActivityType,
} from 'src/transport/notification/notification.dto';
// import { Stack } from 'src/ui-components/src/components/stack/stack';

import { NotificationByType } from './NotificationByType';
import * as C from './NotificationByType.components';
import * as S from './notifications-types.styled';
import { Stack } from 'src/components/common/Stack/Stack';

type TListItemProps = {
  title: ReactNode;
  description: ReactNode;
  notificationSeen?: boolean;
  avatar: string | null | undefined;
  id: string;
  dataSourceIdx: number;
  setAsRead?: () => void;
  notificationRefs: React.MutableRefObject<HTMLDivElement[]>;
  notification: NotificationActivityListItemModelDTO;
};

export const ListItem: FC<TListItemProps> = ({
  avatar,
  title,
  description,
  setAsRead,
  notificationSeen,
  id,
  dataSourceIdx,
  notificationRefs,
  notification,
}) => {
  const isHideNotification = useMemo(() => {
    return (
      notification?.activityType ===
        NotificationActivityType.NewActionResolutionToPost ||
      notification?.activityType ===
        NotificationActivityType.NewActionResolutionToComment
    );
  }, [notification?.activityType]);
  return (
    <S.ListItem
      ref={(el: HTMLDivElement) => {
        notificationRefs.current[dataSourceIdx] = el;
      }}
      id={id}
      hidden={isHideNotification}
      style={{
        display: isHideNotification ? 'none' : 'flex',
      }}
    >
      <S.ListItemMeta
        avatar={
          <Stack alignment="center" distribution="equalSpacing" spacing="tight">
            <C.MarkButton
              onClick={setAsRead}
              notificationSeen={notificationSeen}
            />

            <Avatar src={avatar} size={40} type={AvatarType.profile} />
          </Stack>
        }
        title={title}
        description={description}
      />
    </S.ListItem>
  );
};

type NotificationItemProps = {
  notification: NotificationActivityListItemModelDTO;
  dataSourceIdx: number;
  notificationRefs: React.MutableRefObject<HTMLDivElement[]>;
  setAsRead?: () => void;
  setDiscussionNotifications: (body: {
    postId: string;
    isEnabled: boolean;
  }) => void;
  isChangeDiscussionNotificationsLoading: (postId: string) => boolean;
};

export const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  dataSourceIdx,
  notificationRefs,
  setAsRead,
  setDiscussionNotifications,
  isChangeDiscussionNotificationsLoading,
}) => {
  const { id, readAt, activityType } = notification;

  const initiatorUser = notification?.initiatorUser;
  const avatar = initiatorUser?.avatar;
  const firstName = initiatorUser?.firstName;
  const lastName = initiatorUser?.lastName;
  return (
    <ListItem
      notification={notification}
      dataSourceIdx={dataSourceIdx}
      notificationRefs={notificationRefs}
      id={id}
      avatar={avatar}
      title={`${firstName} ${lastName}`}
      setAsRead={setAsRead}
      notificationSeen={!!readAt}
      description={
        <NotificationByType
          notification={notification}
          notificationType={activityType}
          setDiscussionNotifications={setDiscussionNotifications}
          isChangeDiscussionNotificationsLoading={
            isChangeDiscussionNotificationsLoading
          }
        />
      }
    />
  );
};
