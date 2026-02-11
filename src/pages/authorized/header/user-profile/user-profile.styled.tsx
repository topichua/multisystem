import { Menu } from 'antd';
import styled from 'styled-components';
import { Avatar as AntdAvatar } from 'antd';

export const UserProfileMenu: typeof Menu = styled(Menu)`
  .ant-menu-item {
    width: 100%;
    margin-inline: 0;
    margin-block: 2px;
  }
  .ant-menu-title-content {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .ant-menu-submenu-title {
    display: flex;
    align-items: center;
  }
`;

export const Avatar = styled(AntdAvatar)`
  &:hover {
    cursor: pointer;
  }
`;
