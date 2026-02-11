import * as React from 'react';
import * as S from './Button.styled';
import { ButtonProps as AntdButtonProps } from 'antd';

export type ButtonProps = {
  rightIcon?: React.ReactNode;
} & AntdButtonProps;

export const Button = ({
  rightIcon = false,
  children,
  ...rest
}: ButtonProps) => {
  return (
    <S.Button {...rest}>
      {children}
      {rightIcon && <S.RightIcon>{rightIcon}</S.RightIcon>}
    </S.Button>
  );
};
