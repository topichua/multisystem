import { Bookmark } from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { Button, notification, Tooltip } from 'antd';
import { useState } from 'react';
import { components } from 'src/styled/definitions/colors.ts';
import { communityApi } from 'src/transport/communities/communities.api.ts';

type MeetingBookmarkProps = {
  initIsFavorite: boolean;
  metingId: string;
  communityId: string;
  reloadMeetings?: () => void;
};

const MeetingBookmark = ({
  initIsFavorite,
  communityId,
  metingId,
  reloadMeetings,
}: MeetingBookmarkProps) => {
  const [isFavorite, setFavorite] = useState<boolean>(initIsFavorite);
  const [isLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);

  const handleToggleFavorite = async () => {
    startLoading();

    const action = isFavorite
      ? communityApi.removeSaveFromMeeting
      : communityApi.addSaveToMeeting;
    const successMessage = isFavorite
      ? 'Successfully removed from favourites'
      : 'Successfully added to favourites';
    const errorMessage = isFavorite
      ? 'Error removing from saved:'
      : 'Error adding to saved:';

    try {
      await action(communityId, metingId);
      notification.success({ message: successMessage });
      setFavorite(!isFavorite);
      if (reloadMeetings) {
        reloadMeetings();
      }
    } catch (e) {
      notification.error({ message: `${errorMessage} ${e}` });
    } finally {
      finishLoading();
    }
  };

  return (
    <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
      <Button
        loading={isLoading}
        type="link"
        icon={
          <Bookmark
            fill={isFavorite ? components.colors.primary : 'white'}
            color={
              isFavorite ? components.colors.primary : components.colors.mono500
            }
          />
        }
        onClick={handleToggleFavorite}
      />
    </Tooltip>
  );
};

export default MeetingBookmark;
