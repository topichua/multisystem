import { Typography } from 'antd';
import { FC } from 'react';
import { Badge } from 'src/components/common/Badge/Badge.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { getStatusTitle } from 'src/pages/admin-pages/admin-community/__components/meeting-users-modal/consts.ts';
import { MeetingStatus } from 'src/transport/communities/communities.dto.ts';

const { Text } = Typography;

interface StatusBadgeProps {
  statuses: MeetingStatus[];
  clearAllStatuses: () => void;
  onCloseStatus: (status: MeetingStatus) => void;
}

export const StatusBadge: FC<StatusBadgeProps> = ({
  statuses,
  clearAllStatuses,
  onCloseStatus,
}) => {
  return statuses.length === Object.keys(MeetingStatus).length / 2 ? (
    <Badge onClose={clearAllStatuses}>
      <Text strong>All: Statuses</Text>
    </Badge>
  ) : (
    <Stack>
      {statuses.map((status) => (
        <Badge key={status} onClose={() => onCloseStatus(status)}>
          <Text strong>{getStatusTitle[status]}</Text>
        </Badge>
      ))}
    </Stack>
  );
};
