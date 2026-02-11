import {
  DotsVertical,
  ImageUserPlus,
  LogOut04,
  UserRight02,
} from '@untitled-ui/icons-react';
import { Dropdown, Empty, Table, TableColumnsType, Typography } from 'antd';
import dayjs from 'dayjs';

import { Button } from 'src/components/common/Button/Button';
import { ExternalLink } from 'src/components/common/Link/Link';
import { UserProfileDto } from 'src/transport/account/account.dto.ts';
import { Announcement } from 'src/transport/announcement/announcement.dto';
import { getCalendarDateShortRange } from 'src/utils/date-time';

const { Text } = Typography;

const iconSizes = {
  height: 16,
  width: 16,
};

type AnnouncementTableProps = {
  announcements: Announcement[];
  currentPage: number;
  isLoading?: boolean;
  onChangeCurrentPage: (page: number) => void;
  onDeleteAnnouncement: (announcement: Announcement) => void;
  onEditAnnouncement: (announcement: Announcement) => void;
  onActivateAnnouncement: (announcement: Announcement) => void;
  creators: UserProfileDto[];
};

export const AnnouncementTable = ({
  announcements,
  currentPage,
  isLoading = false,
  onChangeCurrentPage,
  onDeleteAnnouncement,
  onEditAnnouncement,
  onActivateAnnouncement,
  creators,
}: AnnouncementTableProps) => {
  const columns: TableColumnsType<Announcement> = [
    {
      title: 'Title',
      key: 'title',
      render: (_, announcement) => announcement.title,
      width: 150,
    },
    {
      title: 'Description',
      key: 'description',
      render: (_, announcement) => announcement.description,
      width: 200,
    },
    {
      title: 'Link',
      key: 'link',
      render: (_, announcement) => (
        <ExternalLink href={announcement.link || ''}>
          {announcement.link}
        </ExternalLink>
      ),
      width: 200,
    },
    {
      title: 'Status',
      key: 'isActive',
      render: (_, announcement) => (
        <Text type={announcement.isActive ? 'success' : 'danger'}>
          {announcement.isActive ? 'Active' : 'Inactive'}
        </Text>
      ),
      width: 100,
    },
    {
      title: 'Active Dates',
      key: 'startDate',
      render: (_, announcement) => (
        <Text type="secondary">
          {getCalendarDateShortRange(
            announcement.startDate,
            announcement.endDate
          )}
        </Text>
      ),
      width: 120,
    },
    {
      title: 'Created at',
      key: 'createdAt',
      render: (_, announcement) => (
        <Text type="secondary">
          {dayjs(announcement.createdAt).format('D MMM')}
        </Text>
      ),
      width: 100,
    },
    {
      title: 'Creator',
      key: 'creator',
      render: (_, announcement) => {
        const creator = creators.find(
          (user) => user.id === announcement.createdByUserId
        );
        return (
          <Text>
            {creator?.firstName} {creator?.lastName}
          </Text>
        );
      },
      width: 150,
    },
    {
      title: '',
      key: 'actions',
      fixed: 'right',
      render: (_, announcement) => (
        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              {
                key: '1',
                label: 'Edit',
                icon: <UserRight02 {...iconSizes} />,
                onClick: () => {
                  onEditAnnouncement(announcement);
                },
              },
              !announcement.isActive
                ? {
                    key: '2',
                    label: 'Activate',
                    icon: <ImageUserPlus {...iconSizes} />,
                    onClick: () => onActivateAnnouncement(announcement),
                  }
                : null,
              {
                key: '3',
                label: 'Delete',
                danger: true,
                icon: <LogOut04 {...iconSizes} />,
                onClick: () => onDeleteAnnouncement(announcement),
              },
            ],
          }}
        >
          <Button type="text" icon={<DotsVertical />} />
        </Dropdown>
      ),
      width: 80,
    },
  ];

  return (
    <Table
      pagination={{
        position: ['bottomCenter'],
        current: currentPage,
        onChange: onChangeCurrentPage,
      }}
      loading={isLoading}
      columns={columns}
      dataSource={announcements}
      rowKey="id"
      scroll={{ x: 500 }}
      locale={{ emptyText: !isLoading && <Empty description="No Data" /> }}
    />
  );
};
