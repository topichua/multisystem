import { Spin } from 'antd';
import styled from 'styled-components';
import { HEADER_HEIGHT } from '../authorized/header/header.styled';

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IFrameWrapper = styled.div`
  height: calc(100vh - ${HEADER_HEIGHT}px);
`;

export const StyledSpin = styled(Spin)`
  & .ant-spin-nested-loading {
    height: 100% !important;
  }
`;
