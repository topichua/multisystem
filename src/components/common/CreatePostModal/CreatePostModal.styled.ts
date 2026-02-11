import { styled } from 'styled-components';
import { Typography } from 'antd';

import { Modal as CommonModal } from '../Modal/Modal';

const { Text } = Typography;

export const Modal = styled(CommonModal)`
  @media (max-width: 576px) {
    &.ant-modal {
      top: 0 !important;
      padding-bottom: 0;
    }

    .ant-modal-content {
      display: flex;
      flex-direction: column;
    }
  }
`;

export const FormLabel = styled(Text)`
  font-weight: 600;
  font-size: ${(props) => props.theme.fontSize.medium};
`;
