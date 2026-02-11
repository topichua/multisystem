import { Copy07, Link01 } from '@untitled-ui/icons-react';
import { notification, Typography } from 'antd';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import * as S from '../../ShareMeetingModal.styled.ts';
import { CommunityMeetingShare } from 'src/pages/admin-pages/admin-community/admin-community-meetings/admin-community-meetings.tsx';
import CheckIcon from 'src/assets/assets-icons/сheck-icon.svg?react';

const { Text } = Typography;

type CopyLinkTabProps = {
  meeting: CommunityMeetingShare;
  communityAlias: string;
};

const CopyLinkTab = ({ communityAlias, meeting }: CopyLinkTabProps) => {
  const handleIconClick = async () => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    const url = `${window.location.origin}/communities/${communityAlias}/meetings/${meeting.id}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        notification.success({
          icon: <CheckIcon height={30} width={30} />,
          message: 'Link copied',
          closable: false,
          className: 'copy-meeting-notification',
        });
      })
      .catch((err) => {
        console.error('Failed to copy URL to clipboard:', err);
      });
  };

  return (
    <>
      <S.StyledBlock
        alignment="center"
        wrap={false}
        distribution="equalSpacing"
      >
        <Stack wrap={false} alignment="center" spacing="extraLoose">
          <Link01 />
          <Stack vertical spacing="extraTight">
            <Text strong>Copy link</Text>
            <Text>
              Copy link to meeting details for use in other platforms and email
            </Text>
          </Stack>
        </Stack>

        <Copy07 style={{ cursor: 'pointer' }} onClick={handleIconClick} />
      </S.StyledBlock>
    </>
  );
};

export default CopyLinkTab;
