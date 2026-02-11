import { FC } from 'react';
import CopyLinkTab from './components/copy-link/copy-link-tab.tsx';
import PublishToDashboardTab from './components/publish-to-dashboard/publish-to-dashboard-tab.tsx';
import PushNotificationTab from './components/push-notification/push-notification-tab.tsx';
import { BodyComponentProps } from 'src/pages/admin-pages/admin-community/__components/share_meeting_modal/const.tsx';
import * as S from './ShareMeetingModal.styled.ts';

const ModalBlock: FC<BodyComponentProps> = ({
  setActiveStep,
  meeting,
  isPublished,
  communityAlias,
  isNotificationSend,
}) => {
  if (!meeting) return null;

  return (
    <S.StyledModalBlock vertical>
      <PushNotificationTab
        meeting={meeting}
        isNotificationSend={isNotificationSend}
        setActiveStep={setActiveStep}
      />
      <PublishToDashboardTab
        meeting={meeting}
        isPublished={isPublished}
        setActiveStep={setActiveStep}
      />
      <CopyLinkTab meeting={meeting} communityAlias={communityAlias} />
    </S.StyledModalBlock>
  );
};

export default ModalBlock;
