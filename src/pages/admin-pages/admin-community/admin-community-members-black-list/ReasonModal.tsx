import { useBoolean } from 'ahooks';
import { Input } from 'antd';
import { observer } from 'mobx-react';
import { FC, useState } from 'react';
import { Button } from 'src/components/common/Button/Button.tsx';
import { Modal } from 'src/components/common/Modal/Modal.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { useCommunityManagementStore } from 'src/pages/admin-pages/admin-community/admin-community.provider.tsx';

const { TextArea } = Input;

export type ReasonToUpdate = {
  reason: string;
  userId: string;
};

type ReasonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initReason: ReasonToUpdate;
};
export const ReasonModal = observer<FC<ReasonModalProps>>(
  ({ initReason, onClose, isOpen }) => {
    const [reason, setReason] = useState<string>(initReason.reason);
    const [isLoading, { setTrue: startLoading, setFalse: finishLoading }] =
      useBoolean(false);
    const { updateReasonBlockingMember } = useCommunityManagementStore();

    const handleSave = () => {
      startLoading();
      updateReasonBlockingMember(initReason.userId, reason)
        .then(onClose)
        .finally(finishLoading);
    };

    return (
      <Modal
        centered
        open={isOpen}
        onClose={onClose}
        onCancel={onClose}
        title="Reason for Blacklisting Member"
        okText="Save"
        footer={[
          <Stack distribution="trailing">
            <Button disabled={isLoading} onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={isLoading}
              disabled={!reason || reason == initReason.reason || isLoading}
              type="primary"
            >
              Save
            </Button>
          </Stack>,
        ]}
      >
        <TextArea
          value={reason}
          placeholder="Enter a reason"
          onChange={(e) => setReason(e.target.value)}
          autoSize={{ minRows: 10, maxRows: 10 }}
          style={{ marginTop: '16px' }}
        />
      </Modal>
    );
  }
);

export default ReasonModal;
