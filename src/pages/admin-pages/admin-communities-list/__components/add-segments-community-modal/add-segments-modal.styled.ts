import { styled } from 'styled-components';
import { Collapse } from 'antd';

import { Modal as CommonModal } from 'src/components/common/Modal/Modal.tsx';

export const Modal = styled(CommonModal)`
  .ant-modal-body {
    padding-right: 0;
  }
`;

export const ListWrapper = styled.div<{ alignCenter?: boolean }>`
  height: 55vh;
  overflow-y: auto;
  scrollbar-gutter: stable;
  padding-right: ${(props) => props.theme.spacing.extraLoose};
  margin-top: ${(props) => props.theme.spacing.normal};
`;

export const StyledCollapse = styled(Collapse)`
  &.ant-collapse {
    background-color: transparent;
    border: none;
  }

  & .ant-collapse-item {
    background-color: transparent;
    border-bottom: none;
  }

  & .ant-collapse-content {
    border-top: none;
  }

  & .ant-collapse-header {
    flex-direction: row-reverse;

    & .ant-collapse-expand-icon {
      padding-inline-end: 0 !important;
    }

    & .ant-collapse-header-text {
      font-weight: 600;
      font-size: 16px;
    }
  }

  & .ant-collapse-content-box {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
  }
`;

export const StyledCollapsedIcon = styled.div<{ isActive?: boolean }>`
  transform: rotate(${(props) => (props.isActive ? -180 : 0)}deg);
  transition: 0.2s;
`;
