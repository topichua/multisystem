import { styled } from 'styled-components';
import { Typography } from 'antd';

const { Text } = Typography;

export const ActionText = styled(Text)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.extraTight};
  font-weight: 600;
  font-size: ${(props) => props.theme.fontSize.medium};
  color: ${(props) =>
    props.active
      ? props.theme.colors.components.colors.primary
      : props.theme.colors.components.colors.mono500};
  transition: 0.2s;
  user-select: none;
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.colors.components.colors.primary};
  }
`;
