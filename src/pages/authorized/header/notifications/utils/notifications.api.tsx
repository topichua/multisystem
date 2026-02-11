import { notificationApi } from 'src/transport/notification/notification.api';
import { NotificationActivityListItemModelDTO } from 'src/transport/notification/notification.dto';

export interface INotifications {
  list: NotificationActivityListItemModelDTO[];
  total: number;
}

export const getLoadMoreList = async (
  page: number,
  pageSize: number,
  restParams: { isRead?: boolean } | undefined = {}
): Promise<INotifications> => {
  const data = await notificationApi.getNotifications({
    page,
    pageSize,
    ...restParams,
  });
  return new Promise((resolve) =>
    resolve({
      list: data?.notifications,
      total: data?.totalItemCount,
    })
  );
};
