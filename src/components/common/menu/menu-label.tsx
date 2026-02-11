import * as React from 'react';
import styled from 'styled-components';

const StyledMenuLabel = styled.span`
  display: block;

  .title {
    display: block;
    font-size: ${(props) => props.theme.fontSize.medium};
    line-height: 16px;
    font-weight: 600;
    color: #344054;
  }

  .subtitle {
    display: block;
    font-size: ${(props) => props.theme.fontSize.small};
    line-height: 16px;
    font-weight: 500;
    color: #344054;
    opacity: 0.55;
  }
`;

type MenuLabelProps = {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
};

export const MenuLabel = (props: MenuLabelProps) => {
  const { title, subtitle, children, ...restProps } = props;
  return (
    <StyledMenuLabel {...restProps}>
      <span className="title custom-menu-label-title">{title}</span>
      <span className="subtitle">{subtitle}</span>
      {children}
    </StyledMenuLabel>
  );
};
