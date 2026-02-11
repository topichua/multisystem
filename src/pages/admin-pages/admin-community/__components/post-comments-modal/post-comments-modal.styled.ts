import { styled } from 'styled-components';

import { Modal as CommonModal } from 'src/components/common/Modal/Modal';

export const Modal = styled(CommonModal)`
  .ant-modal-content {
    padding: 0px;
  }

  .ant-modal-header {
    padding: 24px 24px 16px 24px;
    margin-bottom: 0;

    border-bottom: 1px solid
      ${(props) => props.theme.colors.components.border.primaryBorder};
  }

  .ant-modal-footer {
    height: 88px;
    padding: 24px;
    margin-top: 0;
    border-top: 1px solid
      ${(props) => props.theme.colors.components.border.primaryBorder};
  }

  .ant-modal-body {
    min-height: 60vh;
    max-height: 60vh;
    padding: 24px;
    margin-bottom: 0;
    overflow: auto;
  }

  .ant-modal-close {
    top: 16px;
    right: 16px;
  }
`;

export const CommentsList = styled.div<{ noPadding?: boolean }>`
  padding-left: ${(props) => (props.noPadding ? 0 : 50)}px;
`;
