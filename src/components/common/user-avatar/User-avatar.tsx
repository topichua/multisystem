import { FC } from 'react';
import { AvatarProps } from 'antd';
import * as S from './User-avatar.styled';

type UserAvatarProps = {
  firstName: string;
  lastName: string;
  fontSize?: number;
} & AvatarProps;

export const UserAvatar: FC<UserAvatarProps> = ({
  firstName,
  lastName,
  fontSize,
  ...avatarProps
}) => {
  const abbreviation = (() => {
    const [firstChar] = firstName.trim();
    const [secondChar] = lastName.trim();
    return [firstChar, secondChar].join('').toUpperCase();
  })();

  return (
    <S.Avatar shape="square" size="large" fontSize={fontSize} {...avatarProps}>
      {!avatarProps.src && abbreviation}
    </S.Avatar>
  );
};
