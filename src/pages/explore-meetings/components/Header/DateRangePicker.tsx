import { FC, PropsWithChildren, useState } from 'react';
import { observer } from 'mobx-react';
import { Calendar } from '@untitled-ui/icons-react';
import { DatePicker } from 'antd';
import { Dayjs } from 'dayjs';
import { Button } from 'src/components/common/Button/Button.tsx';
import * as S from '../common.styled.ts';

const { RangePicker } = DatePicker;

export type NoUndefinedRangeValueType<DateType> = [
  start: DateType | null,
  end: DateType | null,
];

type DateRangePickerProps = PropsWithChildren & {
  value: [Dayjs | null, Dayjs | null];
  onRangePickerChange?: (
    dates: NoUndefinedRangeValueType<Dayjs> | null
  ) => void;
  onCloseIconClick?: () => void;
};
export const DateRangePicker: FC<DateRangePickerProps> = observer(
  ({ value, onRangePickerChange, onCloseIconClick }) => {
    const [fromDatePicker, toDatePicker] = value;

    const [isRangePickerOpen, setRangePickerOpen] = useState<boolean>(false);

    const handleRangeChange = (
      dates: NoUndefinedRangeValueType<Dayjs> | null
    ) => {
      if (typeof onRangePickerChange === 'function') {
        onRangePickerChange(dates);
      }

      setRangePickerOpen(false);
    };

    const handleCloseIconClick = () => {
      if (typeof onCloseIconClick === 'function') {
        onCloseIconClick();
      }
    };

    const toggleRangePickerOpenState = () =>
      setRangePickerOpen((prevState) => !prevState);

    return fromDatePicker && toDatePicker ? (
      <S.StyledRangePicker alignment="center" spacing="extraTight">
        <S.CloseIcon onClick={handleCloseIconClick} />
        <RangePicker
          defaultValue={[fromDatePicker, toDatePicker]}
          value={[fromDatePicker, toDatePicker]}
          onChange={handleRangeChange}
          allowClear={false}
        />
      </S.StyledRangePicker>
    ) : (
      <S.StyledRangePickerInit vertical wrap={false}>
        <RangePicker open={isRangePickerOpen} onChange={handleRangeChange} />
        <Button
          icon={<Calendar height={20} />}
          onClick={toggleRangePickerOpenState}
        >
          Select date range
        </Button>
      </S.StyledRangePickerInit>
    );
  }
);
