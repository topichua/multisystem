import { useInfiniteScroll } from 'ahooks';
import { RefObject } from 'react';
import { PAGE_SIZE } from 'src/store/explore-meetings/explore-meetings-store.tsx';
import { ExploreMeetStatus } from 'src/transport/communities/communities.dto';

const useMeetingsInfiniteScroll = (
  ref: RefObject<HTMLDivElement>,
  getAllMeetings: (
    pageSize?: number
  ) => Promise<{ length: number; list: ExploreMeetStatus[] }>,
  totalUpcoming: number,
  totalIncoming: number
) => {
  useInfiniteScroll(
    (d) => getAllMeetings(d ? d.length + PAGE_SIZE : PAGE_SIZE),
    {
      target: ref,
      isNoMore: (d) =>
        d ? d.list.length >= totalUpcoming + totalIncoming : true,
      reloadDeps: [totalUpcoming, totalIncoming],
    }
  );
};

export default useMeetingsInfiniteScroll;
