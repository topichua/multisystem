import { Progress, Typography } from 'antd';
import { FC } from 'react';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Title } from 'src/components/common/Typography/Title.tsx';
import { components } from 'src/styled/definitions/colors.ts';

const { Text } = Typography;

interface ProgressBarProps {
  completedTotalHours?: number;
  minimumRequiredHours?: number;
}

const CPDProgress: FC<ProgressBarProps> = ({
  completedTotalHours,
  minimumRequiredHours,
}) => {
  const completedHours = completedTotalHours ?? 0;
  const requiredHours = minimumRequiredHours ?? 1;

  const percentage = requiredHours
    ? Math.min((completedHours / requiredHours) * 100, 100)
    : 0;

  return (
    <Stack vertical spacing="loose">
      <Title
        level={5}
        fontWeight={600}
        style={{ color: components.colors.brandColor }}
      >
        Current CPD progress
      </Title>
      <Stack alignment="center">
        Current year CPD progress
        <Progress
          showInfo={false}
          strokeColor={components.colors.brandColor}
          strokeWidth={9}
          type="circle"
          percent={Math.round(percentage)}
        />
        <Stack vertical spacing="extraTight">
          <Text>CPD hours</Text>
          <Title
            level={5}
            fontWeight={600}
            style={{ color: components.colors.brandColor }}
          >
            {completedHours}/{minimumRequiredHours || 0} hrs
          </Title>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CPDProgress;
