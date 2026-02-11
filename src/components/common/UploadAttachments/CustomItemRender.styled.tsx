import styled from 'styled-components';
import { Upload } from 'antd';
import { Stack } from 'src/components/common/Stack/Stack.tsx';

export const Dragger = styled(Upload.Dragger)`
  .ant-upload-list {
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing.normal};

    &:before {
      display: none;
    }
  }

  .ant-upload-drag {
    margin-bottom: ${(props) => props.theme.spacing.loose};
  }
`;

export const Wrapper = styled(Stack)`
  background-color: #fcfcfd;
  padding: ${(props) => props.theme.spacing.loose};
`;
