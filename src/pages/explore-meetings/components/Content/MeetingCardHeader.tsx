import { Avatar, Typography } from 'antd';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { MeetingCommunityItem } from 'src/transport/communities/communities.dto.ts';

const { Text } = Typography;

type MeetingCardHeaderProps = {
  communityData?: MeetingCommunityItem;
};

const MeetingCardHeader = ({ communityData }: MeetingCardHeaderProps) => {
  if (!communityData) return;

  return (
    <Stack alignment="center" spacing="tight">
      <Avatar
        shape="square"
        size={40}
        src={
          communityData.imageUrl ||
          'https://shpadevstorage.blob.core.windows.net/images/community/ae5d71fd-f2ab-411b-9170-cf71eb1afdc1'
        }
      />
      <Text strong>{communityData.name}</Text>
    </Stack>
  );
};

export default MeetingCardHeader;
