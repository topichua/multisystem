import { useBoolean, useSet, useUpdateEffect } from 'ahooks';
import { Col, ConfigProvider, Grid, TabsProps } from 'antd';
import { noop } from 'lodash';
import { observer } from 'mobx-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// import { postApi } from 'src/transport/post/post.api';
import {
  NotificationDrawer,
  NotificationPopover,
  TabsHeader,
} from './components/notifications-content';
import { NotificationsList } from './components/notifications-list';
import { useDefaultActiveKey } from './hooks/useDefaultActiveKey';
import { useNotificationsData } from './hooks/useNotificationsData';
import * as S from './notifications.styled';
import { NotificationsTabsEnum } from './utils/notifications.types';

const { useBreakpoint } = Grid;

export const Notifications = observer(() => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDrawerOpen, { toggle: toggleDrawerOpen }] = useBoolean(false);

  const [activeTabKey, setActiveTabKey] = useState<NotificationsTabsEnum>(
    NotificationsTabsEnum.ALL
  );
  const location = useLocation();

  const [allNotificationsIvViewSet, { remove: removeAllNotificationsIvView }] =
    useSet<string>([]);
  // const [set, { add, remove }] = useSet<string>([]);

  const [
    unreadNotificationsIvViewSet,
    { remove: removeUnreadNotificationsIvView },
  ] = useSet<string>([]);

  const [
    sentNotificationIds,
    { add: addSentNotificationId, remove: removeSentNotificationId },
  ] = useSet<string>();

  const allNotificationsRef = useRef(null);
  const allNotificationsMobileRef = useRef(null);
  const allNotificationRefs = useRef<HTMLDivElement[]>([]);

  const unreadNotificationsRef = useRef(null);
  const unreadNotificationsMobileRef = useRef(null);
  const unreadNotificationRefs = useRef<HTMLDivElement[]>([]);

  const screens = useBreakpoint();

  const isMobile = useMemo(() => {
    return screens.xs;
  }, [screens.xs]);

  const {
    notificationsResult: unreadNotificationsResult,
    onScroll: onUnreadScroll,
    setNotificationAsRead: setUnreadNotificationAsRead,
  } = useNotificationsData({
    isUnread: true,
    scrollRef: isMobile ? unreadNotificationsMobileRef : unreadNotificationsRef,
    removeSentNotificationId,
    notificationsIvViewSet: unreadNotificationsIvViewSet,
    addSentNotificationId,
    removeNotificationsIvView: removeUnreadNotificationsIvView,
    sentNotificationIds,
  });

  const { data: unreadNotifications, reload: reloadNotifications } =
    unreadNotificationsResult;

  const {
    notificationsResult: allNotificationsResult,
    onScroll: onAllScroll,
    setNotificationAsRead,
    markAllAsRead,
    isLoadingAllRead,
  } = useNotificationsData({
    isUnread: false,
    onSetAsRead: reloadNotifications,
    scrollRef: isMobile ? allNotificationsMobileRef : allNotificationsRef,
    removeSentNotificationId,
    notificationsIvViewSet: allNotificationsIvViewSet,
    addSentNotificationId,
    removeNotificationsIvView: removeAllNotificationsIvView,
    sentNotificationIds,
  });

  const { data: allNotifications } = allNotificationsResult;

  // const {
  //   run: setDiscussionNotifications,
  //   loading: setDiscussionNotificationsLoading,
  // } = useRequest(postApi.setDiscussionNotifications, {
  //   manual: true,
  //   onSuccess(_, params) {
  //     const mutateList = (state: INotifications | undefined) => {
  //       if (!state) return;
  //       const newList = state.list.map((notificationItem) => {
  //         if (
  //           notificationItem?.post?.id === params[0]?.postId &&
  //           isBoolean(notificationItem?.postNotificationStatus)
  //         ) {
  //           const n = cloneDeep(notificationItem);
  //           n.postNotificationStatus = params[0]?.isEnabled;
  //           return n;
  //         } else return notificationItem;
  //       });
  //       return { ...state, list: newList };
  //     };

  //     allNotificationsResult.mutate(mutateList);
  //     unreadNotificationsResult.mutate(mutateList);
  //   },
  //   onBefore([body]) {
  //     add(body.postId);
  //   },
  //   onFinally([body]) {
  //     remove(body.postId);
  //   },
  // });

  // const isChangeDiscussionNotificationsLoading = useCallback(
  //   (postId: string) => setDiscussionNotificationsLoading && set.has(postId),
  //   [setDiscussionNotificationsLoading, set],
  // );
  const isChangeDiscussionNotificationsLoading = useCallback(
    (postId: string) => !postId,
    []
  );

  const items: TabsProps['items'] = useMemo(
    () => [
      {
        key: NotificationsTabsEnum.ALL,
        label: 'All',
        children: (
          <NotificationsList
            setAsRead={setNotificationAsRead}
            onScroll={onAllScroll}
            data={allNotifications}
            ref={isMobile ? allNotificationsMobileRef : allNotificationsRef}
            notificationRefs={allNotificationRefs}
            isUnread={false}
            setDiscussionNotifications={noop}
            isChangeDiscussionNotificationsLoading={
              isChangeDiscussionNotificationsLoading
            }
          />
        ),
      },
      {
        key: NotificationsTabsEnum.UNREAD,
        label: 'Unread',
        children: (
          <NotificationsList
            isUnread
            setAsRead={setUnreadNotificationAsRead}
            onScroll={onUnreadScroll}
            data={unreadNotifications}
            ref={
              isMobile ? unreadNotificationsMobileRef : unreadNotificationsRef
            }
            notificationRefs={unreadNotificationRefs}
            setDiscussionNotifications={noop}
            isChangeDiscussionNotificationsLoading={
              isChangeDiscussionNotificationsLoading
            }
          />
        ),
      },
    ],
    [
      allNotifications,
      isChangeDiscussionNotificationsLoading,
      isMobile,
      onAllScroll,
      onUnreadScroll,
      setNotificationAsRead,
      setUnreadNotificationAsRead,
      unreadNotifications,
    ]
  );

  const titleCounter = useMemo(() => {
    return activeTabKey === NotificationsTabsEnum.ALL
      ? allNotifications?.total || 0
      : unreadNotifications?.total || 0;
  }, [activeTabKey, allNotifications?.total, unreadNotifications?.total]);

  const _handleChangePopover = useCallback<(open: boolean) => void>(
    (visible) => {
      if (visible && unreadNotifications?.total) {
        setActiveTabKey(NotificationsTabsEnum.UNREAD);
      }
      setIsPopoverOpen(visible);
    },
    [unreadNotifications?.total]
  );

  const [handleChangePopover, clearSearchParams] = useDefaultActiveKey(
    setActiveTabKey,
    isMobile ? toggleDrawerOpen : setIsPopoverOpen,
    _handleChangePopover
  );

  useUpdateEffect(() => {
    setIsPopoverOpen(false);
  }, [location?.pathname]);

  useEffect(() => {
    if (isDrawerOpen && unreadNotifications?.total) {
      setActiveTabKey(NotificationsTabsEnum.UNREAD);
    }
    if (isMobile && !isDrawerOpen) {
      clearSearchParams();
    }
  }, [clearSearchParams, isDrawerOpen, isMobile, unreadNotifications?.total]);

  const content = (
    <S.PopoverContentWrapper gutter={[0, 16]}>
      {!isMobile && (
        <Col xs={24}>
          <TabsHeader titleCounter={titleCounter} />
        </Col>
      )}
      <Col xs={24}>
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                horizontalItemGutter: 20,
                horizontalMargin: '0',
              },
            },
          }}
        >
          <S.Tabs
            onChange={(tabKey: string) =>
              setActiveTabKey(tabKey as NotificationsTabsEnum)
            }
            size="small"
            defaultActiveKey={activeTabKey}
            activeKey={activeTabKey}
            items={items}
            animated
            $isMobile={isMobile}
          />
          <S.MarkAllAsRead
            loading={isLoadingAllRead}
            type="link"
            onClick={markAllAsRead}
          >
            Mark all as read
          </S.MarkAllAsRead>
        </ConfigProvider>
      </Col>
    </S.PopoverContentWrapper>
  );

  return screens.xs ? (
    <NotificationDrawer
      isDrawerOpen={isDrawerOpen}
      content={content}
      toggleDrawerOpen={toggleDrawerOpen}
      count={unreadNotifications?.total}
      titleCounter={titleCounter}
    />
  ) : (
    <NotificationPopover
      isPopoverOpen={isPopoverOpen}
      onOpenChange={handleChangePopover}
      content={content}
      count={unreadNotifications?.total}
    />
  );
});
