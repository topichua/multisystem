import styled from 'styled-components';
import { HEADER_HEIGHT } from 'src/pages/authorized/header/header.styled.tsx';
import { Flex, Switch } from 'antd';

export const StyledCardContainer = styled.div`
  height: calc(100vh - ${HEADER_HEIGHT}px);
  position: relative;
  background-color: #fcfcfd;
  width: 100%;
`;

export const StyledStack = styled(Flex)`
  padding: 0 16px 24px;
`;

export const StyledSwitch = styled(Switch)`
  &.ant-switch {
    background-color: var(--Gray-100, #f2f4f7);
  }
`;
