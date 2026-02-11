import { CalendarDate, CalendarPlus02 } from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { notification, Spin } from 'antd';
import { observer } from 'mobx-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'src/components/common/Button/Button';
import { FixedContentHeader } from 'src/components/common/Fixed-inner-header/fixed-content-header';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { Page } from 'src/components/common/page/page';
import { Stack } from 'src/components/common/Stack/Stack';
import { ActionStatusEnum } from 'src/components/common/UploadAttachments/UploadAttachments.tsx';
import { MEETING_VISIBILITY } from 'src/pages/admin-pages/admin-community/__components/share_meeting_modal/const.tsx';
import ShareMeetingModal from 'src/pages/admin-pages/admin-community/__components/share_meeting_modal/ShareMeetingModal.tsx';
import { CreateMeetingForm } from 'src/pages/admin-pages/admin-community/admin-community-meetings/types.ts';
import { communityApi } from 'src/transport/communities/communities.api.ts';
import { CommunityMeeting } from 'src/transport/communities/communities.dto.ts';
import { calculateDuration, combineDateAndTime } from 'src/utils/time.ts';
import { InviteMembersModal } from '../__components/invite-members-modal/InviteMembersModal';
import { ManageMeetingModal } from '../__components/manage_meeting_modal/ManageMeetingModal';
import { useCommunityManagementStore } from '../admin-community.provider';
import { MeetingList } from './MeetingList';
import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';

export type CommunityMeetingShare = Pick<
  CommunityMeeting,
  'id' | 'users' | 'visible' | 'sendNotification' | 'toDashBoard'
>;

