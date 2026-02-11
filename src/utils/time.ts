import dayjs from 'dayjs';

export const calculateDuration = (start: Date, end: Date): string => {
  const startDayjs = dayjs(start);
  const endDayjs = dayjs(end);
  const duration = dayjs.duration(endDayjs.diff(startDayjs));

  const hours = String(duration.hours()).padStart(2, '0');
  const minutes = String(duration.minutes()).padStart(2, '0');
  const seconds = String(duration.seconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

export const convertDurationToDate = (
  duration: string,
  startDate: Date
): Date => {
  const [hours, minutes, seconds] = duration.split(':').map(Number);
  return dayjs(startDate)
    .add(dayjs.duration({ hours, minutes, seconds }))
    .toDate();
};

export const combineDateAndTime = (date: Date, time: Date): Date => {
  const dateDayjs = dayjs(date);
  const timeDayjs = dayjs(time);

  const combinedDayjs = dateDayjs
    .hour(timeDayjs.hour())
    .minute(timeDayjs.minute())
    .second(timeDayjs.second());

  return combinedDayjs.toDate();
};
