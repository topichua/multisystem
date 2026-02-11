import { Menu as AntdMenu, MenuProps, Typography } from 'antd';
import { FC } from 'react';
import { Title } from 'src/components/common/Typography/Title';
import styled from 'styled-components';

const { Text } = Typography;

export const MenuIconWrapper = styled.div`
  border: ${(props) =>
    `1px solid ${props.theme.colors.components.border.primaryBorder}`};
  border-radius: 12px;
  background: ${(props) =>
    props.theme.colors.components.background.whiteBackground};
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    color: ${(props) => props.theme.colors.components.colors.primary};
    width: 18px;
    height: 18px;
  }
`;

const StyledMenu: FC<MenuProps> = (props) => <AntdMenu {...props} />;

export const UserMenu = styled(StyledMenu)`
  .ant-menu-item {
    padding-inline: 8px;
    text-wrap: pretty;
  }

  .ant-menu-item-icon {
    min-width: 40px !important;
  }

  .ant-menu-title-content {
    overflow-wrap: break-word;
  }
`;

export const UserMenuTitle = styled(Title)`
  padding: 8px 16px 0 12px;
`;

export const UserMenuDescription = styled(Text)`
  padding: 8px 16px 0 12px;
`;
