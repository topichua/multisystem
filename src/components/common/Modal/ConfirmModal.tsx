import { Typography } from 'antd';

import { Stack } from '../Stack/Stack';
import { Button, ButtonProps } from '../Button/Button';

import { Modal } from './Modal';

const { Text } = Typography;

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
  isLoading?: boolean;
  confirmButtonProps?: ButtonProps;
  onConfirm: () => void;
  onClose: () => void;
};

export const ConfirmModal = ({
  isOpen,
  title,
  description,
  isLoading = false,
  cancelButtonText = 'Cancel',
  confirmButtonText = 'Confirm',
  confirmButtonProps = {},
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <Modal
      open={isOpen}
      title={title}
      footer={
        <Stack fill>
          <Button block size="middle" disabled={isLoading} onClick={onClose}>
            {cancelButtonText}
          </Button>
          <Button
            {...confirmButtonProps}
            type="primary"
            block
            size="middle"
            loading={isLoading}
            onClick={onConfirm}
          >
            {confirmButtonText}
          </Button>
        </Stack>
      }
      onClose={onClose}
      onCancel={onClose}
    >
      <Stack vertical spacing="extraTight">
        {description && <Text type="secondary">{description}</Text>}
      </Stack>
    </Modal>
  );
};
