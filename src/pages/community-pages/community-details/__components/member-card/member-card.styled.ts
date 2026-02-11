import { styled } from 'styled-components';

import { Card as CommonCard } from 'src/components/common/Card/Card';
import { UserAvatar } from 'src/components/common/user-avatar/User-avatar';
import { Button as CommonButton } from 'src/components/common/Button/Button';

export const Card = styled(CommonCard)`
  min-height: 376px;
  height: 100%;

  .ant-card-body {
    padding: 0;
  }

  .content {
    padding: ${(props) => props.theme.spacing.loose};
  }
`;

export const Avatar = styled(UserAvatar)`
  border: 5px solid white;
  box-shadow: ${(props) => props.theme.shadow.large};
`;

export const Button = styled(CommonButton)`
  &:hover {
    background: none !important;
  }
`;
