import { useEffect, useState } from 'react';
import { Attachment } from 'src/transport/posts/posts.dto.ts';
import { communityApi } from 'src/transport/communities/communities.api.ts';
import { useBoolean } from 'ahooks';
import {
  CommunityMeeting,
  ExploreMeet,
} from 'src/transport/communities/communities.dto.ts';

type MeetingAssetsProps = Attachment & {
  uid: string;
};

export const useAssets = (
  meeting: CommunityMeeting | ExploreMeet | null,
  communityId: string,
  isFetchEnabled: boolean
) => {
  const [meetingAssets, setMeetingAssets] = useState<MeetingAssetsProps[]>([]);
  const [isLoading, { setFalse: setFalseLoading, setTrue: setTrueLoading }] =
    useBoolean(false);

  useEffect(() => {
    if (!isFetchEnabled || !meeting) {
      return;
    }
    setTrueLoading();
    communityApi
      .getMeetingAssets(meeting.id, communityId)
      .then((res) => {
        const filteredData: MeetingAssetsProps[] = res.assets.map((asset) => ({
          uid: asset.id,
          path: asset.path,
          name: asset.fileName,
          type: '',
        }));
        setMeetingAssets(filteredData);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setFalseLoading();
      });
  }, [isFetchEnabled, meeting]);

  return { meetingAssets, isLoading, setMeetingAssets };
};
