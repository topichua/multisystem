import { generatePath } from 'react-router-dom';
import { pagesMap } from 'src/pages/authorized/routes';

const ALL = 'all';
const FILTER = 'filter';

export const useEventsDiscoverPath = (areFiltersApplied = false) => {
  return generatePath(pagesMap.eventsDiscover, {
    filterType: areFiltersApplied ? FILTER : ALL,
  });
};
