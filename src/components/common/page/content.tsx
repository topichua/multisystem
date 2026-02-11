import { Layout } from 'antd';
import { FC, CSSProperties, PropsWithChildren } from 'react';
import { HEADER_HEIGHT } from 'src/pages/authorized/header/header.styled';
import styled from 'styled-components';

export type ContentProps = {
  style?: CSSProperties;
  noPadding?: boolean;
};

export const StyledContent = styled(Layout)<{ $noPadding: boolean }>`
  background: #fcfcfd;
  min-height: calc(100vh - ${HEADER_HEIGHT}px);
  padding: ${({ $noPadding }) => ($noPadding ? 0 : '24px 16px 32px')};

  @media (min-width: 768px) {
    padding: ${({ $noPadding }) => ($noPadding ? 0 : '24px 24px 32px')};
  }

  @media (min-width: 992px) {
    padding: ${({ $noPadding }) => ($noPadding ? 0 : '24px 24px 60px')};
  }
`;

export const Content: FC<PropsWithChildren<ContentProps>> = ({
  children,
  noPadding = false,
  ...restProps
}) => {
  return (
    <StyledContent $noPadding={noPadding} {...restProps}>
      {children}
    </StyledContent>
  );
};
