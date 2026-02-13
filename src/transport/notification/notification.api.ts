import {
  NotificationActivityListItemModelDTO,
  NotificationActivityType,
  NotificationResponse,
} from './notification.dto';

export interface NotificationsResponseParams {
  page?: number;
  pageSize?: number;
  communityId?: string;
  isRead?: boolean;
}

export interface SetAsReadNotificationsParams {
  ids: string[];
}

const now = new Date().toISOString();
const MOCK_NOTIFICATIONS: NotificationActivityListItemModelDTO[] = [
  {
    id: 'notif-1',
    activityType: NotificationActivityType.YourPostWasCommented,
    readAt: null,
    createdAt: now,
    initiatorUser: {
      id: 'user-2',
      firstName: 'Jordan',
      lastName: 'Lee',
      avatar: undefined,
    },
    community: { id: 'community-1', name: 'Security Operations' },
    post: {
      id: 'mock-post-1',
      title: 'Q4 security review summary',
      createdAt: now,
      updatedAt: now,
      reports: [],
      tags: [{ id: 'tag-1', name: 'Incident' }],
      secondaryCommunities: [],
    },
    comment: {
      id: 'comment-1',
      body: 'Thanks for sharing. I’ve forwarded this to the ops team.',
      createdAt: now,
      reports: [],
      createdByUserId: 'user-2',
      parentCommentId: null,
    },
    commentTotalLikes: 2,
    postTotalViews: 42,
    postTotalCommentsCount: 3,
  },
  {
    id: 'notif-2',
    activityType: NotificationActivityType.YourPostWasApproved,
    readAt: null,
    createdAt: now,
    initiatorUser: {
      id: 'user-1',
      firstName: 'Alex',
      lastName: 'Morgan',
      avatar: undefined,
    },
    community: { id: 'community-2', name: 'Incident Response' },
    post: {
      id: 'mock-post-2',
      title: 'Incident response playbook update',
      createdAt: now,
      updatedAt: now,
      reports: [],
      tags: [{ id: 'tag-2', name: 'Policy' }],
      secondaryCommunities: [],
    },
    postTotalViews: 18,
    postTotalCommentsCount: 0,
  },
  {
    id: 'notif-3',
    activityType: NotificationActivityType.NewMeetWasCreated,
    readAt: null,
    createdAt: now,
    initiatorUser: {
      id: 'user-3',
      firstName: 'Sam',
      lastName: 'Chen',
      avatar: undefined,
    },
    community: { id: 'community-1', name: 'Security Operations' },
    meet: {
      id: 'mock-meet-1',
      communityId: 'community-1',
      name: 'Incident review',
      createdAt: now,
      createdByUserId: 'user-3',
      creatorFirstName: 'Sam',
      creatorLastName: 'Chen',
      creatorFullName: 'Sam Chen',
    },
  },
  {
    id: 'notif-4',
    activityType: NotificationActivityType.NewAddedMember,
    readAt: now,
    createdAt: now,
    initiatorUser: {
      id: 'user-4',
      firstName: 'Casey',
      lastName: 'Martinez',
      avatar: undefined,
    },
    community: { id: 'community-2', name: 'Incident Response' },
    member: {
      id: 'member-1',
      communityId: 'community-2',
      userId: 'user-5',
      memberFirstName: 'Riley',
      memberLastName: 'Wilson',
      memberFullName: 'Riley Wilson',
      status: 1,
      createdAt: now,
      creatorFirstName: 'Casey',
      creatorLastName: 'Martinez',
      creatorFullName: 'Casey Martinez',
    },
  },
];

export const notificationApi = {
  getNotifications(
    params: NotificationsResponseParams = {
      page: 1,
      pageSize: 7,
      isRead: false,
    }
  ): Promise<NotificationResponse> {
    const {
      page = 1,
      pageSize = 7,
      communityId = null,
      isRead = false,
    } = params;

    let list = MOCK_NOTIFICATIONS.slice();
    if (communityId != null) {
      list = list.filter(
        (n) => n.community?.id === communityId || !n.community
      );
    }
    if (isRead !== undefined) {
      list = list.filter((n) => (isRead ? n.readAt != null : n.readAt == null));
    }

    const start = (page - 1) * pageSize;
    const notifications = list.slice(start, start + pageSize);

    return Promise.resolve({
      notifications,
      totalItemCount: list.length,
      args: {
        communityId: communityId ?? null,
        isRead,
        page,
        pageSize,
      },
    });
    // return axios.get('api/v1/community/notification', { params });
  },

  setNotificationAsRead(_id: string): Promise<void> {
    return Promise.resolve();
    // return axios.put('api/v1/community/notification/set-as-read', { ids: [id] });
  },

  setNotificationsAsRead(_ids: Array<string>): Promise<void> {
    return Promise.resolve();
    // return axios.put('api/v1/community/notification/set-as-read', { ids });
  },

  setNotificationAllAsRead(): Promise<void> {
    return Promise.resolve();
    // return axios.put('api/v1/community/notification/all-set-as-read');
  },
};
