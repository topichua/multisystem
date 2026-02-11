import { Typography } from 'antd';
import { TAGDIVIDER } from 'src/pages/authorized/header/search/hooks';

import {
  SearchCommunityDTO,
  SearchPostDTO,
  SearchTagDTO,
} from 'src/transport/search/search.dto';
import { pagesMap } from '../../routes';
import * as S from './autocomplete.styled';
import { Stack } from 'src/components/common/Stack/Stack';

const { Text } = Typography;

export const renderCommunityItem = (community: SearchCommunityDTO) => {
  const {
    name: title,
    imageUrl,
    membersCount,
    postsCount,
    isPublic,
    alias,
  } = community;

  const communityUrl = `${pagesMap.communities}/${alias}`;

  return {
    value: communityUrl,
    label: (
      <Stack
        wrap={false}
        alignment="center"
        distribution="equalSpacing"
        spacing="tight"
      >
        <Stack.Item ellipsis>
          <Stack wrap={false} spacing="tight">
            {imageUrl ? (
              <S.StyledImage
                src={imageUrl}
                alt=""
                width={24}
                height={24}
                preview={false}
              />
            ) : (
              <S.StyledCompass03 />
            )}
            <Stack.Item ellipsis>
              <Text>{title}</Text>
            </Stack.Item>
          </Stack>
        </Stack.Item>
        <Stack wrap={false} alignment="center" spacing="tight">
          <Stack alignment="center" spacing="extraTight" wrap={false}>
            <S.CommunityUsersIcon />
            <S.InfoStack distribution="center">
              <Text type="secondary">{membersCount}</Text>
            </S.InfoStack>
          </Stack>
          <Stack alignment="center" spacing="extraTight" wrap={false}>
            <S.CommunityPostsIcon />
            <S.InfoStack distribution="center">
              <Text type="secondary">{postsCount}</Text>
            </S.InfoStack>
          </Stack>
          {isPublic ? <S.CommunityPublicIcon /> : <S.CommunityPrivateIcon />}
        </Stack>
      </Stack>
    ),
  };
};

export const renderPostItem = (post: SearchPostDTO) => {
  const {
    title,
    likesCount,
    commentsCount,
    id,
    viewsCount,
    savedCount,
    communityAlias,
  } = post;

  const postUrl = `${pagesMap.communities}/${communityAlias}/posts/${id}`;

  return {
    value: postUrl,
    label: (
      <Stack
        wrap={false}
        alignment="center"
        distribution="equalSpacing"
        spacing="tight"
      >
        <Stack.Item ellipsis>
          <Stack wrap={false} spacing="extraTight">
            <S.PostStyledFile02 />
            <Stack.Item ellipsis>
              <Typography.Text>{title}</Typography.Text>
            </Stack.Item>
          </Stack>
        </Stack.Item>
        <Stack wrap={false} alignment="center" spacing="tight">
          <Stack alignment="center" spacing="extraTight" wrap={false}>
            <S.PostStyledThumbsUp />
            <S.InfoStack distribution="center">
              <Text type="secondary">{likesCount}</Text>
            </S.InfoStack>
          </Stack>
          <Stack alignment="center" spacing="extraTight" wrap={false}>
            <S.PostStyledMessageSquare01 />
            <S.InfoStack distribution="center">
              <Text type="secondary">{commentsCount}</Text>
            </S.InfoStack>
          </Stack>
          <Stack alignment="center" spacing="extraTight" wrap={false}>
            <S.PostStyledEye />
            <S.InfoStack distribution="center">
              <Text type="secondary">{viewsCount}</Text>
            </S.InfoStack>
          </Stack>
          <Stack alignment="center" spacing="extraTight" wrap={false}>
            <S.PostStyledBookmark />
            <S.InfoStack distribution="center">
              <Text type="secondary">{savedCount}</Text>
            </S.InfoStack>
          </Stack>
        </Stack>
      </Stack>
    ),
  };
};

export const renderTagItem = (tag: SearchTagDTO) => {
  const { countOfPosts, id, name: title } = tag;

  return {
    value: `${id}${TAGDIVIDER}${title}`,
    label: (
      <>
        <Stack
          wrap={false}
          alignment="center"
          distribution="equalSpacing"
          spacing="tight"
        >
          <Stack.Item ellipsis>
            <Stack alignment="center" spacing="extraTight" wrap={false}>
              <S.TagIcon />
              <Text>{title}</Text>
            </Stack>
          </Stack.Item>
          <Stack alignment="center" spacing="extraTight" wrap={false}>
            <S.TagPostsIcon />
            <S.InfoStack distribution="center">
              <Text type="secondary">{countOfPosts}</Text>
            </S.InfoStack>
          </Stack>
        </Stack>
      </>
    ),
  };
};
