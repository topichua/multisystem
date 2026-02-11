import { Affix } from 'antd';
import { ReactNode } from 'react';
import { HEADER_HEIGHT } from 'src/pages/authorized/header/header.styled';

export const FixedContentHeader = ({
  children,
  withHeaderOffset = true,
}: {
  children: ReactNode;
  withHeaderOffset?: boolean;
}) => (
  <Affix offsetTop={withHeaderOffset ? HEADER_HEIGHT : 0}>{children}</Affix>
);
