import styled from 'styled-components';
import { Menu as AntdMenu, Layout, MenuProps } from 'antd';
import { Page } from 'src/components/common/page/page';
import { HEADER_HEIGHT } from '../authorized/header/header.styled';

const { Sider: AntdSider } = Layout;

export const Sider = styled(AntdSider)`
  &.ant-layout-sider {
    position: sticky;
    top: ${HEADER_HEIGHT}px;
    height: calc(100vh - ${HEADER_HEIGHT}px);
    padding: 0 12px;
    box-sizing: border-box;
    border-right: 1px solid
      ${(props) => props.theme.colors.components.border.primaryBorder};
  }
`;

export const Menu = styled((props: MenuProps) => <AntdMenu {...props} />)`
  background: ${(props) =>
    props.theme.colors.components.background.whiteBackground};

  .ant-menu-item {
    margin-block: 16px;
    margin-inline: 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 0.2fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    'leftSideHeader rightSideHeader'
    'innerSider innerContent';
  border: ${(props) =>
    `1px solid ${props.theme.colors.components.border.primaryBorder}`};
  border-radius: ${(props) => props.theme.radius.extraLarge};
  background: white;
  min-height: calc(100vh - 120px);
`;

export const LeftSideHeader = styled.div`
  padding: 18px 24px;
  border-bottom: ${(props) =>
    `1px solid ${props.theme.colors.components.border.primaryBorder}`};
  border-right: ${(props) =>
    `1px solid ${props.theme.colors.components.border.primaryBorder}`};
  grid-area: leftSideHeader;
`;

export const RightSideHeader = styled.div`
  padding: 18px 24px;
  border-bottom: ${(props) =>
    `1px solid ${props.theme.colors.components.border.primaryBorder}`};
  grid-area: rightSideHeader;
`;

export const InnerSider = styled.div`
  padding: 18px 24px;
  border-right: ${(props) =>
    `1px solid ${props.theme.colors.components.border.primaryBorder}`};
  grid-area: innerSider;
`;

export const InnerContent = styled.div`
  padding: 18px 24px;
  grid-area: innerContent;
`;

export const PageContent = styled(Page.Content)`
  min-height: auto;
  height: auto;
`;
