import { styled } from 'styled-components';
import { Typography } from 'antd';

import { Button } from 'src/components/common/Button/Button';
import { Card as CommonCard } from 'src/components/common/Card/Card';

const { Text } = Typography;

export const Card = styled(CommonCard)<{ isReported?: boolean }>`
  background-color: ${(props) =>
    props.isReported
      ? props.theme.colors.components.background.yellow
      : 'initial'};
  border: 1px solid
    ${(props) =>
      props.isReported
        ? props.theme.colors.components.border.yellowBorder
        : 'initial'};
`;

export const Wrapper = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.normal};
`;

export const CardContainer = styled.div`
  flex: 1;
`;

export const BodyText = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.medium};
  color: ${(props) => props.theme.colors.components.colors.mono700};
`;

export const ActionText = styled(Text)`
  font-weight: 600;
  font-size: ${(props) => props.theme.fontSize.medium};
  color: ${(props) => props.theme.colors.components.colors.mono500};
`;

export const ActionButton = styled(Button)<{ active?: boolean }>`
  font-weight: 600;

  &.ant-btn-link {
    color: ${(props) =>
      props.active
        ? props.theme.colors.components.colors.primary
        : props.theme.colors.components.colors.mono500};
  }
`;
