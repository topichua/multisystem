import { PropsWithChildren } from 'react';
import { MessageTextCircle01 } from '@untitled-ui/icons-react';
import { Avatar } from 'antd';

import { Stack } from 'src/components/common/Stack/Stack';

import * as S from './post-item.styled';

type PostItemProps = PropsWithChildren<{
  avatarSrc?: string;
  title: string | React.ReactNode;
  subtitle?: React.ReactNode | string;
}>;

export const PostItem = ({
  avatarSrc,
  title,
  subtitle,
  children,
}: PostItemProps) => {
  return (
    <S.ListItem>
      <Stack alignment="center" wrap={false}>
        <Stack.Item>
          <Avatar
            src={avatarSrc}
            size={40}
            shape="square"
            icon={<MessageTextCircle01 width={40} height={40} />}
          />
        </Stack.Item>
        <Stack.Item fill ellipsis>
          <Stack vertical spacing="none">
            <Stack.Item fill ellipsis>
              <S.PostTitle>{title}</S.PostTitle>
            </Stack.Item>
            <Stack.Item fill ellipsis>
              {subtitle}
            </Stack.Item>
          </Stack>
        </Stack.Item>

        <Stack.Item>
          <Stack wrap={false}>{children}</Stack>
        </Stack.Item>
      </Stack>
    </S.ListItem>
  );
};
