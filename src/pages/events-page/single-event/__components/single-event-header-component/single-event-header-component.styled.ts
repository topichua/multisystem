import styled from 'styled-components';
import { Typography } from 'antd';

const { Text: AntdText } = Typography;

export const ImageWrapper = styled.div`
  img {
    max-width: 300px;
    border-radius: 6px;
  }
`;

export const DayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.tight};
  justify-content: center;
  background-color: ${(props) =>
    props.theme.colors.components.background.whiteBackground};
  width: 54px;
  height: 54px;
  padding: 0 10px;
  border-radius: 12px;
  box-shadow: 0px 0px 24px 0px rgba(0, 0, 0, 0.05);
  font-size: 24px;
  line-height: 24px;
  font-weight: 600;
`;

export const DayWrapperLine = styled.div`
  width: 100%;
  height: 3px;
  background-color: ${(props) =>
    props.theme.colors.components.border.greenBorder};
`;

export const Text = styled(AntdText)`
  font-size: ${(props) => props.theme.fontSize.small};
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.tight};
`;

export const DateText = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.medium};
  color: ${(props) => props.theme.colors.components.colors.successColor};
`;
