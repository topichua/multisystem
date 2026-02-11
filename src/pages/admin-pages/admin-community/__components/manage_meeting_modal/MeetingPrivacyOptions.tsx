import { Globe01, Lock01, Lock03, Users01 } from '@untitled-ui/icons-react';
import { Form, Select, Typography } from 'antd';
import { ReactNode } from 'react';
import { Input } from 'src/components/common/Input/Input.tsx';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import * as S from './ManageMeetingModal.styled.tsx';
import { CommunityMeeting } from 'src/transport/communities/communities.dto.ts';

const { Text } = Typography;

interface RenderOptionProps {
  icon: ReactNode;
  text: string;
  description: string;
}

const renderOptions: Record<string, RenderOptionProps> = {
  Public: {
    icon: <Globe01 width={16} height={20} />,
    text: 'Public',
    description: 'All OTA members',
  },
  Community: {
    icon: <Users01 width={16} height={20} />,
    text: 'Community',
    description: 'Only members within this community',
  },
  Private: {
    icon: <Lock01 width={16} height={20} />,
    text: 'Private',
    description: 'Only members who are invited',
  },
};

const options = [
  {
    value: '1',
    label: 'Public',
  },
  {
    value: '2',
    label: 'Community',
  },
  {
    value: '3',
    label: 'Private',
  },
];

type MeetingPrivacyOptionsProps = {
  meeting: CommunityMeeting | null;
};

export const MeetingPrivacyOptions = ({
  meeting,
}: MeetingPrivacyOptionsProps) => (
  <S.StyledInputsContainer>
    <Form.Item
      name="visible"
      label="Who can see this meeting?"
      rules={[{ required: true, message: 'Please select privacy' }]}
    >
      <Select
        disabled={meeting !== null}
        placeholder={
          <S.StyledSelectLabel alignment="center" spacing="extraTight">
            <Lock03 color="#344054" height={20} />
            <Text>Select privacy</Text>
          </S.StyledSelectLabel>
        }
        labelRender={({ label }) => (
          <S.StyledSelectLabel alignment="center" spacing="tight">
            {renderOptions[label as string].icon}
            <Text>{label}</Text>
          </S.StyledSelectLabel>
        )}
        optionRender={({ label }) => (
          <Stack wrap={false} spacing="tight">
            {renderOptions[label as string].icon}
            <S.StyledSelectText vertical spacing="extraTight">
              <Text strong> {renderOptions[label as string].text}</Text>
              <Text>{renderOptions[label as string].description}</Text>
            </S.StyledSelectText>
          </Stack>
        )}
        options={options}
      />
    </Form.Item>
    <Form.Item name="meetingPassword" label="Meeting password (optional)">
      <Input />
    </Form.Item>
  </S.StyledInputsContainer>
);
