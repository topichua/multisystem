import { ThumbsUp } from '@untitled-ui/icons-react';
import { Typography } from 'antd';
import { observer } from 'mobx-react';

import { Stack } from 'src/components/common/Stack/Stack';
import { Post } from 'src/transport/posts/posts.dto';
import { components } from 'src/styled/definitions/colors';

import { useCommunityPostDetailsStore } from '../../community-post-details.provider';
import { useToggleLikeOrSave } from '../../__hooks/useToggleLikeOrSave';

import * as S from './post-actions.styled';
import { formatSingular } from 'src/utils/text';
import { CountLabels } from 'src/utils/text-consts';

const { Text } = Typography;

const iconSizes = {
  weight: 20,
  height: 20,
};

type PostActionsProps = {
  onClickComment?: () => void;
};

export const PostActions = observer(({}: PostActionsProps) => {
  const { post: postFromStore } = useCommunityPostDetailsStore();
  const post = postFromStore as Post;

  const {
    value: isLiked,
    likesCount,
    toggleValue: toggleLike,
  } = useToggleLikeOrSave({
    initialValue: !!post.isLiked,
    postOrCommentId: post.id,
    type: 'post',
    initialLikesCount: post.likesCount,
  });

  return (
    <Stack alignment="center" spacing="extraLoose">
      {/* <Button type="primary" onClick={onClickComment}>
        Comment
      </Button> */}

      <Stack spacing="loose" split="•" alignment="center">
        <S.ActionText active={isLiked} onClick={toggleLike}>
          <ThumbsUp
            {...iconSizes}
            fill={isLiked ? components.background.greenBackground07 : 'none'}
          />
          {isLiked ? 'Liked' : 'Like'}
        </S.ActionText>

        <Text>{formatSingular(likesCount, CountLabels.LIKES)}</Text>
        <Text>{formatSingular(post?.viewsCount || 0, CountLabels.VIEWS)}</Text>
      </Stack>
    </Stack>
  );
});
