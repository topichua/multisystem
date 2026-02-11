import axios from 'src/transport/axios/axios-instance';
import { NotificationResponse } from './notification.dto';

export interface NotificationsResponseParams {
  page?: number;
  pageSize?: number;
  communityId?: string;
  isRead?: boolean;
}

export interface SetAsReadNotificationsParams {
  ids: string[];
}

export const notificationApi = {
  getNotifications(
    params: NotificationsResponseParams = {
      page: 1,
      pageSize: 7,
      isRead: false,
    }
  ): Promise<NotificationResponse> {
    return axios.get('api/v1/community/notification', {
      params,
    });
  },
  // getNotifications(
  //   params: NotificationsResponseParams = {
  //     page: 1,
  //     pageSize: 7,
  //     isRead: false,
  //   },
  // ): Promise<NotificationResponse> {
  //   return axios.post('api/v1/notification/list', params);
  // },

  setNotificationAsRead(id: string): Promise<void> {
    return axios.put('api/v1/community/notification/set-as-read', {
      ids: [id],
    });
  },

  setNotificationsAsRead(ids: Array<string>): Promise<void> {
    return axios.put('api/v1/community/notification/set-as-read', {
      ids,
    });
  },

  setNotificationAllAsRead(): Promise<void> {
    return axios.put('api/v1/community/notification/all-set-as-read');
  },
};
