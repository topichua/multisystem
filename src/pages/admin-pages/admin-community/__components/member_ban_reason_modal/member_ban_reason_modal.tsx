import { Input } from 'antd';
import { useState } from 'react';
import { Modal } from 'src/components/common/Modal/Modal.tsx';

const { TextArea } = Input;

type MemberBanReasonModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onBan: (reason: string) => void;
};

const MemberBanReasonModal = ({
  isOpen,
  onClose,
  onBan,
  isLoading,
}: MemberBanReasonModalProps) => {
  const [reason, setReason] = useState<string>('');

  const handleClose = () => {
    setReason('');
    onClose();
  };

  const handleSubmit = () => {
    onBan(reason);
    handleClose();
  };

  return (
    <Modal
      open={isOpen}
      title="Reason for Blacklisting Member"
      destroyOnClose
      okButtonProps={{ disabled: !reason, loading: isLoading }}
      cancelButtonProps={{ disabled: isLoading }}
      onCancel={handleClose}
      onClose={handleClose}
      onOk={handleSubmit}
      okText="Blacklist"
    >
      <TextArea
        value={reason}
        placeholder="Enter a reason"
        onChange={(e) => setReason(e.target.value)}
        autoSize={{ minRows: 6, maxRows: 6 }}
      />
    </Modal>
  );
};

export default MemberBanReasonModal;
