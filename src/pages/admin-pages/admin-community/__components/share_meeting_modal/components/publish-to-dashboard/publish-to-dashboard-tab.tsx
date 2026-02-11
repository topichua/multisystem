import { ChevronRight, LayoutAlt03 } from '@untitled-ui/icons-react';
import { Typography } from 'antd';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import {
  InnerModal,
  MEETING_VISIBILITY,
} from 'src/pages/admin-pages/admin-community/__components/share_meeting_modal/const.tsx';
import * as S from 'src/pages/admin-pages/admin-community/__components/share_meeting_modal/ShareMeetingModal.styled.ts';
import { CommunityMeetingShare } from 'src/pages/admin-pages/admin-community/admin-community-meetings/admin-community-meetings';
import { Button } from 'src/components/common/Button/Button.tsx';

import { PublishToDashboardBody } from './publish-to-dashboard-body.tsx';

const { Text } = Typography;

type PublishToDashboardTabProps = {
  meeting: CommunityMeetingShare;
  setActiveStep: (value: InnerModal) => void;
  isPublished: boolean;
};

const PublishToDashboardTab = ({
  meeting,
  setActiveStep,
  isPublished,
}: PublishToDashboardTabProps) => {
  const isDisabled =
    isPublished ||
    [MEETING_VISIBILITY.PRIVATE].includes(meeting.visible) ||
    meeting.toDashBoard;

  const disabledText = isPublished
    ? 'You can’t publish to dashboard because it was already published'
    : 'You can’t publish to dashboard because this meeting was set to private (invite only.)';

  return (
    <>
      <S.StyledBlock
        isDisabled={isDisabled}
        alignment="center"
        wrap={false}
        distribution="equalSpacing"
      >
        <Stack wrap={false} alignment="center" spacing="extraLoose">
          <LayoutAlt03 />
          <Stack vertical spacing="extraTight">
            <Text strong>Publish to dashboard</Text>
            <Text>
              Push meeting to dashboard for all OTA members who have access to
              this meeting
            </Text>
          </Stack>
        </Stack>

        <Button
          type="link"
          disabled={isDisabled}
          onClick={() =>
            setActiveStep({
              title: 'Publish meeting to dashboard?',
              body: PublishToDashboardBody,
              hasPrevStep: true,
            })
          }
        >
          <ChevronRight />
        </Button>
      </S.StyledBlock>
      {isDisabled && <Text type="secondary">{disabledText}</Text>}
    </>
  );
};

export default PublishToDashboardTab;
