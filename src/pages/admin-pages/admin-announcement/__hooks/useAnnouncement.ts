import { useEffect, useState } from 'react';
import { useBoolean } from 'ahooks';
import { notification } from 'antd';
import { Dayjs } from 'dayjs';
import { UserProfileDto } from 'src/transport/account/account.dto.ts';

import { announcementApi } from 'src/transport/announcement/announcement.api';
import { Announcement } from 'src/transport/announcement/announcement.dto';
import { userApi } from 'src/transport/user/user.api.ts';

import { AnnouncementFormValues } from '../__components/create-announcement-modal';
import { map, uniq } from 'lodash';

export const useAnnouncement = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [creators, setCreators] = useState<UserProfileDto[]>([]);

  const [
    isMutateAnnouncementLoading,
    {
      setTrue: startMutateAnnouncementLoading,
      setFalse: finishMutateAnnouncementLoading,
    },
  ] = useBoolean(false);
  const [
    isAnnouncementsLoading,
    {
      setTrue: startAnnouncementsLoading,
      setFalse: finishAnnouncementsLoading,
    },
  ] = useBoolean(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = () => {
    startAnnouncementsLoading();

    announcementApi
      .fetchAnnouncements({})
      .then((res) => {
        setAnnouncements(res.announcements);
        const accountIds = uniq(map(res.announcements, 'createdByUserId'));
        userApi.getUsersByIds({ accountIds }).then((res) => {
          setCreators(res.data.users);
        });
      })
      .catch(() => {
        notification.error({
          message: 'Failed to fetch announcements. Try again.',
        });
      })
      .finally(finishAnnouncementsLoading);
  };

  const mutateAnnouncement = (values: AnnouncementFormValues) => {
    const { date, id, ...restValues } = values;
    const [startDate, endDate] = date as [Dayjs, Dayjs];

    startMutateAnnouncementLoading();

    const request = id
      ? announcementApi.editAnnouncement
      : announcementApi.createAnnouncement;

    return request({
      ...restValues,
      id: id as string,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    })
      .then(() => {
        fetchAnnouncements();
      })
      .catch(() => {
        notification.error({
          message: 'Failed to create announcement. Try again.',
        });
      })
      .finally(finishMutateAnnouncementLoading);
  };

  const setActiveToAnnouncement = (id: string) => {
    startMutateAnnouncementLoading();

    return announcementApi
      .editAnnouncement({ isActive: true, id })
      .then(() => {
        fetchAnnouncements();
      })
      .catch(() => {
        notification.error({
          message: 'Failed to activate announcement. Try again.',
        });
      })
      .finally(finishMutateAnnouncementLoading);
  };

  const deleteAnnouncement = (id: string) => {
    startMutateAnnouncementLoading();

    return announcementApi
      .deleteAnnouncement(id)
      .then(() => {
        fetchAnnouncements();
      })
      .catch(() => {
        notification.error({
          message: 'Failed to delete announcement. Try again.',
        });
      })
      .finally(finishMutateAnnouncementLoading);
  };

  return {
    announcements,
    isMutateAnnouncementLoading,
    isAnnouncementsLoading,
    mutateAnnouncement,
    setActiveToAnnouncement,
    deleteAnnouncement,
    creators,
  };
};
