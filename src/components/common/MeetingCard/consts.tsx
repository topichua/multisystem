import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { MessageQuestionSquare } from '@untitled-ui/icons-react';
import { Typography } from 'antd';
import { Stack } from 'src/components/common/Stack/Stack.tsx';

const { Text } = Typography;

const ICON_STYLES = { display: 'flex' };

export const meetingDrawerOptions = [
  {
    key: 0,
    label: (
      <Stack spacing="extraTight" alignment="center">
        <MessageQuestionSquare height={16} style={ICON_STYLES} />
        <Text strong>RSVP</Text>
      </Stack>
    ),
  },
  {
    key: 1,
    label: (
      <Stack spacing="extraTight" alignment="center">
        <CheckCircleFilled
          height={20}
          style={{ ...ICON_STYLES, color: 'green' }}
        />
        <Text strong>Going</Text>
      </Stack>
    ),
  },
  {
    key: 2,
    label: (
      <Stack spacing="extraTight" alignment="center">
        <CloseCircleFilled
          height={20}
          style={{ ...ICON_STYLES, color: 'red' }}
        />
        <Text strong>Can't go</Text>
      </Stack>
    ),
  },
];
