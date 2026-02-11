import { Modal } from 'antd';
import { styled } from 'styled-components';

export const StyledModal = styled(Modal)`
  .ant-modal-footer {
    display: none;
  }

  .ant-modal-title {
    div {
      display: flex;
    }

    h4 {
      font-size: 18px;
      font-weight: 600;
      line-height: 28px;
      margin: 0;
    }
  }
`;
