import { styled } from 'styled-components';
import { Typography } from 'antd';

const { Text } = Typography;

export const CounterText = styled(Text)`
  font-weight: 700;
  font-size: ${(props) => props.theme.fontSize.extraLarge};
`;
