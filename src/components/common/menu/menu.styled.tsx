import styled from 'styled-components';
import { Menu as AntdMenu, MenuProps } from 'antd';
import { FC } from 'react';

const StyledMenu: FC<MenuProps> = (props) => <AntdMenu {...props} />;

export const Menu = styled(StyledMenu)`
  border: none !important;

  .ant-menu-submenu.ant-menu-submenu-inline {
    margin: 16px 0 !important;
  }

  .ant-menu-sub.ant-menu-inline {
    background-color: transparent !important;
  }

  .ant-menu-submenu-title,
  .ant-menu-item {
    padding: 8px 12px !important;
    width: 100%;

    display: flex;
    align-items: center;
    font-size: ${(props) => props.theme.fontSize.medium};
    font-weight: 600;
    color: #344054;
  }

  .ant-menu-item-selected {
    color: #259289;
    background-color: ${(props) =>
      props.theme.colors.components.background.primaryBackground};

    & .custom-menu-label-title {
      color: #259289;
    }
  }
`;
