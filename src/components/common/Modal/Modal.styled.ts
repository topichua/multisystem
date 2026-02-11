import { styled } from 'styled-components';
import { Modal as AntdModal } from 'antd';

export const Modal = styled(AntdModal)`
  .ant-modal-content {
    padding: 20px 0;
  }

  .ant-modal-header,
  .ant-modal-footer,
  .ant-modal-body {
    padding: 0 24px;
  }

  .ant-modal-body {
    margin-bottom: ${(props) => props.theme.spacing.extraLoose};
    max-height: calc(100vh - 200px);
    overflow-y: auto;
    padding: 0 24px;
  }
`;
