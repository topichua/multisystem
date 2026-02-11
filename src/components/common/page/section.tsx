import * as React from 'react';
import styled from 'styled-components';

export const StyledSection = styled.div`
  padding: 80px 0;
  justify-content: center;
  background: ${(props) =>
    props.theme.colors.components.background.whiteBackground};

  @media (max-width: 768px) {
    padding: 40px 0;
  }
`;

type SectionProps = {
  children?: React.ReactNode;
};

export const Section = (props: SectionProps) => {
  const { children, ...restProps } = props;
  return <StyledSection {...restProps}>{children}</StyledSection>;
};
