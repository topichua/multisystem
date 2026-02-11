import { useCallback, useState } from 'react';
import { notification } from 'antd';

import CheckIcon from 'src/assets/assets-icons/сheck-icon.svg?react';
import { useCopyToClipboard } from 'src/hooks/useCopyToClipboard';

import '../notifications.css';
import { communityApi } from 'src/transport/communities/communities.api';

export interface UseCopyMeetingUrlResult {
  handleCopy: () => Promise<void>;
}

export const useCopyMeetingUrl = (
  meetingId: string,
  communityId: string,
  communityAlias?: string
): UseCopyMeetingUrlResult => {
  const [, copy] = useCopyToClipboard();
  const [alias, setAlias] = useState<string | undefined>(communityAlias);

  const fetchCommunityAlias = async () => {
    return communityApi.getCommunityById(communityId).then((res) => {
      const fetchedCommunityAlias = res.community.community.alias;

      setAlias(fetchedCommunityAlias);
      return fetchedCommunityAlias;
    });
  };

  const handleCopy = useCallback(async () => {
    try {
      let aliasUrl = alias;

      if (!aliasUrl) {
        notification.success({
          key: meetingId,
          icon: <CheckIcon height={30} width={30} />,
          message: 'Copying...',
          closable: false,
          className: 'copy-meeting-notification',
        });

        aliasUrl = await fetchCommunityAlias();
      }

      const url = `${window.location.origin}/communities/${aliasUrl}/meetings/${meetingId}`;

      await copy(url.toString());

      notification.success({
        key: meetingId,
        icon: <CheckIcon height={30} width={30} />,
        message: 'Link copied',
        closable: false,

        className: 'copy-meeting-notification',
      });
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  }, [copy, meetingId, alias]);

  return { handleCopy };
};
