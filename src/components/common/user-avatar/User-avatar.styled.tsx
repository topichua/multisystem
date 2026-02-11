import { Avatar as AntAvatar } from 'antd';
import styled from 'styled-components';

export const Avatar = styled(AntAvatar)<{ fontSize?: number }>`
  background-color: #dcfae6;
  color: #079455;
  font-size: ${(props) =>
    props.fontSize
      ? props.fontSize + 'px'
      : props.theme.fontSize.large} !important;
  font-weight: 600;

  &:hover {
    cursor: pointer;
  }
`;
