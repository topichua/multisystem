import Title from 'antd/es/typography/Title';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { InnerModal } from 'src/pages/admin-pages/admin-community/__components/share_meeting_modal/const.tsx';
import ModalBlock from 'src/pages/admin-pages/admin-community/__components/share_meeting_modal/ModalBlock.tsx';
import { CommunityMeetingShare } from 'src/pages/admin-pages/admin-community/admin-community-meetings/admin-community-meetings.tsx';
import * as S from './ShareMeetingModal.styled.ts';
import { useCommunityManagementStore } from '../../admin-community.provider.tsx';

type ShareMeetingModalProps = {
  isOpen: boolean;
  meeting: CommunityMeetingShare | null;
  onClose: () => void;
  communityId: string;
};

const initStep = { title: 'Share meeting', body: ModalBlock };

export const ShareMeetingModal = observer(
  ({ isOpen, meeting, onClose, communityId }: ShareMeetingModalProps) => {
    const [activeStep, setActiveStep] = useState<InnerModal>(initStep);
    const [isNotificationSend, setNotificationSend] = useState<boolean>(
      !!meeting?.sendNotification
    );

    const [isPublished, setPublished] = useState<boolean>(
      !!meeting?.toDashBoard
    );
    const { community } = useCommunityManagementStore();

    useEffect(() => {
      setActiveStep(initStep);
      setNotificationSend(!!meeting?.sendNotification);
      setPublished(!!meeting?.toDashBoard);
    }, [meeting]);

    return (
      <S.StyledModal
        width={660}
        open={isOpen}
        onCancel={onClose}
        centered
        footer={[]}
        title={
          <Stack alignment="center">
            {activeStep.hasPrevStep && (
              <S.StyledIcon onClick={() => setActiveStep(initStep)} />
            )}
            <Title level={4}>{activeStep.title}</Title>
          </Stack>
        }
      >
        <activeStep.body
          setActiveStep={setActiveStep}
          meeting={meeting}
          communityId={communityId}
          communityAlias={community?.alias || ''}
          handleCancel={onClose}
          setNotificationSend={() => setNotificationSend(true)}
          isNotificationSend={isNotificationSend}
          setPublished={() => setPublished(true)}
          isPublished={isPublished}
        />
      </S.StyledModal>
    );
  }
);

export default ShareMeetingModal;
