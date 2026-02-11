import { ReactNode } from 'react';
import * as S from './Badge.styled.tsx';

type size = 'small' | 'default';

export type BadgeProps = {
  children: ReactNode;
  onClose?: () => void;
  allClicable?: boolean;
  size?: size;
};

export const Badge = ({
  children,
  onClose,
  allClicable,
  size = 'default',
}: BadgeProps) => {
  return (
    <S.BadgeStyled
      allClicable={allClicable}
      onClick={allClicable && onClose ? () => onClose() : () => {}}
      size={size}
    >
      {children}
      {onClose && !allClicable && <S.CloseIcon onClick={onClose} />}
    </S.BadgeStyled>
  );
};
