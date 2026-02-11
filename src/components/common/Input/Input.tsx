import * as React from 'react';
import * as S from './Input.styled.tsx';
import { InputProps } from 'antd';
import { PasswordProps } from 'antd/es/input/Password';
import { TextAreaProps } from 'antd/es/input/TextArea';

export const Input: React.FC<InputProps> = ({ children, ...rest }) => {
  return <S.Input {...rest}>{children}</S.Input>;
};

export const InputPassword: React.FC<PasswordProps> = ({
  children,
  ...rest
}) => {
  return <S.InputPassword {...rest}>{children}</S.InputPassword>;
};

export const InputTextArea = React.forwardRef<
  HTMLTextAreaElement,
  TextAreaProps
>(({ children, ...rest }, ref) => {
  return (
    <S.Input.TextArea ref={ref} {...rest}>
      {children}
    </S.Input.TextArea>
  );
});
