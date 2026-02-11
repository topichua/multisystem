import { Card as AntdCard, Flex, Skeleton, Image } from 'antd';
import styled from 'styled-components';

export const Card = styled(AntdCard)<{ isMain: boolean }>`
  height: 100%;
  box-shadow: none !important;
  box-sizing: border-box;
  overflow: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;

  max-width: ${(props) => (props.isMain ? '100%' : '228px')};

  @media (max-width: 576px) {
    max-width: 100%;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .ant-card-body {
    padding: 0;
  }

  .info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;

    & > *:first-child {
      flex-shrink: 0;
    }
  }

  .link {
    transition: opacity 350ms ease;
  }

  .link:focus-visible,
  .link:hover {
    opacity: 0.75;
  }

  .title {
    font-weight: 800;
  }

  .description {
    margin: 16px 0 0;
    font-size: ${(props) => props.theme.fontSize.extraLarge};
    line-height: 32px;
    font-weight: 500;
    color: #667085;
  }

  .description--small {
    font-size: ${(props) => props.theme.fontSize.large};
    line-height: 29px;
  }

  .user {
    margin-top: 16px;
    font-weight: 600;
  }
`;

export const MainNewsCoverSkeleton = styled(Skeleton.Image)`
  min-width: 100%;
  min-height: 100%;
  height: 100%;
  border-radius: ${(props) => props.theme.spacing.tight} !important;
  box-sizing: border-box;
  width: 100%;
  display: block;
`;

export const MainNewsTextSkeleton = styled(Skeleton)`
  box-sizing: border-box;
  width: 228px;
`;

export const MainNewsCoverWrapper = styled(Flex)`
  min-height: 100%;
  min-width: 100%;
`;

export const StyledImage = styled(Image)`
  height: 300px;
  width: auto;
`;

export const Gradient = styled.div`
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 1)
  );
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 30px;
`;
