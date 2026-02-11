import {
  useBoolean,
  useDebounceEffect,
  useInfiniteScroll,
  useInterval,
  useRequest,
} from 'ahooks';
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';
import noop from 'lodash/noop';
import { useCallback, useMemo } from 'react';

import { notificationApi } from 'src/transport/notification/notification.api';

import { INotifications, getLoadMoreList } from '../utils/notifications.api';

const PAGE_SIZE = 7;

export const useNotificationsData = (params: {
  isUnread?: boolean;
  onSetAsRead?: () => void;
  scrollRef: React.MutableRefObject<null>;
  removeSentNotificationId: (key: string) => void;
  notificationsIvViewSet: Set<string>;
  sentNotificationIds: Set<string>;
  addSentNotificationId: (key: string) => void;
  removeNotificationsIvView: (key: string) => void;
}) => {
  const {
    isUnread,
    onSetAsRead = noop,
    scrollRef,
    removeSentNotificationId,
    notificationsIvViewSet,
    sentNotificationIds,
    addSentNotificationId,
    removeNotificationsIvView,
  } = params;

  const [isFirstLoading, { setFalse: unsetIsFirstLoading }] = useBoolean(true);
  const [
    isLoadingAllRead,
    { setFalse: stopLoadingAllRead, setTrue: startLoadingAllRead },
  ] = useBoolean(false);

  const { run: setNotificationsAsRead } = useRequest(
    notificationApi.setNotificationsAsRead,
    {
      manual: true,
      onSuccess(_, [ids]) {
        ids.forEach((id: string) => {
          isUnread ? updateUnreadNotifications(id) : updateAllNotifications(id);
          removeSentNotificationId(id);
          removeNotificationsIvView(id);
        });
        onSetAsRead();
      },
      throttleWait: 1000,
      retryCount: 2,
    }
  );
  const { run: setNotificationAsRead } = useRequest(
    (id: string) => {
      const isRead = notificationsResult.data?.list?.find((n) => {
        return n.id === id && !n.readAt;
      });

      if (!isRead && !isUnread) return Promise.reject();
      return notificationApi.setNotificationAsRead(id);
    },
    {
      manual: true,
      onSuccess(_, [id]) {
        isUnread ? updateUnreadNotifications(id) : updateAllNotifications(id);
        isUnread ? notificationsResult.reload() : onSetAsRead();
      },
      throttleWait: 1000,
      retryCount: 2,
    }
  );

  const notificationsResult = useInfiniteScroll<INotifications>(
    (d) => {
      const page = d ? Math.ceil(d?.list.length / PAGE_SIZE) + 1 : 1;
      return getLoadMoreList(
        page,
        PAGE_SIZE,
        isUnread ? { isRead: false } : undefined
      );
    },
    {
      target: () => scrollRef.current,
      isNoMore: (notifications) =>
        notifications
          ? notifications?.list.length === notifications?.total
          : true,
      threshold: 200,
      onSuccess(data) {
        const allNotifications = [
          ...(data?.list || []),
          ...(notificationsResult?.data?.list || []),
        ];

        if (!allNotifications?.length) {
          return unsetIsFirstLoading();
        }
      },
    }
  );

  const refreshData = useCallback(() => {
    notificationsResult.reload();
  }, [notificationsResult]);

  useInterval(() => {
    refreshData();
  }, 30 * 1000);

  const { mutate, loadMore, loadingMore, noMore, reload } = notificationsResult;

  const updateAllNotifications = useCallback(
    (id: string) => {
      mutate((state) => {
        if (!state) return;
        const newList = state.list.map((notificationItem) => {
          if (notificationItem.id === id) {
            const n = cloneDeep(notificationItem);
            n.readAt = dayjs().valueOf().toString();

            return n;
          } else {
            return notificationItem;
          }
        });
        return { ...state, list: newList };
      });
    },
    [mutate]
  );

  const updateUnreadNotifications = useCallback(
    (id: string) => {
      mutate((state) => {
        if (!state) return;
        const newList = state.list.filter((notificationItem) => {
          return notificationItem.id !== id;
        });
        return { ...state, list: newList };
      });
    },
    [mutate]
  );

  const onScroll = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (event: any) => {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      if (
        scrollHeight - scrollTop - clientHeight < 50 &&
        !loadingMore &&
        !noMore
      ) {
        loadMore();
      }
    },
    [loadingMore, noMore, loadMore]
  );

  useDebounceEffect(
    () => {
      if (notificationsIvViewSet.size > 0) {
        const notificationIdsToSend = Array.from(notificationsIvViewSet).filter(
          (id) => !sentNotificationIds.has(id)
        );
        if (notificationIdsToSend.length > 0) {
          // setNotificationsAsRead(notificationIdsToSend);
          notificationIdsToSend.forEach((id) => addSentNotificationId(id));
        }
      }
    },
    [notificationsIvViewSet],
    {
      wait: 1000,
    }
  );

  const markAllAsRead = useCallback(() => {
    startLoadingAllRead();
    notificationApi
      .setNotificationAllAsRead()
      .then(() => {
        notificationsResult.mutate((state) => {
          if (!state) return;
          const newList = state.list.map((notification) => ({
            ...notification,
            readAt: dayjs().valueOf().toString(),
          }));
          return { ...state, list: newList };
        });
        onSetAsRead();
      })
      .finally(stopLoadingAllRead);
  }, [notificationsResult, onSetAsRead]);

  return useMemo(
    () => ({
      notificationsResult,
      ref: scrollRef,
      isFirstLoading,
      onScroll,
      reload,
      setNotificationsAsRead,
      setNotificationAsRead,
      markAllAsRead,
      isLoadingAllRead,
    }),
    [
      isFirstLoading,
      setNotificationsAsRead,
      notificationsResult,
      onScroll,
      scrollRef,
      reload,
      setNotificationAsRead,
      markAllAsRead,
      isLoadingAllRead,
    ]
  );
};
