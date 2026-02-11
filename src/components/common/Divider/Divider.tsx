import * as React from 'react';
import * as S from './Divider.styled';

type DividerProps = S.DividerProps;

export function Divider({
  children,
  ...rest
}: React.PropsWithChildren<DividerProps>) {
  return <S.Divider {...rest}>{children}</S.Divider>;
}
