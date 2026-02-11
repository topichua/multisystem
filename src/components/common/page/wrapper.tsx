import * as React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div<{ width?: 'small' | 'medium' | 'large' }>`
  width: 100%;
  max-width: ${(props) =>
    props.width === 'small'
      ? '880px'
      : props.width === 'medium'
        ? '1080px'
        : '1280px'};
  margin: 0 auto;
  padding: 0 16px;
`;

type WrapperProps = {
  width?: 'small' | 'medium' | 'large';
  children?: React.ReactNode;
};

export const Wrapper = (props: WrapperProps) => {
  const { width, children, ...restProps } = props;
  return (
    <StyledWrapper width={width} {...restProps}>
      {children}
    </StyledWrapper>
  );
};
