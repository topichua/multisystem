import { useBoolean } from 'ahooks';
import { notification } from 'antd';
import { observer } from 'mobx-react';
import { Button } from 'src/components/common/Button/Button.tsx';
import { Divider } from 'src/components/common/Divider/Divider.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import * as S from 'src/pages/admin-pages/admin-community/__components/share_meeting_modal/ShareMeetingModal.styled.ts';
import { useCommunityManagementStore } from 'src/pages/admin-pages/admin-community/admin-community.provider.tsx';
import { communityApi } from 'src/transport/communities/communities.api.ts';
import { BodyComponentProps, MEETING_VISIBILITY } from '../../const.tsx';

export const PushNotificationBody = observer(
  ({
    handleCancel,
    meeting,
    communityId,
    isNotificationSend,
    setNotificationSend,
  }: BodyComponentProps) => {
    const { loadMeetings } = useCommunityManagementStore();

    const [isLoading, { setTrue: startLoading, setFalse: stopLoading }] =
      useBoolean(false);

    const handleSend = () => {
      if (!meeting) return;

      startLoading();
      communityApi
        .sendNotificationMeetingAmdin(communityId, meeting.id)
        .then(() => {
          notification.success({
            message: 'The notification has been sent successfully',
          });
          loadMeetings();
        })
        .finally(() => {
          stopLoading();
          setNotificationSend();
        });
    };

    return (
      <Stack vertical>
        <Divider spacing="tight" />
        <S.StyledText>
          {meeting?.visible === MEETING_VISIBILITY.PRIVATE
            ? 'This notification will alert all invited community members, including ones that have already clicked going. You can not undo this action.'
            : 'This notification will alert all members within this community, including ones that have already clicked going. You can not undo this action.'}
        </S.StyledText>
        <S.StyledButtonContainer distribution="trailing">
          <Button type="text" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="primary"
            disabled={isNotificationSend}
            loading={isLoading}
            onClick={handleSend}
          >
            Send
          </Button>
        </S.StyledButtonContainer>
      </Stack>
    );
  }
);
