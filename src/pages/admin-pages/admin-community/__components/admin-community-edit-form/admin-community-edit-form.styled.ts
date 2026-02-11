import { Form as AntForm } from 'antd';
import styled from 'styled-components';

export const Form = styled(AntForm)`
  .ant-form-item {
    margin: 0;
    padding: 20px 0;
    border-bottom: 1px solid #eaecf0;
  }

  .ant-form-item-label {
    padding-right: 24px;
    text-align: start;
    white-space: pre-wrap;
    display: flex;
    align-items: center;

    & .ant-typography {
      margin: 0 !important;
    }

    & > label {
      height: auto !important;
      align-items: baseline;
    }

    & > label::after {
      content: none;
    }
  }
`;

export const SwitchFormItem = styled(Form.Item)`
  .ant-row {
    align-items: center;
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
