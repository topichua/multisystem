import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EngagementAction } from 'src/hooks/useEngagementTracker/types.ts';
import { useEngagementTracker } from 'src/hooks/useEngagementTracker/useEngagementTracker.ts';
import { getPageTitleByPath } from 'src/utils/pagesTitles.ts';

/**
 * event detail: /events/{id}
 *
 * community: /communities/{alias} or /communities/{alias}/{tab}
 *
 * news detail: /news/details/{id}
 *
 * resource detail: /resources/details/{id}
 *
 * These pages do not need to be included in viewPage tracking,
 * because they have separate tracking mechanisms for events, communities,
 * news, and resources respectively.
 * */
const excludedPaths = [
  /^\/events\/[\w-]+$/,
  /^\/communities\/[\w-]+(\/[\w-]+)?$/,
  /^\/news\/details\/[\w-]+$/,
  /^\/resources\/details\/[\w-]+$/,
];

const shouldSendAnalytics = (path: string): boolean => {
  return !excludedPaths.some((regex) => regex.test(path));
};

const AnalyticsTracker: React.FC = () => {
  const location = useLocation();
  const { track } = useEngagementTracker();

  useEffect(() => {
    const path = location.pathname;

    if (shouldSendAnalytics(path)) {
      const name = getPageTitleByPath(path);
      if (name) {
        track({
          action: EngagementAction.ViewPage,
          entityName: name,
          entityUrl: window.location.href,
        });
      }
    }
  }, [location, track]);

  return null;
};

export default AnalyticsTracker;
