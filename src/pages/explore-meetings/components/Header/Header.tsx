import { observer } from 'mobx-react';
import { Stack } from 'src/components/common/Stack/Stack.tsx';
import { Title } from 'src/components/common/Typography/Title.tsx';
import {
  DateRangePicker,
  NoUndefinedRangeValueType,
} from 'src/pages/explore-meetings/components/Header/DateRangePicker.tsx';
import { SelectedFilters } from 'src/pages/explore-meetings/components/Header/SelectedFilters.tsx';
import { useExploreMeetingsStore } from 'src/pages/explore-meetings/explore-meetings.provider.tsx';
import { MeetingType } from 'src/store/explore-meetings/explore-meetings-store.tsx';
import { CountLabels } from 'src/utils/text-consts.ts';
import { formatSingular } from 'src/utils/text.ts';
import * as S from '../../explore-meetings.styled.ts';
import { Dayjs } from 'dayjs';

export const Header = observer(() => {
  const {
    isCommunityLoading,
    totalIncoming,
    totalUpcoming,
    selectedMeetingType,
    setDateRange,
    fromDatePicker,
    toDatePicker,
  } = useExploreMeetingsStore();

  const getTitle = () => {
    if (totalIncoming == null || totalUpcoming == null) return;

    switch (selectedMeetingType) {
      case MeetingType.YourUpcomingMeetings:
        return formatSingular(
          totalUpcoming,
          'upcoming meeting',
          'upcoming meetings',
          'No upcoming meetings yet'
        );
      case MeetingType.PastMeetings:
        return formatSingular(
          totalIncoming,
          'past meeting',
          'past meetings',
          'No past meetings yet'
        );
      default:
        return formatSingular(
          totalUpcoming + totalIncoming,
          CountLabels.MEEETINGS
        );
    }
  };

  const handleDateRangeChange = (
    dates: NoUndefinedRangeValueType<Dayjs> | null
  ) => {
    if (dates) {
      setDateRange(dates[0], dates[1]);
    }
  };

  const handleSetDateRangePickerNull = () => {
    setDateRange(null, null);
  };

  return (
    <S.StyledInnerPageHeader>
      <Stack vertical spacing="none" style={{ width: '100%' }}>
        <Stack distribution="equalSpacing" alignment="center">
          <Title level={5}>
            {!isCommunityLoading ? getTitle() : 'Loading...'}
          </Title>
          <DateRangePicker
            value={[fromDatePicker, toDatePicker]}
            onRangePickerChange={handleDateRangeChange}
            onCloseIconClick={handleSetDateRangePickerNull}
          />
        </Stack>
        <SelectedFilters />
      </Stack>
    </S.StyledInnerPageHeader>
  );
});
