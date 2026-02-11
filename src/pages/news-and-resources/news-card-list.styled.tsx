import { Col, Flex, Input, MenuProps } from 'antd';
import { Menu as CommonMenu } from 'src/components/common/menu/menu.tsx';
import styled, { keyframes } from 'styled-components';

import { HEADER_HEIGHT } from '../authorized/header/header.styled';

export const StyledCardContainer = styled.div`
  height: calc(100vh - ${HEADER_HEIGHT}px);
  overflow-y: scroll;
  position: relative;
  background-color: #fcfcfd;
  width: 100%;
`;

export const StyledStack = styled(Flex)`
  padding: 0 16px 24px;
`;

const fadeIn = keyframes`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`;

export const StyledCol = styled(Col)<{ $id: number }>`
  animation: ${fadeIn} 0.5s ease-out;
  animation-fill-mode: both;
  animation-delay: ${({ $id }) => $id * 0.1}s;
`;

export const StyledSearch = styled(Input)<{ marginTop?: number }>`
  height: 44px;
  padding: 10px 14px 10px 14px;
  border-radius: 8px;
  border: 1px solid #d0d5dd;
  box-shadow: 0 1px 2px 0 #1018280d;
  background: #fff;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  margin-top: ${({ marginTop }) => marginTop}px;
  margin-bottom: 24px;

  ::placeholder {
    color: #667085;
  }

  path {
    color: #667085;
  }
`;

export const MenuStyled = styled((props: MenuProps) => (
  <CommonMenu {...props} />
))`
  .ant-menu-sub {
    background-color: transparent !important;
  }

  .ant-menu {
    li {
      height: 30px;
    }
  }

  .ant-menu-submenu-title {
    h5 {
      font-size: 14px !important;
      font-weight: 700;
      line-height: 20px;
      color: ${(props) => props.theme.colors.components.colors.mono900};
    }

    svg {
      path {
        stroke-width: 1.3;
      }
    }
  }
`;
