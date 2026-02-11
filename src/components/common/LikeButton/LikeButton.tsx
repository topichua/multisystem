import { Heart } from '@untitled-ui/icons-react';
import { useBoolean, useDebounce, useUpdateEffect } from 'ahooks';
import { Button } from 'src/components/common/Button/Button.tsx';
import { components } from 'src/styled/definitions/colors.ts';

type CommunityLikeButtonProps = {
  initialIsLiked: boolean;
  onToggleLike: (isLiked: boolean) => void;
};

const LikeButton = ({
  onToggleLike,
  initialIsLiked,
}: CommunityLikeButtonProps) => {
  const [isLiked, { toggle: toggleLiked }] = useBoolean(initialIsLiked);

  const isLikedDebounce = useDebounce(isLiked, { wait: 500 });

  useUpdateEffect(() => {
    onToggleLike(isLikedDebounce);
  }, [isLikedDebounce]);

  return (
    <Button
      type="link"
      icon={
        <Heart
          fill={isLiked ? components.colors.primary : 'white'}
          color={
            isLiked ? components.colors.primary : components.colors.mono500
          }
        />
      }
      onClick={toggleLiked}
    />
  );
};

export default LikeButton;
