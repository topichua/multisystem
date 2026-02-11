import { ChevronRight } from '@untitled-ui/icons-react';
import { Typography } from 'antd';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import styled from 'styled-components';

const { Text } = Typography;

export const DayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) =>
    props.theme.colors.components.background.whiteBackground};
  width: 40px;
  height: 40px;
  font-size: 18px;
  line-height: 18px;

  align-items: center;
  gap: ${(props) => props.theme.spacing.tight};
  justify-content: center;

  padding: 0 7px;
  border-radius: 8px;
  box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.05);

  font-weight: 600;
  border: 1px solid #f2f4f7;
  text-align: center;
`;

export const DayWrapperLine = styled.div`
  width: 100%;
  height: 3px;
  background-color: ${(props) => props.theme.colors.components.colors.orange};
  border-radius: 13px;
`;

export const UpcomingEvents = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const EventStack = styled(Stack)`
  height: 64px;
  padding: 12px;
  gap: 10px;
  border-radius: 12px;
  border: 1px solid #eaecf0;
  background: #fcfcfd;
`;

export const EventTitle = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #1d2939;
`;

export const EventTitleContainer = styled(Stack)`
  max-width: 275px;
`;

export const ArrowIcon = styled(ChevronRight)`
  cursor: pointer;
`;
