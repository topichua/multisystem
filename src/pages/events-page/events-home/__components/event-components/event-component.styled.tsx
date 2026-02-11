import styled from 'styled-components';
import { Title as AntdTitle } from 'src/components/common/Typography/Title';
import { Typography } from 'antd';
import { Card as AntdCard } from 'antd';

const { Text: AntdText } = Typography;

export const Text = styled(AntdText)`
  font-size: ${(props) => props.theme.fontSize.small};
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.tight};
`;

export const ColoredText = styled(Text)`
  color: ${(props) => props.theme.colors.components.colors.orange};
`;

export const Title = styled(AntdTitle)`
  font-weight: 500;
`;

export const ImageWrapper = styled.div<{ vertical?: boolean }>`
  img {
    width: ${(props) => (props.vertical ? '100%' : '162px')};
    height: ${(props) => (props.vertical ? '150px' : '130px')};
    object-fit: cover;
    border-radius: 8px;
  }
`;

export const Card = styled(AntdCard)<{ vertical?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.vertical ? 'column' : 'row')};
  height: ${(props) => (props.vertical ? '100%' : 'auto')};
  min-height: ${(props) => (props.vertical ? '205px' : 'auto')};

  width: 100%;
  border-radius: 12px;

  .ant-card-body {
    flex-grow: 1;
    padding: 12px;
  }
`;

export const EventWrapper = styled.div`
  img {
    width: 100%;
  }
`;

export const Bookmark = styled.div`
  position: absolute;
  right: 12px;
  top: 12px;
`;
