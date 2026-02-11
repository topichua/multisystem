import { Calendar, ChevronDown, ChevronUp } from '@untitled-ui/icons-react';
import { Typography } from 'antd';
import { FC } from 'react';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import {
  CommunityMeeting,
  ExploreMeet,
} from 'src/transport/communities/communities.dto.ts';
import { Button } from '../Button/Button.tsx';
import * as S from './save-to-calendar.styles.ts';
import { useCalendarActions } from './useCalendarActions.ts';

const { Text } = Typography;

interface SaveToCalendarProps {
  meeting: CommunityMeeting | ExploreMeet;
  handleClick: () => void;
}

const SaveToCalendar: FC<SaveToCalendarProps> = ({ meeting, handleClick }) => {
  const { generateGoogleCalendarLink, downloadICS } =
    useCalendarActions(meeting);

  const handleGoogleClick = () => {
    window.open(generateGoogleCalendarLink(), '_blank');
    handleClick();
  };

  const handleIOSClick = () => {
    downloadICS();
    handleClick();
  };

  const items = [
    {
      label: (
        <Stack alignment="center" spacing="extraTight">
          <Calendar height={20} width={20} style={{ paddingRight: 3 }} />{' '}
          <Text>Add to calendar</Text>
        </Stack>
      ),
      key: '1',
      children: (
        <>
          <Button type="link" onClick={handleGoogleClick}>
            <Stack spacing="extraTight" alignment="center">
              <S.StyledGoogle />
              <Text style={{ fontSize: 13 }}>Google Meet</Text>
            </Stack>
          </Button>
          <Button type="link" onClick={handleIOSClick}>
            <Stack spacing="extraTight" alignment="center">
              <S.StyledApple />
              <Text style={{ fontSize: 13 }}>iCal</Text>
            </Stack>
          </Button>
        </>
      ),
    },
  ];

  return (
    <S.StyledCollapse
      ghost
      items={items}
      expandIconPosition="end"
      expandIcon={({ isActive }) =>
        isActive ? <ChevronUp /> : <ChevronDown />
      }
    />
  );
};

export default SaveToCalendar;
