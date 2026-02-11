import { useBoolean } from 'ahooks';
import { notification } from 'antd';
import { observer } from 'mobx-react';
import { Button } from 'src/components/common/Button/Button.tsx';
import { Divider } from 'src/components/common/Divider/Divider.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { useCommunityManagementStore } from 'src/pages/admin-pages/admin-community/admin-community.provider.tsx';
import { communityApi } from 'src/transport/communities/communities.api.ts';
import { BodyComponentProps, MEETING_VISIBILITY } from '../../const.tsx';
import * as S from '../../ShareMeetingModal.styled.ts';

export const PublishToDashboardBody = observer(
  ({
    handleCancel,
    meeting,
    communityId,
    isPublished,
    setPublished,
  }: BodyComponentProps) => {
    const { loadMeetings } = useCommunityManagementStore();

    const [isLoading, { setTrue: startLoading, setFalse: stopLoading }] =
      useBoolean(false);

    const handleSend = () => {
      if (!meeting) return;

      startLoading();
      communityApi
        .publishDashboardMeetingAmdin(communityId, meeting.id)
        .then(() => {
          notification.success({
            message: 'The meeting has been published successfully',
          });
          loadMeetings();
        })
        .finally(() => {
          stopLoading();
          setPublished();
        });
    };

    return (
      <Stack vertical>
        <Divider spacing="tight" />
        <S.StyledText>
          {meeting?.visible === MEETING_VISIBILITY.COMMUNITY
            ? 'This meeting will be published to all community members’ dashboards, including any assets that have been added. You can not undo this action.'
            : 'This meeting will be published to all OTA members’ dashboards, including any assets that have been added. This includes members that are not part of this community. You can not undo this action.'}
        </S.StyledText>
        <S.StyledButtonContainer distribution="trailing">
          <Button type="text" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="primary"
            disabled={isPublished}
            loading={isLoading}
            onClick={handleSend}
          >
            Publish
          </Button>
        </S.StyledButtonContainer>
      </Stack>
    );
  }
);
