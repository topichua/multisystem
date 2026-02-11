import { Button, Checkbox, Skeleton } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Modal } from 'src/components/common/Modal/Modal';
import { Stack } from 'src/components/common/Stack/Stack';
import { communityApi } from 'src/transport/communities/communities.api';
import { CommunitiyDto } from 'src/transport/communities/communities.dto';

type AgreementModalProps = {
  currentCommunity: CommunitiyDto | null;
  onConfirm: () => void;
  setIsModalVisible: (
    value: boolean
  ) => void | Dispatch<SetStateAction<boolean>>;
  okButtonText?: string;
  isModalVisible: boolean;
};

export const AgreementModal = ({
  currentCommunity,
  okButtonText = 'Join community',
  onConfirm,
  setIsModalVisible,
  isModalVisible,
}: AgreementModalProps) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreementContent, setAgreementContent] = useState('');

  const handleOk = () => {
    if (isAccepted) {
      onConfirm();
      // setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onAcceptChange = (e: any) => {
    setIsAccepted(e.target.checked);
  };

  useEffect(() => {
    setIsLoading(true);
    if (!currentCommunity?.id) return;
    communityApi
      .getCommunityAgreement(currentCommunity.id)
      .then((res) => {
        setAgreementContent(res as any);
      })
      .catch()
      .finally(() => setIsLoading(false));
  }, [currentCommunity?.id]);

  return (
    <Modal
      title="Terms and Conditions for joining"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Stack alignment="center" distribution="equalSpacing">
          <Checkbox onChange={onAcceptChange}>I accept</Checkbox>,
          <Stack alignment="center">
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>
            ,
            <Button
              key="submit"
              type="primary"
              disabled={!isAccepted}
              onClick={handleOk}
            >
              {okButtonText}
            </Button>
          </Stack>
        </Stack>,
      ]}
      style={{ top: 20 }}
    >
      {isLoading ? (
        <Skeleton active />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: agreementContent }}></div>
      )}
    </Modal>
  );
};
