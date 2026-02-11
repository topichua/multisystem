import { Typography, Dropdown, MenuProps } from 'antd';
import { Check, DotsHorizontal, LogOut01 } from '@untitled-ui/icons-react';

import { Button } from 'src/components/common/Button/Button';
import { Card } from 'src/components/common/Card/Card';
import { Stack } from 'src/components/common/Stack/Stack';
import { Enrolment } from 'src/transport/enrolment/enrolment.dto';

import * as S from './enrolled-card.styled';
import { formatDateNews } from 'src/utils/date-time';

const { Text } = Typography;

const iconSize = {
  width: 14,
  height: 14,
};

type EnrolledCardProps = {
  enrolment: Enrolment;
  onUnenrol: (enrol: Enrolment) => void;
};

const CompletedLabel = ({ completedData }: { completedData?: Date | null }) => (
  <S.EnrolledCompletedLabel>
    <Stack alignment="center" spacing="extraTight">
      <Check {...iconSize} />
      <S.EnrolledCompletedLabelText>
        Completed {completedData ? formatDateNews(completedData) : ''}
      </S.EnrolledCompletedLabelText>
    </Stack>
  </S.EnrolledCompletedLabel>
);

export const EnrolledCard = ({ enrolment, onUnenrol }: EnrolledCardProps) => {
  const items: MenuProps['items'] = [
    {
      label: 'Unenrol',
      key: '1',
      icon: <LogOut01 {...iconSize} />,
      danger: true,
      onClick: () => onUnenrol(enrolment),
    },
  ];

  return (
    <Card
      title={
        <Stack distribution="equalSpacing">
          <Text>{enrolment.course.courseName}</Text>

          {enrolment.status !== 'Completed' && (
            <Dropdown
              menu={{ items }}
              trigger={['click']}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
            >
              <Button size="small" type="link" icon={<DotsHorizontal />} />
            </Dropdown>
          )}
        </Stack>
      }
    >
      <Stack vertical spacing="extraLoose">
        <Stack spacing="none" vertical>
          <Text type="secondary">Course Category</Text>
          <Text>{enrolment.course.categoryName}</Text>
        </Stack>
        {!!enrolment.expiryDate && (
          <Stack spacing="none" vertical>
            <Text type="secondary">Expires</Text>
            <Text>{formatDateNews(enrolment.expiryDate)}</Text>
          </Stack>
        )}
        <Stack spacing="none" vertical>
          <Text type="secondary">Status</Text>
          {enrolment.status === 'Completed' ? (
            <Stack>
              <CompletedLabel completedData={enrolment.completionDate} />
            </Stack>
          ) : (
            <Text>{enrolment.status}</Text>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};
