import dayjs from 'dayjs';

const CPD_DATE_FORMAT = 'YYYY';

export const formatDateRange = (
  startDate: string,
  endDate: string,
  timezone = 'UTC'
) => {
  const start = dayjs(startDate).tz(timezone);
  const end = dayjs(endDate).tz(timezone);

  if (start.month() === 11 && start.year() === end.year() - 1) {
    return `${start.year()} - ${end.format(CPD_DATE_FORMAT)}`;
  }

  return `${start.format(CPD_DATE_FORMAT)} - ${end.format(CPD_DATE_FORMAT)}`;
};

export const getCompletedDate = (completedDate: string, timezone = 'UTC') => {
  return dayjs(completedDate).tz(timezone).format('MMMM D, YYYY h:mm A');
};
