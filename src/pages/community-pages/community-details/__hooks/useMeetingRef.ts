import { useCallback, useRef } from 'react';

/**
 * Provides a function to get a ref to an element corresponding to a meeting,
 * or null if the meetingId doesn't match the one in the URL.
 *
 * @returns an object with a function getMeetingRef, which takes a meetingId
 * and a location object as arguments and returns a ref to the meeting element
 * in the page if the meetingId matches the one in the URL, or null otherwise.
 */
export const useMeetingRef = () => {
  const targetRef = useRef(null);

  const getMeetingRef = useCallback(
    (meetId: string, location: Location) => {
      const searchParams = new URLSearchParams(location.search);
      const meetingIdFromUrl = searchParams.get('meetingId');

      return meetId === meetingIdFromUrl ? targetRef : null;
    },
    [targetRef]
  );

  return { getMeetingRef };
};
