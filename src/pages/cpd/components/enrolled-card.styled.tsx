import { Typography } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

export const EnrolledCompletedLabel = styled.div`
  border-radius: 16px;
  padding: 2px 10px;
  background-color: ${(props) =>
    props.theme.colors.components.colors.successColor};
  color: ${(props) => props.theme.colors.components.colors.whiteTextColor};
  line-height: 0;
`;

export const EnrolledCompletedLabelText = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.components.colors.whiteTextColor};
`;
