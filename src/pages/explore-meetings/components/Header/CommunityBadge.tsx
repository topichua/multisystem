import { Users01 } from '@untitled-ui/icons-react';
import { Typography } from 'antd';
import { FC } from 'react';
import { Badge } from 'src/components/common/Badge/Badge.tsx';
import { Stack } from 'src/components/common/Stack/Stack';
import { MeetingCommunityItem } from 'src/transport/communities/communities.dto.ts';

const { Text } = Typography;

interface CommunityBadgeProps {
  community: MeetingCommunityItem;
  onClose: () => void;
}

export const CommunityBadge: FC<CommunityBadgeProps> = ({
  community,
  onClose,
}) => (
  <Badge key={community.id} onClose={onClose}>
    <Stack spacing="none" alignment="center">
      <Users01 height={16} />
      <Text strong>{community.name}</Text>
    </Stack>
  </Badge>
);
