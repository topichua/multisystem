// https://day.js.org/docs/en/plugin/loading-into-nodejs
// day.js config
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

export function initDayJs() {
  dayjs.extend(calendar);
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.extend(localizedFormat);
  dayjs.extend(relativeTime);
  dayjs.extend(minMax);
  dayjs.extend(duration);
  dayjs.extend(isBetween);
}

export const formatDateTime = (date: Date | string) =>
  dayjs(date).format('lll');

export const formatDate = (date: Date | string) =>
  dayjs(date).format('DD/MM/YYYY');

export const formatDateNews = (date: Date | string) =>
  dayjs(date).format('DD MMM, YYYY');

export const fromNow = (date: Date | string, skipSuffix?: boolean) =>
  dayjs(date).fromNow(skipSuffix);

export const getCalendarDateTime = (date: Date | string) =>
  dayjs(date).calendar(null, {
    sameDay: '[Today] h:mm A',
    nextDay: '[Tomorrow] h:mm A',
    nextWeek: 'dddd h:mm A',
    lastDay: '[Yesterday] h:mm A',
    lastWeek: 'dddd hh:mm A',
    sameElse: 'lll',
  });

export const getCalendarDate = (date: Date | string) =>
  dayjs(date).calendar(null, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: 'dddd',
    sameElse: 'lll',
  });

dayjs.extend(calendar);
dayjs.extend(customParseFormat);

export const getCalendarDateShortRange = (
  startDate: Date | string,
  endDate: Date | string
): string => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  const startDisplay = start.isSame(end, 'month')
    ? start.format('D')
    : start.format('D MMM');
  return `${startDisplay} - ${end.format('D MMM')}`;
};

export const fullDaysFromEndOfDay = (date: Date | string) =>
  dayjs().endOf('day').diff(date, 'days');

export const getFullDateShortRangeWithTime = (
  startDate: Date | string,
  endDate?: Date | string,
  includeTime = false
): string => {
  if (!startDate && !endDate) {
    return '-';
  }
  const start = dayjs(startDate);
  const end = endDate ? dayjs(endDate) : null;

  const isSameDay = end && start.isSame(end, 'day');
  const isSameMonth = end && start.isSame(end, 'month');

  const singleDayFormat = includeTime ? dateMeetingFormat : 'dddd, MMMM D';
  const rangeStartFormat = 'dddd, MMMM D';
  const rangeEndFormat = isSameMonth ? 'D' : 'MMMM D';

  if (!end) {
    return start.format(singleDayFormat);
  }

  if (isSameDay) {
    return start.format(singleDayFormat);
  }

  const startDisplay = start.format(rangeStartFormat);
  const endDisplay = end.format(rangeEndFormat);

  return `${startDisplay} - ${endDisplay}`;
};

const parseTimezoneOffset = (timezone: string): number => {
  const match = timezone.match(/UTC([+-]\d{2}):(\d{2})/);

  if (!match) {
    throw new Error(`Invalid time zone format: ${timezone}`);
  }

  const [, hours, minutes] = match;
  return parseInt(hours) * 60 + parseInt(minutes);
};

export const getTimeRange = (
  startDateTime: string,
  startTimezone: string,
  endDateTime: string,
  endTimezone: string
) => {
  const startOffset = parseTimezoneOffset(startTimezone);
  const endOffset = parseTimezoneOffset(endTimezone);

  const start = dayjs(startDateTime).utcOffset(startOffset);
  const end = dayjs(endDateTime).utcOffset(endOffset);

  return `${start.format('h:mm a')} - ${end.format('h:mm a')}`;
};

export const dateFormat = 'DD/MM/YYYY';
export const dateMeetingFormat = 'dddd, MMMM D [at] h:mm a';
export const dateRSVPMeetingFormat = 'D MMM, h:mm a';
export const dateNullFormat = '0001-01-01T00:00:00.000Z';
