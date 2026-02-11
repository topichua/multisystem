import dayjs, { Dayjs } from 'dayjs';
import { RuleObject } from 'rc-field-form/lib/interface';

export const TIME_FORMAT = 'HH:mm';

export const disablePastDates = (current: Dayjs) => {
  return current && current.isBefore(dayjs().startOf('day'), 'day');
};

export const validatePastTimes =
  (selectedDate: Dayjs | null) => (_: RuleObject, value: Dayjs) => {
    const now = dayjs();
    const selectedDateTime =
      selectedDate && value
        ? selectedDate.hour(value.hour()).minute(value.minute())
        : null;
    const isToday = selectedDate ? selectedDate.isSame(now, 'day') : false;

    if (
      isToday &&
      selectedDateTime &&
      selectedDateTime.isBefore(now, 'minute')
    ) {
      return Promise.reject(new Error('Time cannot be in the past'));
    }
    return Promise.resolve();
  };

export const validateEndTimes =
  (selectedStartTime: Dayjs | null) => (_: RuleObject, value: Dayjs) => {
    if (
      selectedStartTime &&
      value &&
      value.isBefore(selectedStartTime, 'minute')
    ) {
      return Promise.reject(new Error('End time before start time'));
    }
    return Promise.resolve();
  };

export const validateMeetingLink = (_: RuleObject, link: string) => {
  if (!link) {
    return Promise.reject();
  }

  const urlPattern = new RegExp(
    '^(https?:\\/\\/)' + // Protocol (http or https)
      '([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}' + // Domain and subdomains
      '(\\/[\\w-.~%]*)*' + // Path including encoded characters (%)
      '(\\?[\\w-.~%=&]*)?$' // Query string with encoded characters, &, =
  );

  if (!urlPattern.test(link)) {
    return Promise.reject('Please enter a valid meeting link');
  }

  return Promise.resolve();
};

export const validateRsvpDateTime =
  (startDate: Dayjs | null, startTime: Dayjs | null, rsvpDateTime: Dayjs) =>
  () => {
    if (!startDate || !startTime || !rsvpDateTime) {
      return Promise.resolve();
    }

    const combinedStartDateTime = startDate
      .hour(startTime.hour())
      .minute(startTime.minute());

    if (rsvpDateTime.isAfter(combinedStartDateTime, 'minute')) {
      return Promise.reject(
        new Error('The RSVP date cannot be set after the meeting start time')
      );
    }

    return Promise.resolve();
  };

export const validateEmpty =
  (errorText: string) => (_: RuleObject, value: string) => {
    if (!value || value.trim() === '') {
      return Promise.reject(new Error(errorText));
    }
    return Promise.resolve();
  };
