import styled from 'styled-components';

import { Divider } from 'src/components/common/Divider/Divider';
import { Modal } from 'src/components/common/Modal/Modal.tsx';

export const StyledDivider = styled(Divider)`
  margin: 0 !important;
`;

export const StyledModal = styled(Modal)`
  & .ant-modal-body {
    margin: 0;
  }
`;
