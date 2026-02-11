import { FC, ReactNode } from 'react';
import { TagProps as AntdTagProps } from 'antd';
import { CheckableTagProps as AntdCheckableTagProps } from 'antd/es/tag';

import * as S from './Tag.styled';

type CustomTagProps = {
  size?: 'small' | 'default' | 'large';
  children?: ReactNode;
  icon?: ReactNode;
} & S.StyledTagProps;

export const Tag: FC<CustomTagProps & AntdTagProps> = ({
  children,
  icon,
  ...restProps
}) => {
  return (
    <S.Tag {...restProps}>
      {icon && <span className="anticon">{icon}</span>}
      <span>{children}</span>
    </S.Tag>
  );
};

export const CheckableTag: FC<CustomTagProps & AntdCheckableTagProps> = ({
  size,
  children,
  icon,
  ...restProps
}) => {
  return (
    <S.CheckableTag size={size} {...restProps}>
      {icon && <span className="anticon">{icon}</span>}
      <span>{children}</span>
    </S.CheckableTag>
  );
};
