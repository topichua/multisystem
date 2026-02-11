import { Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';

import { Stack } from 'src/components/common/Stack/Stack';
import { Report } from 'src/transport/posts/posts.dto';
import { dateFormat } from 'src/utils/date-time';

import * as S from './report-tooltip.styled';

const { Text } = Typography;

type ReportTooltipProps = {
  report: Report;
};

export const ReportTooltip = ({ report }: ReportTooltipProps) => (
  <Tooltip
    overlayStyle={{ minWidth: 200, maxWidth: 300, maxHeight: 350 }}
    trigger={['click', 'hover']}
    color="white"
    title={
      <Stack vertical>
        <Stack vertical spacing="none">
          <Text strong>Request message</Text>
          <Text>{report.reason}</Text>
        </Stack>
        <Stack vertical spacing="none">
          <Text strong>Request date</Text>
          <Text>{dayjs(report.createdAt).format(dateFormat)}</Text>
        </Stack>
      </Stack>
    }
  >
    <S.ReportedTag color="orange">+</S.ReportedTag>
  </Tooltip>
);
