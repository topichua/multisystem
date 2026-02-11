import * as React from 'react';
import styled from 'styled-components';

export const CONTENT_HEADER_HEIGHT = 64;
export const CONTENT_HEADER_HEIGHT_MINI = 44;

export const StyledContentHeader = styled.div<{ $size?: 'default' | 'small' }>`
  box-sizing: border-box;
  padding: 8px 16px;
  line-height: 0;
  min-height: ${({ $size = 'default' }) =>
    $size === 'default'
      ? `${CONTENT_HEADER_HEIGHT}px`
      : `${CONTENT_HEADER_HEIGHT_MINI}px`};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: ${(props) =>
    props.theme.colors.components.background.whiteBackground};
  border-bottom: ${(props) =>
    `1px solid ${props.theme.colors.components.border.primaryBorder}`};

  @media (min-width: 768px) {
    padding: 8px 24px;
  }
`;

type ContentHeaderProps = {
  children?: React.ReactNode;
  size?: 'default' | 'small';
  style?: React.CSSProperties;
};

export const ContentHeader = (props: ContentHeaderProps) => {
  const { children, size, ...restProps } = props;
  return (
    <StyledContentHeader $size={size} {...restProps}>
      {children}
    </StyledContentHeader>
  );
};
