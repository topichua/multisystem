import { ReactNode } from 'react';
import { Typography } from 'antd';

import { Stack } from '../Stack/Stack';
import { Title } from '../Typography/Title';

import * as S from './CommentItem.styled';

const { Text } = Typography;

type CommentItemProps = {
  dropdown?: ReactNode;
  body: ReactNode;
  footer?: ReactNode;
  createdAt?: ReactNode;
  showCommentInputField?: boolean;
  commentEdit?: string;
  isEditLoading?: boolean;
  userName?: string;
  userPronoun?: string;
  isReported?: boolean;
  avatar?: ReactNode;
  badges?: ReactNode;
};

export const CommentItem = ({
  dropdown,
  createdAt,
  body,
  footer,
  badges,
  userName,
  avatar,
  isReported = false,
  userPronoun,
}: CommentItemProps) => {
  return (
    <S.Wrapper>
      {avatar}
      <S.CardContainer>
        <Stack vertical>
          <S.Card isReported={isReported}>
            <Stack vertical spacing="tight">
              <Stack distribution="equalSpacing" wrap={false}>
                <Stack.Item fill>
                  <Stack alignment="center" spacing="tight">
                    <Title level={5}>{userName}</Title>
                    {userPronoun && (
                      <Text type="secondary">({userPronoun})</Text>
                    )}

                    {badges}

                    <Text type="secondary">{createdAt}</Text>
                  </Stack>
                </Stack.Item>

                {dropdown}
              </Stack>

              {body}
            </Stack>
          </S.Card>

          {footer}
        </Stack>
      </S.CardContainer>
    </S.Wrapper>
  );
};
