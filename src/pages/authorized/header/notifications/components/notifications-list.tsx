import { Empty, Grid, List, ListProps } from 'antd';
import {
  OverlayScrollbarsComponent,
  OverlayScrollbarsComponentRef,
} from 'overlayscrollbars-react';
import { forwardRef } from 'react';

import { Stack } from 'src/components/common/Stack/Stack';
import { NotificationActivityListItemModelDTO } from 'src/transport/notification/notification.dto';
import { INotifications } from '../utils/notifications.api';
import { NotificationItem } from './notification-item';
import * as S from './notifications-list.styled';

const { useBreakpoint } = Grid;

interface NotificationsListProps
  extends ListProps<NotificationActivityListItemModelDTO> {
  data: INotifications | undefined;
  ref: React.RefObject<HTMLDivElement>;
  isUnread?: boolean;
  onScroll: (event: unknown) => void;
  notificationRefs: React.MutableRefObject<HTMLDivElement[]>;
  setAsRead: (id: string) => void;
  setDiscussionNotifications: (body: {
    postId: string;
    isEnabled: boolean;
  }) => void;
  isChangeDiscussionNotificationsLoading: (postId: string) => boolean;
}

export const NotificationsList = forwardRef<
  OverlayScrollbarsComponentRef,
  NotificationsListProps
>((props, ref) => {
  const {
    data,
    isUnread = false,
    onScroll,
    notificationRefs,
    setAsRead,
    setDiscussionNotifications,
    isChangeDiscussionNotificationsLoading,
    ...listProps
  } = props;

  const screens = useBreakpoint();

  return (
    <OverlayScrollbarsComponent
      element="div"
      options={{
        overflow: {
          x: 'hidden',
        },
      }}
      ref={ref}
      events={{
        scroll(_, event) {
          onScroll(event);
        },
      }}
    >
      <S.NotificationsListContainer
        $isMobile={screens.xs}
        id={!isUnread ? 'all' : 'unread'}
      >
        <List<NotificationActivityListItemModelDTO>
          {...(listProps || {})}
          dataSource={data?.list}
          locale={{
            emptyText: (
              <Stack distribution="center">
                <Empty
                  description={
                    isUnread
                      ? 'No unread notifications'
                      : 'No notifications yet'
                  }
                />
              </Stack>
            ),
          }}
          renderItem={(notification, idx) => (
            <NotificationItem
              setAsRead={() => setAsRead(notification.id)}
              notificationRefs={notificationRefs}
              dataSourceIdx={idx}
              notification={notification}
              setDiscussionNotifications={setDiscussionNotifications}
              isChangeDiscussionNotificationsLoading={
                isChangeDiscussionNotificationsLoading
              }
            />
          )}
        />
      </S.NotificationsListContainer>
    </OverlayScrollbarsComponent>
  );
});

NotificationsList.displayName = 'NotificationsList';
