import { Collapse as AntdCollapse, Card, Typography } from 'antd';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { components } from 'src/styled/definitions/colors';
import { css, keyframes, styled } from 'styled-components';

export const StartTime = styled(Typography.Text)`
  color: ${(props) => props.theme.colors.components.colors.orange};
`;

export const RsvpDate = styled(Typography.Text)`
  color: ${(props) => props.theme.colors.components.colors.mono500};
`;

export const Collapse = styled(AntdCollapse)<{
  $bgColor?: string;
  $cursor?: string;
}>`
  border: none;

  .ant-collapse-item {
    background: ${(props) => (props.$bgColor ? props.$bgColor : 'white')};

    & .ant-collapse-header {
      padding: 0;
      cursor: ${(props) => (props.$cursor ? props.$cursor : '')};
    }
  }

  .ant-collapse-content {
    border: none;
    background: ${(props) => (props.$bgColor ? props.$bgColor : 'white')};

    .ant-collapse-content-box {
      padding: 8px 0 0;
    }
  }

  .ant-collapse-expand-icon {
    padding-inline-end: 16px !important;
    padding-inline-start: 0 !important;
  }
`;

const createHighlightAnimation = () => keyframes`
    0% {
        box-shadow: 0 0 0 0 ${components.colors.brandColor}B3;
    }
    70% {
        box-shadow: 0 0 0 10px ${components.colors.brandColor}00;
    }
    100% {
        box-shadow: 0 0 0 0 ${components.colors.brandColor}00;
    }
`;

export const HighlightedCard = styled(Card)<{
  $isHighlighted?: boolean;
  $bgColor?: string;
}>`
  box-sizing: border-box;
  overflow: hidden;

  .ant-card-body {
    padding: 0;
  }

  ${(props) =>
    props.$isHighlighted &&
    css`
      animation: ${createHighlightAnimation()} 2s ease-in-out;
    `}

  ${(props) =>
    props.$bgColor &&
    css`
      background: ${props.$bgColor};
    `}
`;

export const MeetingCardContent = styled(Stack)`
  padding: 12px 24px 24px;
`;
