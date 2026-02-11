import dayjs from 'dayjs';
import {
  CommunityMeeting,
  ExploreMeet,
} from 'src/transport/communities/communities.dto';
import { convertDurationToDate } from 'src/utils/time';

export const useCalendarActions = (meeting: CommunityMeeting | ExploreMeet) => {
  const { name, description, startDate, duration, meetingLink } = meeting;

  const formattedStartDate = dayjs(startDate).format('YYYYMMDDTHHmmssZ');
  const formattedEndDate = dayjs(
    convertDurationToDate(duration, startDate)
  ).format('YYYYMMDDTHHmmssZ');

  const generateGoogleCalendarLink = () => {
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(name)}&details=${encodeURIComponent(description || '')}&dates=${formattedStartDate}/${formattedEndDate}&location=${encodeURIComponent(meetingLink || '')}`;
  };

  const createICS = () => {
    const start = dayjs(startDate).format('YYYYMMDDTHHmm00');
    const end = dayjs(convertDurationToDate(duration, startDate)).format(
      'YYYYMMDDTHHmm00'
    );

    return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${name}
DESCRIPTION:${description}
LOCATION:${meetingLink || ''}
DTSTART:${start}
DTEND:${end}
END:VEVENT
END:VCALENDAR`;
  };

  const downloadICS = () => {
    const icsContent = createICS();
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return { generateGoogleCalendarLink, downloadICS };
};
