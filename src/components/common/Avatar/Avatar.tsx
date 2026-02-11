import { Airpods, User01, Users01 } from '@untitled-ui/icons-react';
import { Avatar as AntdAvatar, AvatarProps as AntdAvatarProps } from 'antd';
import * as React from 'react';

export enum AvatarType {
  collaboration = 0,
  collaborationsGroup = 1,
  members = 2,
  organisations = 3,
  profile = 4,
}

type AvatarProps = {
  avatarSrc?: string;
  type: AvatarType;
} & AntdAvatarProps;

type AvatarIconMap = {
  [key in AvatarType]: React.ReactNode;
};

const avatarSizes = {
  width: 40,
  height: 40,
};

const avatarIcons: AvatarIconMap = {
  [AvatarType.collaboration]: <Users01 {...avatarSizes} />,
  [AvatarType.collaborationsGroup]: <Airpods {...avatarSizes} />,
  [AvatarType.members]: <Airpods {...avatarSizes} />,
  [AvatarType.organisations]: <Airpods {...avatarSizes} />,
  [AvatarType.profile]: <User01 {...avatarSizes} />,
};

export const Avatar = ({ avatarSrc, type, ...rest }: AvatarProps) => {
  return (
    <AntdAvatar
      src={avatarSrc}
      icon={avatarSrc ? undefined : avatarIcons[type]}
      {...rest}
    />
  );
};
