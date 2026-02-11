import { Bookmark } from '@untitled-ui/icons-react';
import { useBoolean, useDebounce, useUpdateEffect } from 'ahooks';
import { Tooltip } from 'antd';
import { useEffect } from 'react';
import { Button } from 'src/components/common/Button/Button.tsx';
import LikeButton from 'src/components/common/LikeButton/LikeButton.tsx';

import {
  CommunityCardProps,
  CommunityCard,
} from 'src/components/community/CommunityCard/CommunityCard.tsx';
import { components } from 'src/styled/definitions/colors.ts';

type CommunityFavoriteItemProps = CommunityCardProps & {
  initialIsFavorite: boolean;
  initialIsLiked: boolean;
  onToggleFavorite: (isFavorite: boolean) => Promise<void>;
  onToggleLike: (isLiked: boolean) => void;
};

export const CommunityFavoriteItem = ({
  initialIsFavorite,
  onToggleFavorite,
  onToggleLike,
  initialIsLiked,
  ...rest
}: CommunityFavoriteItemProps) => {
  const [isFavorite, { toggle: toggleFavorite, set: setFavorite }] =
    useBoolean(initialIsFavorite);

  const [isLoading, { setTrue: startLoading, setFalse: finishLoading }] =
    useBoolean(false);

  const isFavoriteDebounce = useDebounce(isFavorite, { wait: 500 });

  useEffect(() => {
    setFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  useUpdateEffect(() => {
    onToggleFavorite(isFavoriteDebounce).finally(() => {
      finishLoading();
    });
  }, [isFavoriteDebounce]);

  return (
    <CommunityCard
      {...rest}
      favorite={
        <Tooltip
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Button
            type="link"
            loading={isLoading}
            icon={
              <Bookmark
                fill={isFavorite ? components.colors.primary : 'white'}
                color={
                  isFavorite
                    ? components.colors.primary
                    : components.colors.mono500
                }
              />
            }
            onClick={() => {
              toggleFavorite();
              startLoading();
            }}
          />
        </Tooltip>
      }
      liked={
        <LikeButton
          initialIsLiked={initialIsLiked}
          onToggleLike={onToggleLike}
        />
      }
    />
  );
};
