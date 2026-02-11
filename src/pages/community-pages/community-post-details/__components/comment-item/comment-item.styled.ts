import { styled } from 'styled-components';
import { Typography } from 'antd';

import { Button } from 'src/components/common/Button/Button';

const { Text } = Typography;

export const Wrapper = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.normal};
`;

export const CardContainer = styled.div`
  flex: 1;
`;

export const BodyText = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.large};
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

export const DateText = styled(Text)`
  font-size: ${(props) => props.theme.fontSize.small};
`;

export const CommentWrapper = styled.div`
  .editor-paragraph {
    margin: 0;
  }
`;
