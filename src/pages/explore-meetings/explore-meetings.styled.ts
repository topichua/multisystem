import { Layout } from 'antd';
import { Page } from 'src/components/common/page/page.tsx';
import { styled } from 'styled-components';

export const StyledInnerPageHeader = styled.div`
  box-sizing: border-box;
  line-height: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: ${(props) =>
    props.theme.colors.components.background.whiteBackground};
  border-bottom: ${(props) =>
    `1px solid ${props.theme.colors.components.border.primaryBorder}`};
  padding: 19px 36px 20px;
  min-height: 64px;
`;

export const StyledLayout = styled(Layout)`
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledSider = styled(Page.Sider)`
  max-height: 100vh;
  overflow-y: scroll;
`;
