import { ReactNode } from 'react';
import { Typography } from 'antd';

import { Stack } from 'src/components/common/Stack/Stack';
import { Title } from 'src/components/common/Typography/Title';
import { UserAvatar } from 'src/components/common/user-avatar/User-avatar';
import { Report } from 'src/transport/posts/posts.dto';
import { getCalendarDateTime } from 'src/utils/date-time';

const { Text } = Typography;

type ReportsListProps = {
  reports: Report[];
  renderActions?: (report: Report) => ReactNode;
};

export const ReportsList = ({ reports, renderActions }: ReportsListProps) => {
  return (
    <Stack vertical>
      {reports.map((report) => (
        <Stack key={report.userId + report.reason} alignment="center">
          <Stack.Item>
            <UserAvatar
              firstName={report.user?.firstName || ''}
              lastName={report.user?.lastName || ''}
              size={32}
              src={report.user?.avatarUrl}
            />
          </Stack.Item>

          <Stack.Item fill>
            <Stack fill vertical spacing="none">
              <Title level={5} fontWeight={500}>
                {report.user?.firstName} {report.user?.lastName}
              </Title>
              <Text>{report.reason}</Text>
              <Text type="secondary">
                Reported {getCalendarDateTime(report.createdAt)}
              </Text>
            </Stack>
          </Stack.Item>

          {renderActions && <Stack.Item>{renderActions(report)}</Stack.Item>}
        </Stack>
      ))}
    </Stack>
  );
};
