import { Download01 } from '@untitled-ui/icons-react';
import { Card } from 'antd';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import styled from 'styled-components';
import { Modal } from 'antd';

export const ImageContainer = styled(Stack)`
  margin-top: 15px;
`;

export const StyledCard = styled(Card)`
  background: #dfdfdf;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;

  .ant-card-body {
    padding: 0;
  }

  .ant-image-preview-img {
    max-width: 500px;
  }
`;

export const DownloadButton = styled(Download01)`
  position: absolute;
  top: 15px;
  right: 15px;
  background: #fff;
  padding: 5px;
  border-radius: 100px;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

export const StyledModal = styled(Modal)`
  .ant-modal-body {
    max-height: 70vh;
    overflow-y: scroll;
  }
`;
