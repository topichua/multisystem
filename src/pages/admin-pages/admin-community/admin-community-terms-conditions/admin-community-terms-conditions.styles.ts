import { Stack } from 'src/components/common/Stack/Stack.tsx';
import styled from 'styled-components';

export const StyledPage = styled(Stack)`
  max-width: 1000px;
  width: 100%;
  margin: 20px auto;

  .ant-form-item {
    margin-bottom: 0;
  }
`;

export const StyledMask = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  filter: invert(1);
  z-index: 2;
`;

export const EditorWrapper = styled.div`
  position: relative;

  .editor-container {
    max-width: 1000px;

    .toolbar {
      border-top: 1px solid
        ${(props) => props.theme.colors.components.border.primaryBorder};
      border-left: 1px solid
        ${(props) => props.theme.colors.components.border.primaryBorder};
      border-right: 1px solid
        ${(props) => props.theme.colors.components.border.primaryBorder};
      border-radius: 6px 6px 0 0;
      margin-bottom: 0;
    }
  }

  & .editor-input {
    border: 1px solid
      ${(props) => props.theme.colors.components.border.primaryBorder};
    border-radius: 0 0 6px 6px;
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
