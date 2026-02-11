import { Skeleton, Typography } from 'antd';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Title } from 'src/components/common/Typography/Title.tsx';
import styled from 'styled-components';

const { Text } = Typography;

export const SideBlockStyled = styled(Stack)`
  width: 420px;
  padding: 24px 42px;
  box-sizing: border-box;
  gap: 24px;
  position: sticky;
  top: 64px;

  h4 {
    margin-bottom: 12px !important;
  }

  @media (max-width: 1120px) {
    display: none;
  }
`;

export const CPDBlock = styled(Stack)`
  padding: 16px;
  gap: 12px;
  border-radius: 12px;
  background: #fcfcfd;
  border: 1px solid #eaecf0;
`;

export const CPDInfoText = styled(Title)`
  color: #005b6a !important;
  font-weight: 500;

  span {
    font-weight: 500;
  }
`;

export const LinkText = styled(Text)`
  color: #004c58 !important;
  font-weight: 600 !important;
  font-size: 16px !important;
`;

export const CalendarLoader = styled(Skeleton.Button)`
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  min-height: 40px !important;
`;

export const LoadingStack = styled(Stack)`
  height: 64px;
  padding: 12px;
  gap: 10px;
  border-radius: 12px;
  border: 1px solid #eaecf0;
  background: #fcfcfd;
`;

export const Loading = styled(Stack)`
  div {
    width: 100%;

    :first-child {
      flex: 0;
    }
  }
`;

export const StyledUserInfo = styled(Stack)`
  box-sizing: border-box;
  padding: 16px;
  border-radius: 8px;
  background: #fcfcfd;
  border: 1px solid #eaecf0;
`;

export const StyledTextIcon = styled(Stack)`
  flex-wrap: nowrap;
  align-items: flex-start;

  span {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #475467;
  }

  svg {
    color: #004c58;

    path {
      stroke-width: 1.3;
    }
  }
`;
