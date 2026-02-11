import Title from 'antd/es/typography/Title';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { InviteMembersBody } from 'src/pages/admin-pages/admin-community/__components/invite-members-modal/invite-members-body.tsx';
import { CommunityMeetingShare } from 'src/pages/admin-pages/admin-community/admin-community-meetings/admin-community-meetings.tsx';
import { useCommunityManagementStore } from 'src/pages/admin-pages/admin-community/admin-community.provider.tsx';
import * as S from './InviteMembersModal.styled.ts';

type InviteMembersModalProps = {
  isOpen: boolean;
  meeting: CommunityMeetingShare | null;
  onClose: () => void;
  communityId: string;
};

export const InviteMembersModal = observer(
  ({ isOpen, meeting, onClose, communityId }: InviteMembersModalProps) => {
    const [initMembers, setInitMembers] = useState<string[]>(
      meeting?.users.map((user) => user.userId) || []
    );
    const { meetings } = useCommunityManagementStore();

    useEffect(() => {
      if (meeting) {
        setInitMembers(meeting.users.map((user) => user.userId));
      }
    }, [meeting]);

    useEffect(() => {
      const newMeeting = meetings?.find((m) => m.id === meeting?.id);
      if (newMeeting) {
        setInitMembers(newMeeting.users.map((user) => user.userId));
      }
    }, [meeting?.id, meetings]);

    return (
      <S.StyledModal
        width={660}
        open={isOpen}
        onCancel={onClose}
        centered
        footer={[]}
        title={<Title level={4}>Invite members to meeting</Title>}
      >
        <InviteMembersBody
          communityId={communityId}
          handleCancel={onClose}
          meeting={meeting}
          setInitMembers={setInitMembers}
          initMembers={initMembers}
        />
      </S.StyledModal>
    );
  }
);

export default InviteMembersModalProps;
