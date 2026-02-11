import * as S from '../Stack.styled';

export function Item({ children, fill, ellipsis }: S.StackItemProps) {
  return (
    <S.Item fill={fill} ellipsis={ellipsis}>
      {children}
    </S.Item>
  );
}
