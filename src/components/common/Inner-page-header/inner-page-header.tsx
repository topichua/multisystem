import React, { FC, ReactNode } from 'react';

import { ContentHeader } from 'src/components/common/page/content-header';
import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';

export const INNER_HEADER_HEIGHT = 64;

export const InnerPageHeader: FC<{
  icon?: React.JSX.Element;
  title?: ReactNode | string;
  children?: ReactNode;
  size?: 'default' | 'small';
  fillChildren?: boolean;
  style?: React.CSSProperties;
}> = ({
  icon = null,
  title = '',
  children = null,
  size,
  fillChildren = false,
  style,
}) => (
  <ContentHeader size={size} style={style}>
    <Stack
      distribution="equalSpacing"
      alignment="center"
      style={{ width: '100%' }}
    >
      {title || icon ? (
        <Stack alignment="center">
          {icon}
          <Title level={5}>{title}</Title>
        </Stack>
      ) : null}

      <Stack.Item fill={fillChildren}>{children}</Stack.Item>
    </Stack>
  </ContentHeader>
);
