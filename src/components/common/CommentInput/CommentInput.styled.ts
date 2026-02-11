import { styled } from 'styled-components';
import { Typography } from 'antd';

const { Text: AntdText } = Typography;

export const Text = styled(AntdText)`
  font-weight: 600;
  font-size: ${(props) => props.theme.fontSize.large};
`;

export const Wrapper = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.normal};

  textarea {
    flex: 1;
    height: 100px;
  }
`;

export const EditorWrapper = styled.div`
  position: relative;

  & .editor-input {
    border: 1px solid
      ${(props) => props.theme.colors.components.border.primaryBorder};
    border-radius: 6px;
    transition:
      all 0.3s,
      height 0s;
  }

  & .editor-placeholder {
    top: 17px;
    left: 13px;
  }

  & .editor-paragraph {
    margin-top: 0;
  }
`;
