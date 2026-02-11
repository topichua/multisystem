import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Returns the id of the meeting that should be highlighted, or null if none
 *
 * The function listens to the location change and if the meeting-id is in
 * the query string, it scrolls to the corresponding element and marks it
 * as highlighted for 2 seconds.
 *
 * @param meetingsLoading - indicates if meetings are being loaded from the server
 * @param updateMeetingStatusLoading - indicates if the meeting status is being updated
 * @returns the id of the meeting that should be highlighted, or null if none
 */
export const useScrollToMeeting = (isLoading: boolean) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const meetingId = searchParams.get('meetingId');

    if (meetingId && !isLoading) {
      const targetElement = document.getElementById(`meeting-${meetingId}`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedId(meetingId);
        setTimeout(() => {
          setHighlightedId(null);
          searchParams.delete('meetingId');
          const newUrl = `${window.location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
          window.history.replaceState({}, '', newUrl);
        }, 2000);
      }
    }
  }, [isLoading, location.pathname, location.search, navigate]);

  return highlightedId;
};
