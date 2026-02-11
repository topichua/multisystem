import { Button, Card, Collapse as AntdCollapse, Typography } from 'antd';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import styled from 'styled-components';

const { Text } = Typography;

export const StyledCard = styled(Card)`
  max-width: 800px;
  margin: 20px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: none !important;
  background-color: transparent;

  & th.ant-descriptions-item {
    padding-bottom: 0px !important;
  }

  & .ant-card-head {
    border-bottom: 0px !important;
  }

  & .ant-card-body {
    padding: 0px;
    padding-left: 36px !important;
  }

  &.ant-card {
    margin: 0px !important;
    margin-top: 0 !important;
    box-shadow: none;
  }
`;

export const StyledTitle = styled(Text)`
  display: inline-flex;
  align-items: center !important;
  font-size: 22px;
  margin-bottom: 10px;

  & > * {
    & > svg {
      margin-right: 6px;
      vertical-align: sub;
    }
  }
`;

export const AttachmentButton = styled(Button)`
  margin-right: 8px;
`;

export const StyledIframe = styled.iframe`
  max-height: calc(100vh - 55px) !important;
  border: none !important;
  width: 100%;
  height: 100%;
`;

export const VerticalLine = styled.div`
  position: absolute;
  top: 35px;
  left: 0;
  bottom: 10px;
  width: 1px;
  background-color: rgba(234, 236, 240, 1);
  transition: background-color 0.3s ease;

  &::after {
    background-color: red;
    content: '';
    width: 10px;
    height: 10px;
    top: -5px;
    bottom: 1px;
    z-index: 33;
  }
`;

export const Collapse = styled(AntdCollapse)`
  border: none;

  .ant-collapse-item {
    background: white;

    & .ant-collapse-header {
      align-items: center;
      width: fit-content;
      padding: 0;
    }
  }

  .ant-collapse-content {
    border: none;

    .ant-collapse-content-box {
      padding: 8px 0 0;
    }
  }
`;

export const StyleStack = styled(Stack)`
  padding: 15px 0;
`;
