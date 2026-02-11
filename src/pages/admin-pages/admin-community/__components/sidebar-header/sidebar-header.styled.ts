import { Typography } from 'antd';
import { styled } from 'styled-components';

const { Paragraph } = Typography;

export const InfoText = styled(Paragraph)`
  &.ant-typography {
    margin: 0;
  }

  font-size: ${(props) => props.theme.fontSize.small};
  font-weight: 500;
  color: ${(props) => props.theme.colors.components.colors.mono500};
`;
