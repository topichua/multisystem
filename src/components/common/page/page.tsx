import { Layout } from 'antd';
import * as React from 'react';
import styled from 'styled-components';
import { Content } from './content';
import { ContentHeader } from './content-header';
import { Section } from './section';
import { Sider } from './sider';
import { Wrapper } from './wrapper';
import { HEADER_HEIGHT } from 'src/pages/authorized/header/header.styled';

export const StyledPage = styled(Layout)`
  padding-right: 0;
  padding-left: 0;
  min-height: calc(100vh - ${HEADER_HEIGHT}px);
  max-width: 1920px;
  margin: 0 auto;
`;

interface PageProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export const Page: React.FunctionComponent<PageProps> & {
  Wrapper: typeof Wrapper;
  Section: typeof Section;
  Sider: typeof Sider;
  Content: typeof Content;
  ContentHeader: typeof ContentHeader;
} = (props) => {
  const { children, ...restProps } = props;
  return <StyledPage {...restProps}>{children}</StyledPage>;
};

Page.Wrapper = Wrapper;
Page.Section = Section;
Page.Sider = Sider;
Page.Content = Content;
Page.ContentHeader = ContentHeader;
