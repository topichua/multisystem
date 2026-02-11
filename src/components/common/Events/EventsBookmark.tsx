import { Bookmark } from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { notification, Tooltip } from 'antd';
import { useState } from 'react';
import { components } from 'src/styled/definitions/colors.ts';
import { eventsApi } from 'src/transport/events/events.api.ts';
import { Button } from 'src/components/common/Button/Button.tsx';

type EventBookmarkProps = {
  initIsFavorite: boolean;
  eventId: string;
  toggleReload?: () => void;
};

export const EventBookmark = ({
  initIsFavorite,
  eventId,
  toggleReload,
}: EventBookmarkProps) => {
  const [isFavorite, setFavorite] = useState<boolean>(initIsFavorite);
  const [isLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);

  const handleToggleFavorite = async () => {
    startLoading();

    const favoriteAction = isFavorite
      ? eventsApi.removeEventFromFavorite
      : eventsApi.addEventToFavorite;
    const successMessage = isFavorite
      ? 'Successfully removed from favourites'
      : 'Successfully added to favourites';
    const errorMessage = isFavorite
      ? 'Error removing from favorites:'
      : 'Error adding to favorites:';

    favoriteAction(eventId)
      .then(() => {
        notification.success({ message: successMessage });
        setFavorite((prev) => !prev);
        if (toggleReload) {
          toggleReload();
        }
      })
      .catch((error) => {
        notification.error({
          message: `${errorMessage}: ${error.message || error}`,
        });
      })
      .finally(() => {
        finishLoading();
      });
  };

  return (
    <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
      <Button
        loading={isLoading}
        type="link"
        icon={
          <Bookmark
            height={20}
            width={20}
            fill={isFavorite ? components.colors.primary : 'white'}
            color={
              isFavorite ? components.colors.primary : components.colors.mono500
            }
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite();
            }}
          />
        }
        onClick={(e) => {
          e.stopPropagation();
          handleToggleFavorite();
        }}
      />
    </Tooltip>
  );
};
