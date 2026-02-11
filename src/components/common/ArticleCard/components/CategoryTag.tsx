import { Circle, Tag02 } from '@untitled-ui/icons-react';
import { TagProps, Typography } from 'antd';
import noop from 'lodash/noop';
import { FC, useMemo } from 'react';
import styled from 'styled-components';

import { Stack } from '../../Stack/Stack';
import { CategoryColors } from '../ArticleCard.utils';
import { Tag } from '../../Tag/Tag';

export const StyledCategoryTag = styled(Tag)`
  border-radius: 16px;
  height: 26px;
  &:hover {
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

type CategoryTagProps = {
  name: string;
  onClick?: () => void;
};

interface ColorScheme {
  color: string;
  backgroundColor: string;
  dotColor: string;
}

const colorSchemes: Record<CategoryColors, ColorScheme> = {
  [CategoryColors.Turquoise]: {
    color: '#026AA2',
    backgroundColor: '#F0F9FF',
    dotColor: '#0BA5EC',
  },
  [CategoryColors.Blue]: {
    color: '#3538CD',
    backgroundColor: '#EEF4FF',
    dotColor: '#6172F3',
  },
  [CategoryColors.Purple]: {
    color: '#5925DC',
    backgroundColor: '#F4F3FF',
    dotColor: '#7A5AF8',
  },
  [CategoryColors.Red]: {
    color: '#C11574',
    backgroundColor: '#FDF2FA',
    dotColor: '#EE46BC',
  },
};

const getRandomColor = (): ColorScheme => {
  const colorKeys = Object.keys(colorSchemes) as unknown as CategoryColors[];
  const randomIndex = Math.floor(Math.random() * colorKeys.length);
  return colorSchemes[colorKeys[randomIndex]];
};

export const CategoryTag: FC<CategoryTagProps> = ({ name, onClick = noop }) => {
  const tagStyle = useMemo(() => getRandomColor(), []);

  return (
    <StyledCategoryTag
      onClick={onClick}
      bordered={false}
      size="small"
      style={{
        backgroundColor: tagStyle.backgroundColor,
      }}
    >
      <Stack vertical={false} wrap={false} spacing="tight">
        <Circle
          height={6}
          width={6}
          color={tagStyle.dotColor}
          fill={tagStyle.dotColor}
        />
        <Typography.Text
          style={{
            color: tagStyle.color,
          }}
        >
          {name}
        </Typography.Text>
      </Stack>
    </StyledCategoryTag>
  );
};

export const StyledDefaultTag = styled(StyledCategoryTag)`
  border: 1px solid ${({ theme }) => theme.colors.components.colors.green900};
  color: ${({ theme }) => theme.colors.components.colors.textColor};
  background-color: #e5f7fa5c;
  display: flex;
  align-items: center;
  margin: 0;
  gap: 5px;
  border-radius: 4px;
  height: 22px;
`;

export const DefaultTag: FC<TagProps> = (props) => {
  return (
    <StyledDefaultTag
      icon={<Tag02 height={12} width={12} />}
      {...(props || {})}
    />
  );
};