export const AdminCommunityMeetings = observer(() => {
  const [
    isOpenManageMeetingModal,
    { setTrue: openManageMeetingModal, setFalse: closeManageMeetingModal },
  ] = useBoolean(false);

  const [
    isOpenShareMeetingModal,
    { setTrue: openShareMeetingModal, setFalse: closeShareMeetingModal },
  ] = useBoolean(false);

  const [
    isInviteMembersModal,
    { setTrue: openInviteMembersModal, setFalse: closeInviteMembersModal },
  ] = useBoolean(false);

  const [meetingData, setMeetingData] = useState<CommunityMeetingShare | null>(
    null
  );
  const [updatedMeeting, setUpdatedMeeting] = useState<CommunityMeeting | null>(
    null
  );

  const {
    communityId,
    loadMeetings,
    isMeetingsLoading,
    createMeeting,
    editMeeting,
    permissions,
    isCreateMeetingLoading,
    isEditMeetingLoading,
  } = useCommunityManagementStore();
  const { globalPermission } = useCurrentUserStore();

  useEffect(() => {
    loadMeetings();
  }, []);

  useEffect(() => {
    if (updatedMeeting) {
      openManageMeetingModal();
    }
  }, [updatedMeeting]);

  useEffect(() => {
    if (!isOpenManageMeetingModal) {
      setUpdatedMeeting(null);
    }
  }, [isOpenManageMeetingModal]);

  const handleInviteMembersClick = useCallback(
    (meeting: CommunityMeeting) => {
      setMeetingData({
        id: meeting.id,
        users: meeting.users,
        visible: meeting.visible,
        sendNotification: meeting.sendNotification,
        toDashBoard: meeting.toDashBoard,
      });
      openInviteMembersModal();
    },
    [openInviteMembersModal]
  );

  const handleShareMeetingClick = useCallback(
    (meeting: CommunityMeeting) => {
      setMeetingData({
        id: meeting.id,
        users: meeting.users,
        visible: meeting.visible,
        sendNotification: meeting.sendNotification,
        toDashBoard: meeting.toDashBoard,
      });
      openShareMeetingModal();
    },
    [openShareMeetingModal]
  );

  const handleSubmit = async (values: CreateMeetingForm) => {
    const {
      meetingId,
      name,
      meetingPassword,
      meetingLink,
      startDate,
      startDateFrom,
      startDateTo,
      rsvpDate,
      description,
      assets,
      visible,
      imageFile,
    } = values;

    const meetingData = {
      name,
      description,
      meetingLink,
      meetingId,
      meetingPassword,
      startDate: combineDateAndTime(startDate, startDateFrom).toISOString(),
      duration: calculateDuration(startDateFrom, startDateTo),
      visible: Number(visible),
      sendNotification: false,
      imageFile,
      ...(rsvpDate ? { rsvpDate } : { disableRSVPDate: true }),
    };

    if (updatedMeeting) {
      editMeeting({ id: updatedMeeting.id, ...meetingData })
        .then(() => {
          const filesForDelete = assets?.filter(
            (file) => file.actionStatus === ActionStatusEnum.Deleted
          );
          const filesToCreate = assets?.filter(
            (file) => file.actionStatus === ActionStatusEnum.Added
          );

          if (filesForDelete?.length) {
            filesForDelete.forEach((file) => {
              communityApi.removeMeetingAsset(
                communityId,
                updatedMeeting.id,
                file.uid
              );
            });
          }

          if (filesToCreate?.length) {
            filesToCreate.forEach((file) => {
              communityApi.addMeetingAsset(
                communityId,
                updatedMeeting.id,
                file
              );
            });
          }
        })
        .catch(() => {
          notification.error({
            message: 'Error editing meeting. Try again.',
          });
        })
        .finally(closeManageMeetingModal);
    } else {
      createMeeting(meetingData)
        .then((newMeetID) => {
          if (assets?.length) {
            assets.forEach((file) => {
              communityApi.addMeetingAsset(communityId, newMeetID, file);
            });
          }
          setMeetingData({
            id: newMeetID,
            users: [],
            visible: meetingData.visible,
            sendNotification: false,
            toDashBoard: false,
          });
        })
        .catch(() => {
          notification.error({
            message: 'Error creating meeting. Try again.',
          });
        })
        .finally(() => {
          if (meetingData.visible === MEETING_VISIBILITY.PRIVATE) {
            openInviteMembersModal();
          } else {
            openShareMeetingModal();
          }
          closeManageMeetingModal();
        });
    }
  };

  const canActionMeeting =
    permissions?.meetingAll || globalPermission?.meetingAll;

  return (
    <>
      <Spin spinning={isMeetingsLoading}>
        <Stack vertical spacing="none">
          <FixedContentHeader>
            <InnerPageHeader title="Meetings" icon={<CalendarDate />}>
              {canActionMeeting && (
                <Stack distribution="trailing">
                  <Button
                    type="primary"
                    icon={<CalendarPlus02 height={20} />}
                    onClick={openManageMeetingModal}
                  >
                    Create meeting
                  </Button>
                </Stack>
              )}
            </InnerPageHeader>
          </FixedContentHeader>
          <Page.Content style={{ maxWidth: 650, margin: '0 auto' }}>
            <MeetingList
              canActionMeeting={canActionMeeting}
              onEditClick={setUpdatedMeeting}
              handleInviteMembersClick={handleInviteMembersClick}
              handleShareMeetingClick={handleShareMeetingClick}
              isMeetingsLoading={isMeetingsLoading}
            />
          </Page.Content>
        </Stack>
      </Spin>
      <ManageMeetingModal
        isOpen={isOpenManageMeetingModal}
        onClose={() => {
          setUpdatedMeeting(null);
          closeManageMeetingModal();
        }}
        onCreate={handleSubmit}
        meeting={updatedMeeting}
        isLoading={isEditMeetingLoading || isCreateMeetingLoading}
        communityId={communityId}
      />
      <ShareMeetingModal
        isOpen={isOpenShareMeetingModal}
        meeting={meetingData}
        communityId={communityId}
        onClose={() => {
          setMeetingData(null);
          closeShareMeetingModal();
        }}
      />
      <InviteMembersModal
        isOpen={isInviteMembersModal}
        meeting={meetingData}
        communityId={communityId}
        onClose={() => {
          setMeetingData(null);
          closeInviteMembersModal();
        }}
      />
    </>
  );
});
