import { Typography } from 'antd';
import { observer } from 'mobx-react';
import { useCallback } from 'react';
import { Badge } from 'src/components/common/Badge/Badge.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { CommunityBadge } from 'src/pages/explore-meetings/components/Header/CommunityBadge.tsx';
import { useExploreMeetingsStore } from 'src/pages/explore-meetings/explore-meetings.provider.tsx';
import { StatusBadge } from './StatusBadge';

const { Text } = Typography;

export const SelectedFilters = observer(() => {
  const {
    selectedCommunities,
    setSelectedCommunities,
    selectedMeetingStatuses,
    setSelectedMeetingStatuses,
  } = useExploreMeetingsStore();

  const handleAllClose = useCallback(() => {
    setSelectedCommunities([]);
    setSelectedMeetingStatuses([]);
  }, [setSelectedCommunities, setSelectedMeetingStatuses]);

  const isEmpty =
    selectedCommunities.length === 0 && selectedMeetingStatuses.length === 0;

  return !isEmpty ? (
    <Stack style={{ marginTop: 16 }}>
      <Badge onClose={handleAllClose} allClicable>
        <Text strong>Clear all</Text>
      </Badge>
      <StatusBadge
        statuses={selectedMeetingStatuses}
        clearAllStatuses={() => setSelectedMeetingStatuses([])}
        onCloseStatus={(status) =>
          setSelectedMeetingStatuses(
            selectedMeetingStatuses.filter((s) => s !== status)
          )
        }
      />
      {selectedCommunities.map((community) => (
        <CommunityBadge
          key={community.id}
          community={community}
          onClose={() =>
            setSelectedCommunities(
              selectedCommunities.filter((c) => c.id !== community.id)
            )
          }
        />
      ))}
    </Stack>
  ) : null;
});
