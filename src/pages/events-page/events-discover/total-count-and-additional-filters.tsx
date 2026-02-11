import { observer } from 'mobx-react';
import { useEventsStore } from '../events.page.provider';
import { Stack } from 'src/components/common/Stack/Stack';
import { InnerPageHeader } from 'src/components/common/Inner-page-header/inner-page-header';
import { formatSingular } from 'src/utils/text';
import { CountLabels } from 'src/utils/text-consts';
import { Select, Tooltip, Typography } from 'antd';
import { MarkerPin01 } from '@untitled-ui/icons-react';
import { toJS } from 'mobx';
import {
  DateRangePicker,
  NoUndefinedRangeValueType,
} from 'src/pages/explore-meetings/components/Header/DateRangePicker';
import { Dayjs } from 'dayjs';
import SkeletonButton from 'antd/es/skeleton/Button';
import { StyledSwitch } from '../events-page.styled';
import { FC, PropsWithChildren } from 'react';

const SkeletonAdditionalFilters = () => {
  return (
    <Stack fill distribution="equalSpacing">
      <SkeletonButton
        active
        style={{ height: 18, width: 100, marginTop: '8px' }}
      />
      <SkeletonButton
        active
        style={{ height: 18, width: 180, marginTop: '8px' }}
      />
      <SkeletonButton
        active
        style={{ height: 18, width: 150, marginTop: '8px' }}
      />
    </Stack>
  );
};

export const TotalCountAndAdditionalFilters: FC<PropsWithChildren> = observer(
  () => {
    const rootStore = useEventsStore();

    const { isLoadingEventFilters, isLoadingEvents, totalEvents } =
      rootStore.eventsStore;

    const {
      setFilterArrayValues,
      setFilterStringValue,
      locationId,
      dateFrom,
      dateTo,
    } = rootStore.eventsFilterStore;

    const eventLocations = toJS(rootStore.eventsStore.eventLocations);
    const selectedEventLocations = toJS(locationId);

    const handleEventLocationChange = (selectedLocations: string[]) => {
      setFilterArrayValues('locationId', selectedLocations);
    };

    const handleRangePickerChange = (
      dates: NoUndefinedRangeValueType<Dayjs> | null
    ) => {
      if (dates) {
        const [startDate, endDate] = dates;

        setFilterStringValue('dateFrom', startDate ?? null);
        setFilterStringValue('dateTo', endDate ?? null);
      }
    };

    const handleSetDatepickerNull = () => {
      setFilterStringValue('dateFrom', null);
      setFilterStringValue('dateTo', null);
    };

    return (
      <>
        <InnerPageHeader
          title={
            isLoadingEvents && totalEvents === 0 ? (
              <SkeletonButton active style={{ height: 18, width: 180 }} />
            ) : (
              formatSingular(totalEvents, CountLabels.EVENTS)
            )
          }
        >
          {isLoadingEventFilters ? (
            <SkeletonAdditionalFilters />
          ) : (
            <Stack distribution="equalSpacing" style={{ marginRight: '16px' }}>
              <Stack distribution="equalSpacing" style={{ paddingTop: '5px' }}>
                <StyledSwitch disabled />
                <Typography.Text>Member-only</Typography.Text>
              </Stack>

              <Select
                mode="multiple"
                maxTagCount={4}
                maxTagPlaceholder={(omittedValues) => {
                  return (
                    <Tooltip
                      title={omittedValues
                        .map((omittedItem) => omittedItem.label)
                        .join(', ')}
                      overlayStyle={{ pointerEvents: 'none' }}
                    >
                      <span>{`+${omittedValues.length} more`}</span>
                    </Tooltip>
                  );
                }}
                placeholder={
                  <Stack
                    alignment="leading"
                    spacing={'normal'}
                    style={{ paddingTop: '5px' }}
                  >
                    <MarkerPin01 width={20} height={20} />
                    <Typography.Text>Location</Typography.Text>
                  </Stack>
                }
                value={selectedEventLocations}
                options={eventLocations.map(({ label, value }) => ({
                  value,
                  label,
                }))}
                loading={isLoadingEventFilters}
                style={{ minWidth: '169px' }}
                optionFilterProp="label"
                onChange={handleEventLocationChange}
                showSearch={true}
              />

              <DateRangePicker
                value={[dateFrom, dateTo]}
                onRangePickerChange={handleRangePickerChange}
                onCloseIconClick={handleSetDatepickerNull}
              />
            </Stack>
          )}
        </InnerPageHeader>
      </>
    );
  }
);
