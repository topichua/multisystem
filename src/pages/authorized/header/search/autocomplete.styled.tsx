import {
  Bookmark,
  Compass03,
  Eye,
  File02,
  LockKeyholeCircle,
  LockUnlocked01,
  MessageSquare01,
  SearchSm,
  Tag01,
  ThumbsUp,
  Users01,
} from '@untitled-ui/icons-react';
import { AutoComplete, Image } from 'antd';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import styled, { css } from 'styled-components';

const sharedCss = css`
  width: 20px;
  height: 20px;
`;

export const StyledSearchIcon = styled(SearchSm)`
  ${sharedCss}

  display: block;
  color: #98a2b3;
`;

export const StyledSearchIconWrapper = styled.div`
  ${sharedCss}
`;

export const StyledImage = styled(Image)`
  border-radius: 4px;
`;

export const StyledCompass03 = styled(Compass03)`
  display: block;
  width: 24px;
  height: 24px;
`;

export const StyledFile02Wrapper = styled.div`
  flex-shrink: 0;
`;

export const StyledAutoComplete = styled(AutoComplete)`
  & .ant-input-affix-wrapper {
    min-width: 100% !important;
  }
`;

const smallerIconsCss = css`
  display: block;
  width: 14px;
  height: 14px;
  color: rgba(0, 0, 0, 0.45);
`;

export const PostStyledFile02 = styled(File02)`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
`;

export const PostStyledThumbsUp = styled(ThumbsUp)`
  ${smallerIconsCss}
`;

export const PostStyledMessageSquare01 = styled(MessageSquare01)`
  ${smallerIconsCss}
`;

export const PostStyledEye = styled(Eye)`
  ${smallerIconsCss}
`;

export const PostStyledBookmark = styled(Bookmark)`
  ${smallerIconsCss}
`;

const communityIconCss = css`
  width: 14px;
  height: 14px;
  color: rgba(0, 0, 0, 0.45);
  display: flex;
`;

export const CommunityUsersIcon = styled(Users01)`
  ${communityIconCss}
`;

export const CommunityPostsIcon = styled(File02)`
  ${communityIconCss}
`;

export const CommunityPublicIcon = styled(LockUnlocked01)`
  ${communityIconCss}
  color: ${({
    theme: {
      colors: {
        components: {
          colors: { brandColor },
        },
      },
    },
  }) => brandColor};
`;

export const CommunityPrivateIcon = styled(LockKeyholeCircle)`
  ${communityIconCss}
  color: #ff4d4f;
`;

export const TagIcon = styled(Tag01)`
  width: 16px;
  height: 16px;
  color: rgba(0, 0, 0, 0.45);
  display: flex;
`;

export const TagPostsIcon = styled(File02)`
  width: 14px;
  height: 14px;
  color: rgba(0, 0, 0, 0.45);
  display: flex;
`;

export const InfoStack = styled(Stack)`
  min-width: 14px;
`;
