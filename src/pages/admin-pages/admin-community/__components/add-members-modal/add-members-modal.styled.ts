import { styled } from 'styled-components';
import { Modal as CommonModal } from 'src/components/common/Modal/Modal';

export const Modal = styled(CommonModal)`
  .ant-modal-footer {
    text-align: left;
  }
`;

export const ListWrapper = styled.div<{ alignCenter?: boolean }>`
  height: 365px;
  overflow-y: auto;
  padding-right: ${(props) => props.theme.spacing.extraLoose};
  border-bottom: 1px solid
    ${(props) => props.theme.colors.components.border.primaryBorder};

  ${(props) =>
    props.alignCenter &&
    `
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`;
