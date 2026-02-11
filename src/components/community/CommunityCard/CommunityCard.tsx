import { ReactNode } from 'react';
import { Avatar, CardProps, Tooltip, Typography } from 'antd';

import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';

import * as S from './CommunityCard.styled';

const { Text } = Typography;

export type CommunityCardProps = {
  image: string;
  categoriesName: string[];
  title: string | React.ReactNode;
  info: Array<string>;
  actions: React.ReactNode[];
  isAutoJoin?: boolean;
  favorite?: ReactNode;
  liked?: ReactNode;
  onImageClick?: () => void;
  onNavigateToCommunity?: () => void;
  bgColor?: string;
} & CardProps;

export const CommunityCard = ({
  actions,
  image,
  categoriesName,
  title,
  info,
  isAutoJoin,
  favorite,
  liked,
  onNavigateToCommunity,
  bgColor,
  ...rest
}: CommunityCardProps) => {
  return (
    <S.Badge showBadge={isAutoJoin} placement="start" text="Auto joined">
      <S.Card
        bgColor={bgColor}
        actions={actions}
        canNavigate={!!onNavigateToCommunity}
        {...rest}
      >
        <Stack vertical>
          <Stack alignment="center" wrap={false}>
            <Avatar
              shape="square"
              size={96}
              src={image}
              className="cursor-pointer"
              onClick={onNavigateToCommunity}
            />

            <Stack.Item fill>
              <Stack vertical spacing="none">
                <Stack alignment="center" wrap={false}>
                  <Stack.Item fill ellipsis>
                    <Tooltip title={categoriesName.join(', ')}>
                      <Text>{categoriesName.join(', ')}</Text>
                    </Tooltip>
                  </Stack.Item>
                  {liked}
                  {favorite}
                </Stack>
                <Title
                  level={4}
                  title={title?.toString()}
                  className="cursor-pointer"
                  ellipsis={{ rows: 1, suffix: '' }}
                  onClick={onNavigateToCommunity}
                >
                  {title}
                </Title>

                <div className="info">
                  <Stack split="•" spacing="extraTight" alignment="center">
                    {info.map((text, index) => (
                      <Text key={index}>{text}</Text>
                    ))}
                  </Stack>
                </div>
              </Stack>
            </Stack.Item>
          </Stack>
        </Stack>
      </S.Card>
    </S.Badge>
  );
};
