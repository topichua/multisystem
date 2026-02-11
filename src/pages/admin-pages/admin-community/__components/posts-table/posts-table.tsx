import { Avatar, Empty, Table, TableColumnsType, Typography } from 'antd';
import { ReactNode, useCallback } from 'react';

import { Stack } from 'src/components/common/Stack/Stack';
import { Tag } from 'src/components/common/Tag/Tag';
import { Post, PostStatus } from 'src/transport/posts/posts.dto';

import { PostContentPart } from './post-content-part';

const { Text, Paragraph } = Typography;

type StatusTextType = {
  text: string;
  type?: 'success' | 'warning' | 'danger' | 'secondary';
};

export type PostsTableProps = {
  isLoading?: boolean;
  posts: Post[];
  currentPage: number;
  renderActions?: (post: Post) => ReactNode;
  onChangeCurrentPage: (page: number) => void;
  onChangeStatus?: (status: PostStatus | null) => void;
};

export const PostsTable = ({
  isLoading,
  posts,
  currentPage,
  renderActions,
  onChangeCurrentPage,
  onChangeStatus,
}: PostsTableProps) => {
  const getStatusText = useCallback((status: PostStatus): StatusTextType => {
    switch (status) {
      case PostStatus.Published:
        return { text: 'Published', type: 'success' };
      case PostStatus.WaitForApproval:
        return { text: 'Waiting for approval', type: 'warning' };
      case PostStatus.Deleted:
        return { text: 'Deleted', type: 'danger' };
      case PostStatus.Acrhived:
        return { text: 'Archived', type: 'secondary' };
      case PostStatus.ArchivedDueToReported:
        return { text: 'Archived after report', type: 'danger' };
      default:
        return { text: 'Unknown status', type: 'secondary' };
    }
  }, []);

  const columns: TableColumnsType<Post> = [
    {
      title: '',
      key: 'imageUrl',
      render: (_, post) => (
        <Avatar size="large" shape="square" src={post?.imageUrl} alt="logo" />
      ),
      width: 60,
    },
    {
      title: 'Title',
      key: 'title',
      render: (_, post) => (
        <Paragraph
          ellipsis={{ rows: 2 }}
          style={{ marginBottom: 0 }}
          title={post.title}
        >
          {post.title}
        </Paragraph>
      ),
      width: 300,
    },
    {
      title: 'Body',
      key: 'body',
      render: (_, post) => <PostContentPart content={post.body} />,
      width: 400,
    },
    {
      title: 'Closed',
      key: 'isFrozen',
      render: (_, post) => (
        <Text type={post.isFrozen ? 'danger' : undefined}>
          {post.isFrozen ? 'Closed' : '-'}
        </Text>
      ),
      width: 120,
    },
    {
      title: 'Comments count',
      key: 'commentsCount',
      render: (_, post) => post.commentsCount,
      width: 170,
    },
    {
      title: 'Likes count',
      key: 'likesCount',
      render: (_, post) => post.likesCount,
      width: 170,
    },
    {
      title: 'Views count',
      key: 'viewsCount',
      render: (_, post) => post.viewsCount,
      width: 170,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, post) => {
        const { text, type } = getStatusText(post.status);
        return <Text type={type}>{text}</Text>;
      },
      filterMultiple: false,
      filters: onChangeStatus
        ? [
            { text: 'Published', value: PostStatus.Published },
            { text: 'Waiting for approval', value: PostStatus.WaitForApproval },
            { text: 'Deleted', value: PostStatus.Deleted },
            { text: 'Archived', value: PostStatus.Acrhived },
            {
              text: 'Archived after report',
              value: PostStatus.ArchivedDueToReported,
            },
          ]
        : undefined,
      width: 300,
    },
    {
      title: 'Tags',
      key: 'tags',
      render: (_, post) =>
        !post.tags || post.tags?.length === 0 ? (
          '-'
        ) : (
          <Stack alignment="center">
            {post.tags.map((tag) => (
              <Tag key={tag.id}>{tag.name}</Tag>
            ))}
          </Stack>
        ),
      width: 260,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      hidden: !renderActions,
      render: (_, post) => (renderActions ? renderActions(post) : null),
      width: 90,
    },
  ];

  return (
    <Table
      pagination={{
        position: ['bottomCenter'],
        current: currentPage,
        onChange: onChangeCurrentPage,
      }}
      onChange={(_, filters) => {
        const status = filters?.status?.[0];
        if (onChangeStatus)
          onChangeStatus((status || null) as PostStatus | null);
      }}
      loading={isLoading}
      columns={columns}
      dataSource={posts}
      rowKey="id"
      scroll={{ x: 1300 }}
      locale={{ emptyText: !isLoading && <Empty description="No Data" /> }}
    />
  );
};
