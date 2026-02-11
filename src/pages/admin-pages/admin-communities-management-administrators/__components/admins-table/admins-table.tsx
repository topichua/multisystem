import { Empty, Table, TableColumnsType, Typography } from 'antd';

import { Button } from 'src/components/common/Button/Button';
import { CommunityAdmin } from 'src/transport/communities/communities.dto';

const { Text } = Typography;

type CategoriesTableAdminsTableProps = {
  admins: CommunityAdmin[];
  currentPage: number;
  isLoading?: boolean;
  onChangeCurrentPage: (page: number) => void;
  onDeleteAdmin: (category: CommunityAdmin) => void;
};

export const AdminsTable = ({
  admins,
  currentPage,
  isLoading = false,
  onChangeCurrentPage,
  onDeleteAdmin,
}: CategoriesTableAdminsTableProps) => {
  const columns: TableColumnsType<CommunityAdmin> = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '100%',
      render: (_: any, admin) => <Text>{admin.email}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, admin) => (
        <Button danger onClick={() => onDeleteAdmin(admin)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={admins}
      rowKey="id"
      columns={columns}
      loading={isLoading}
      locale={{ emptyText: !isLoading && <Empty description="No Data" /> }}
      pagination={{
        position: ['bottomCenter'],
        current: currentPage,
        onChange: onChangeCurrentPage,
      }}
    />
  );
};
