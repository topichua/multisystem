import { useEffect, useState } from 'react';
import { announcementApi } from 'src/transport/announcement/announcement.api';

import { Announcement } from 'src/transport/announcement/announcement.dto';

export const useAnnouncement = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = () => {
    announcementApi.getRelevantAnnouncement().then((res) => {
      setAnnouncement(res);
    });
  };

  const cancelAnnouncement = () => {
    setAnnouncement(null);
    announcementApi.cancelAnnouncement(announcement?.id as string);
  };

  return { announcement, cancelAnnouncement };
};
