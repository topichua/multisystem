import { Bookmark } from '@untitled-ui/icons-react';
import { Col } from 'antd';
import { Button } from 'src/components/common/Button/Button.tsx';
import { Menu } from 'src/components/common/menu/menu.tsx';
import styled from 'styled-components';

export const StyledMenu = styled(Menu)`
  .ant-menu-submenu.ant-menu-submenu-inline {
    margin: 0 !important;
  }

  .ant-menu-submenu {
    .ant-menu-item {
      padding: 0 16px !important;
      margin: 0 !important;
    }
  }

  > .ant-menu-item {
    margin: 0 4px !important;
    padding-top: 2px !important;
    padding-bottom: 2px !important;
    height: auto;
  }

  > .ant-menu-submenu {
    margin: 0 4px !important;
    height: auto;
  }

  .ant-menu-submenu > .ant-menu-submenu-title {
    height: auto;
    padding-top: 2px !important;
    padding-bottom: 2px !important;
    margin: 0 4px !important;
  }

  svg {
    width: 20px;
    margin-left: -2px;
  }

  :hover {
    .bookmark-favourited {
      fill: #ccdee1;
      color: ${(props) =>
        props.theme.colors.components.colors.brandColor} !important;
    }
  }
`;

export const ViewCommunityButton = styled(Button)`
  font-weight: 600;
  padding-left: ${(props) => props.theme.spacing.normal} !important;
  padding-right: ${(props) => props.theme.spacing.normal} !important;
`;

export const StyledCol = styled(Col)`
  & > .ant-ribbon-wrapper {
    height: 100% !important;
  }
`;

export const LeaveDropdown = styled.div`
  width: 100%;
  border-radius: 8px;
  box-shadow: ${(props) => props.theme.shadow.small};
  background-color: ${(props) =>
    props.theme.colors.components.background.whiteBackground};
`;

export const StyledBookmark = styled(Bookmark)<{ isActive?: boolean }>`
  fill: ${(props) =>
    props.isActive &&
    props.theme.colors.components.colors.brandColor} !important;
`;
