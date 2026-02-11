import { Avatar, Typography, Table, TableColumnsType } from 'antd';
import { observer } from 'mobx-react';

import { Button } from 'src/components/common/Button/Button';
import { Stack } from 'src/components/common/Stack/Stack';
import { Tag } from 'src/components/common/Tag/Tag';
// import { useCurrentUserStore } from 'src/pages/authorized/authorization.layout';
import { CommunitiyDto } from 'src/transport/communities/communities.dto';
import { formatDate } from 'src/utils/date-time';

const { Text } = Typography;

type CommunitiesTableProps = {
  communities: CommunitiyDto[];
  currentPage: number;
  onChangeCurrentPage: (page: number) => void;
  onDeleteCommunity: (category: CommunitiyDto) => void;
  onNavigateToCommunity: (id: string) => void;
};

export const CommunitiesTable = observer(
  ({
    communities,
    currentPage,
    // onDeleteCommunity,
    onChangeCurrentPage,
    onNavigateToCommunity,
  }: CommunitiesTableProps) => {
    // const { globalPermission } = useCurrentUserStore();

    const columns: TableColumnsType<CommunitiyDto> = [
      {
        //   title: 'Status',
        //   key: 'isDeleted',
        //   render: (_, community: CommunitiyDto) =>
        //     community.isDeleted && <Text type="danger">Deleted</Text>,
        //   width: 120,
        // },
        // {
        title: '',
        key: 'imageUrl',
        render: (_, community: CommunitiyDto) => (
          <Avatar
            size="large"
            shape="square"
            src={community?.imageUrl}
            alt="logo"
          />
        ),
        width: 60,
      },
      {
        title: 'Name',
        key: 'name',
        render: (_, community: CommunitiyDto) => (
          <Stack alignment="center" spacing="tight">
            <Text>{community.name}</Text>
            {community.isArchived && (
              <Tag color="warning" size="small">
                Archived
              </Tag>
            )}
          </Stack>
        ),
        width: 420,
      },
      {
        title: 'Category',
        key: 'category',
        render: (_, community: CommunitiyDto) => {
          const categories = community?.categories.map((c) => c.name);
          return categories?.length ? categories.join(', ') : 'Uncategorized';
        },
        width: 260,
      },
      {
        title: 'Alias',
        key: 'alias',
        render: (_, community: CommunitiyDto) => community.alias,
        width: 250,
      },
      {
        title: 'Privacy',
        key: 'isPublic',
        render: (_, community: CommunitiyDto) =>
          community.isPublic ? 'Public' : 'Private',
        width: 150,
      },
      {
        title: 'Segments',
        key: 'segmentIds',
        render: (_, community: CommunitiyDto) =>
          community.segmentIds?.length ? community.segmentIds.length : '-',
        width: 150,
      },
      {
        title: 'Auto join',
        key: 'isAutoJoin',
        render: (_, community: CommunitiyDto) =>
          community.isAutoJoin ? 'Yes' : 'No',
        width: 150,
      },
      {
        title: 'Start date',
        key: 'aliveStartDate',
        render: (_, community: CommunitiyDto) => (
          <Text type="secondary">
            {community.aliveStartDate
              ? formatDate(community.aliveStartDate)
              : '-'}
          </Text>
        ),
        width: 150,
      },
      {
        title: 'End date',
        key: 'aliveEndDate',
        render: (_, community: CommunitiyDto) => (
          <Text type="secondary">
            {community.aliveEndDate ? formatDate(community.aliveEndDate) : '-'}
          </Text>
        ),
        width: 150,
      },
      {
        title: 'Members',
        key: 'membersCount',
        render: (_, community: CommunitiyDto) => community.membersCount,
        width: 100,
      },
      {
        title: 'Pending Members',
        key: 'pendingMembersCount',
        render: (_, community: CommunitiyDto) => community.pendingMembersCount,
        width: 160,
      },
      {
        title: 'Posts',
        key: 'postsCount',
        render: (_, community: CommunitiyDto) => community.postsCount,
        width: 100,
      },
      {
        title: 'Actions',
        key: 'actions',
        fixed: 'right',
        render: (_, community: CommunitiyDto) => (
          <Stack>
            <Button onClick={() => onNavigateToCommunity(community.id)}>
              Manage
            </Button>
            {/*{(community.permissions?.communityClose ||*/}
            {/*  globalPermission?.communityClose) && (*/}
            {/*  <Button*/}
            {/*    danger*/}
            {/*    disabled={community.isDeleted}*/}
            {/*    onClick={() => onDeleteCommunity(community)}*/}
            {/*  >*/}
            {/*    Delete*/}
            {/*  </Button>*/}
            {/*)}*/}
          </Stack>
        ),
        width: 115,
      },
    ];

    return (
      <Table
        pagination={{
          position: ['bottomCenter'],
          current: currentPage,
          onChange: onChangeCurrentPage,
        }}
        columns={columns}
        dataSource={communities}
        rowKey="id"
        scroll={{ x: 1300 }}
      />
    );
  }
);
