import { ChevronRight, MessageAlertSquare } from '@untitled-ui/icons-react';
import { Typography } from 'antd';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import {
  InnerModal,
  MEETING_VISIBILITY,
} from 'src/pages/admin-pages/admin-community/__components/share_meeting_modal/const.tsx';
import { Button } from 'src/components/common/Button/Button.tsx';
import * as S from 'src/pages/admin-pages/admin-community/__components/share_meeting_modal/ShareMeetingModal.styled.ts';
import { CommunityMeetingShare } from 'src/pages/admin-pages/admin-community/admin-community-meetings/admin-community-meetings';
import { PushNotificationBody } from './push-notification-body.tsx';

const { Text } = Typography;

type PushNotificationTabProps = {
  meeting: CommunityMeetingShare;
  setActiveStep: (value: InnerModal) => void;
  isNotificationSend: boolean;
};

const PushNotificationTab = ({
  meeting,
  setActiveStep,
  isNotificationSend,
}: PushNotificationTabProps) => {
  const isDisabled = isNotificationSend || meeting.sendNotification;

  return (
    <>
      <S.StyledBlock
        isDisabled={isDisabled}
        alignment="center"
        wrap={false}
        distribution="equalSpacing"
      >
        <Stack wrap={false} alignment="center" spacing="extraLoose">
          <MessageAlertSquare />
          <Stack vertical spacing="extraTight">
            <Text strong>Push notification to community</Text>
            <Text>
              {meeting.visible === MEETING_VISIBILITY.PRIVATE
                ? 'Notify all invited community members'
                : 'Notify all community members'}
            </Text>
          </Stack>
        </Stack>
        <Button
          type="link"
          disabled={isDisabled}
          onClick={() =>
            setActiveStep({
              title:
                meeting.visible === MEETING_VISIBILITY.PRIVATE
                  ? 'Push notification to all invited community members?'
                  : 'Push notification to all community members?',
              body: PushNotificationBody,
              hasPrevStep: true,
            })
          }
        >
          <ChevronRight />
        </Button>
      </S.StyledBlock>
      {isDisabled && (
        <Text type="secondary">
          You can’t push notification to community because it was already sent
        </Text>
      )}
    </>
  );
};

export default PushNotificationTab;
