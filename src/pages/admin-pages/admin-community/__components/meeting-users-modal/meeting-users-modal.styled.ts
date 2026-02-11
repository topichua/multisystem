import { Modal } from 'src/components/common/Modal/Modal';
import { Tabs } from 'src/components/common/Tabs/Tabs.tsx';
import { styled } from 'styled-components';

export const StyledModal = styled(Modal)`
  overflow-y: unset;
`;

export const StyledTabs = styled(Tabs)`
  .ant-tabs-content-holder {
    margin-top: 24px;
    min-height: 145px;
    max-height: 265px;
    overflow-y: auto;
  }
`;
