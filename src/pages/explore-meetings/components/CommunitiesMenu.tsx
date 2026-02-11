import { ChevronDown, ChevronUp, Users02 } from '@untitled-ui/icons-react';
import { useDebounce } from 'ahooks';
import { Empty, Input, Typography } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { observer } from 'mobx-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { useExploreMeetingsStore } from 'src/pages/explore-meetings/explore-meetings.provider.tsx';
import { MeetingCommunityItem } from 'src/transport/communities/communities.dto.ts';
import * as S from './common.styled.ts';

const { Text } = Typography;

export const CommunitiesMenu = observer(() => {
  const {
    allCommunities,
    getAllCommunities,
    selectedCommunities,
    setSelectedCommunities,
    isCommunityLoading,
  } = useExploreMeetingsStore();

  const [isCollapseActive, setCollapseActive] = useState<boolean>(true);

  useEffect(() => {
    getAllCommunities();
  }, [getAllCommunities]);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, { wait: 400 });

  const handleCheckboxChange = useCallback(
    (community: MeetingCommunityItem, event: CheckboxChangeEvent) => {
      setSelectedCommunities(
        event.target.checked
          ? [...selectedCommunities, community]
          : selectedCommunities.filter((c) => c.id !== community.id)
      );
    },
    [selectedCommunities, setSelectedCommunities]
  );

  const filteredCommunities = useMemo(
    () =>
      allCommunities.filter((community) =>
        community.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      ),
    [allCommunities, debouncedSearchTerm]
  );

  return (
    <S.StyledCollapse
      defaultActiveKey={['1']}
      expandIconPosition="end"
      ghost
      isActive={isCollapseActive}
      expandIcon={({ isActive }) => {
        setCollapseActive(!!isActive);
        return isActive ? (
          <ChevronUp height={20} />
        ) : (
          <ChevronDown height={20} />
        );
      }}
    >
      <S.StyledPanel
        header={
          <Stack spacing="tight">
            <Users02 height={20} />
            <Text strong>Community</Text>
          </Stack>
        }
        key="1"
      >
        <Input
          placeholder="Search communities..."
          value={searchTerm}
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <S.CommunityItems vertical spacing="loose" wrap={false}>
          {filteredCommunities.map((community) => (
            <S.StyledCheckbox
              key={community.id}
              onClick={(e) => e.stopPropagation()}
              checked={selectedCommunities.includes(community)}
              onChange={(e) => handleCheckboxChange(community, e)}
            >
              <Text ellipsis style={{ maxWidth: 220 }}>
                {community.name}
              </Text>
            </S.StyledCheckbox>
          ))}
          {!isCommunityLoading && filteredCommunities.length === 0 && (
            <Empty
              description="No communities found"
              style={{ paddingTop: 60 }}
            />
          )}
        </S.CommunityItems>
      </S.StyledPanel>
    </S.StyledCollapse>
  );
});

export default CommunitiesMenu;
