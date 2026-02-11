import { FilterFunnel01 } from '@untitled-ui/icons-react';
import { useBoolean } from 'ahooks';
import { Card, DatePicker, Dropdown, Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import { Button } from 'src/components/common/Button/Button';
import { Stack } from 'src/components/common/Stack/Stack';
import { eventsApi } from 'src/transport/events/events.api';
import { DataMap, GetEventsListDto } from 'src/transport/events/events.dto';

const { RangePicker } = DatePicker;

type EventsFilterProps = {
  initialFilter: GetEventsListDto;
  onChangeFilter: (filter: GetEventsListDto) => void;
};

export const EventsFilter = ({
  initialFilter,
  onChangeFilter,
}: EventsFilterProps) => {
  const [isOpenDropdown, { setFalse: closeDropdown, set: setStateDropdown }] =
    useBoolean(false);
  const [filter, setFilter] = useState(initialFilter);

  const [
    isOptionsLoading,
    { setTrue: startOptionsLoading, setFalse: finishOptionsLoading },
  ] = useBoolean(false);
  const [categories, setCategories] = useState<DefaultOptionType[]>([]);
  const [locations, setLocations] = useState<DefaultOptionType[]>([]);
  const [types, setTypes] = useState<DefaultOptionType[]>([]);
  const [tags, setTags] = useState<DefaultOptionType[]>([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    startOptionsLoading();

    const [fetchedCategories, fetchedTypes, fetchedLocations, fetchedTags] =
      await Promise.all([
        eventsApi.getCategories(),
        eventsApi.getTypes(),
        eventsApi.getLocations(),
        eventsApi.getTags(),
      ]);

    setCategories(convertToArrayOfOptions(fetchedCategories.data));
    setLocations(convertToArrayOfOptions(fetchedLocations.data));
    setTypes(convertToArrayOfOptions(fetchedTypes.data));
    setTags(
      fetchedTags.data.map((tag) => ({ label: tag.label, value: tag.id }))
    );

    finishOptionsLoading();
  };

  const handleDropdownOpenChange = (isOpen: boolean) => {
    if (isOpen) setFilter(initialFilter);
    setStateDropdown(isOpen);
  };

  const clearFilter = () => {
    onChangeFilter({
      typeId: null,
      locationId: [],
      categoryId: [],
      tagId: [],
      startDateFrom: null,
      startDateTo: null,
    });
    closeDropdown();
  };

  const applyFilter = () => {
    onChangeFilter(filter);
    closeDropdown();
  };

  const pickerValue: [Dayjs | null, Dayjs | null] = useMemo(() => {
    return [
      filter.startDateFrom ? dayjs(filter.startDateFrom) : null,
      filter.startDateTo ? dayjs(filter.startDateTo) : null,
    ];
  }, [filter.startDateFrom, filter.startDateTo]);

  return (
    <Dropdown
      placement="bottomRight"
      open={isOpenDropdown}
      dropdownRender={() => (
        <Card style={{ width: 400 }}>
          <Stack vertical>
            <RangePicker
              value={pickerValue}
              style={{ width: '100%' }}
              onChange={(date) => {
                setFilter({
                  ...filter,
                  startDateFrom: date?.[0]?.toString(),
                  startDateTo: date?.[1]?.toString(),
                });
              }}
            />

            <Select
              value={filter?.typeId}
              style={{ width: '100%' }}
              placeholder="Events type"
              loading={isOptionsLoading}
              options={types}
              onChange={(val) => setFilter({ ...filter, typeId: val })}
            />

            <Select
              value={filter?.categoryId}
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Events categories"
              loading={isOptionsLoading}
              options={categories}
              onChange={(val) => setFilter({ ...filter, categoryId: val })}
            />

            <Select
              value={filter?.locationId}
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Events locations"
              loading={isOptionsLoading}
              options={locations}
              onChange={(val) => setFilter({ ...filter, locationId: val })}
            />

            <Select
              value={filter?.tagId}
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Tags"
              loading={isOptionsLoading}
              options={tags}
              showSearch
              optionFilterProp="label"
              onChange={(val) => setFilter({ ...filter, tagId: val })}
            />

            <Stack alignment="center">
              <Stack.Item fill>
                <Button block onClick={clearFilter}>
                  Clear
                </Button>
              </Stack.Item>
              <Stack.Item fill>
                <Button block type="primary" onClick={applyFilter}>
                  Apply
                </Button>
              </Stack.Item>
            </Stack>
          </Stack>
        </Card>
      )}
      onOpenChange={handleDropdownOpenChange}
      trigger={['click']}
    >
      <Button type="text" icon={<FilterFunnel01 />} />
    </Dropdown>
  );
};

const convertToArrayOfOptions = (dataMap: DataMap) => {
  return Object.entries(dataMap).map(([key, value]) => ({
    label: value,
    value: key,
  }));
};
