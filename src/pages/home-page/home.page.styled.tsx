import { Button } from 'src/components/common/Button/Button.tsx';
import styled from 'styled-components';
import { Col, Layout, Row, Skeleton } from 'antd';
import { HEADER_HEIGHT } from '../authorized/header/header.styled';
import { Card } from 'src/components/common/Card/Card';

export const Content = styled(Layout)`
  margin: 0;
  height: auto;
  max-width: 888px;
  box-sizing: border-box;
  background: ${(props) =>
    props.theme.colors.components.background.whiteBackground};
  border-right: 1px solid #eaecf0;
  padding: 0 40px 0 36px;

  @media (max-width: 1320px) {
    border-right: none;
  }
`;

export const Section = styled.div`
  padding: 36px 0;
  justify-content: center;
  background: ${(props) =>
    props.theme.colors.components.background.whiteBackground};

  @media (max-width: 768px) {
    padding: 40px 0;
  }
`;

export const SectionWrapper = styled.div`
  box-sizing: border-box;
  max-width: 1280px;
  margin: 0 auto;

  h3 {
    margin-bottom: 12px !important;
  }
`;

export const ArticleCol = styled(Col)`
  @media (max-width: 768px) {
    padding: 20px 0;
  }
`;

export const ArticleRow = styled(Row)`
  @media (max-width: 576px) {
    row-gap: 20px !important;
  }
`;

export const AnnouncementSection = styled.div`
  position: sticky;
  top: ${HEADER_HEIGHT}px;
  background-color: ${(props) =>
    props.theme.colors.components.background.mono25};
  padding: ${(props) => props.theme.spacing.normal} 0;
  border-bottom: 1px solid
    ${(props) => props.theme.colors.components.border.primaryBorder};
  border-top: 1px solid
    ${(props) => props.theme.colors.components.border.primaryBorder};
  z-index: 98;

  .announcement-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background-color: ${(props) =>
      props.theme.colors.components.background.whiteBackground};
    border: 1px solid
      ${(props) => props.theme.colors.components.border.primaryBorder};
  }
`;

export const ArticlePreviewMenu = styled.div`
  @media (min-width: 992px) {
    .ant-menu {
      margin-top: 24px;
      border-inline-end: none !important;
    }

    .ant-menu-item {
      position: relative;
      color: ${(props) => props.theme.colors.components.colors.mono500};
      font-weight: 500;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        display: block;
        width: 2px;
        height: 100%;
        background-color: ${(props) =>
          props.theme.colors.components.colors.brandColor};
        opacity: 0;
      }
    }

    .ant-menu-item-selected {
      color: #1d756d;
      background-color: transparent;
      border-radius: 0;

      &::before {
        opacity: 1;
      }
    }
  }
`;

export const BrandLine = styled.hr`
  border: 3px solid
    ${(props) => props.theme.colors.components.colors.brandColor};
  width: 80px;
`;

export const CommunitySkeleton = styled(Skeleton.Image)`
  &.ant-skeleton {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 150px;
  }
`;

export const CommunityCard = styled(Card)`
  transition: 0.2s;

  &:hover {
    box-shadow: ${(props) => props.theme.shadow.small};
  }
`;

export const StyledButtonMeeting = styled(Button)`
  .ant-typography {
    color: ${(props) => props.theme.colors.components.colors.brandColor};
  }

  path {
    color: ${(props) => props.theme.colors.components.colors.brandColor};
  }
`;

export const StyledMeetingBlock = styled(Row)`
  max-height: 665px;
  overflow-y: scroll;

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledCommunitiesBlock = styled(Col)`
  max-height: 590px;
  overflow-y: scroll;

  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;

  @media (max-width: 1120px) {
    grid-template-columns: 2fr;
    width: 100vw;
  }
`;
