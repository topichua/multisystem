import { Empty, Table, TableColumnsType, Typography } from 'antd';

import { PostTag } from 'src/transport/communities/communities.dto';

const { Text } = Typography;

type TagsTableProps = {
  tags: PostTag[];
  currentPage: number;
  isLoading?: boolean;
  onChangeCurrentPage: (page: number) => void;
  onEditCategory: (tag: PostTag) => void;
  onDeleteCategory: (tag: PostTag) => void;
};

export const TagsTable = ({
  currentPage,
  tags,
  isLoading = false,
  onChangeCurrentPage,
  /*onDeleteCategory,
  onEditCategory,*/
}: TagsTableProps) => {
  const columns: TableColumnsType<PostTag> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '50%',
      render: (_: any, tag) => <Text>{tag.name}</Text>,
    },
    {
      title: 'Posts count',
      dataIndex: 'countOfPosts',
      key: 'countOfPosts',
      width: '25%',
      render: (_: any, tag) => <Text type="secondary">{tag.countOfPosts}</Text>,
    },
    /* {
      title: 'Actions',
      key: 'actions',
      width: '25%',
      render: (_: any, tag) => (
        <Stack>
          <Button onClick={() => onEditCategory(tag)}>Edit</Button>
          <Button danger onClick={() => onDeleteCategory(tag)}>
            Delete
          </Button>
        </Stack>
      ),
    },*/
  ];

  return (
    <Table
      dataSource={tags}
      rowKey="id"
      columns={columns}
      loading={isLoading}
      locale={{ emptyText: !isLoading && <Empty description="No Data" /> }}
      pagination={{
        position: ['bottomCenter'],
        pageSize: 10,
        current: currentPage,
        onChange: onChangeCurrentPage,
      }}
    />
  );
};
