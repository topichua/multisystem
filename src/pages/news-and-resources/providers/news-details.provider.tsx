import { createContext, useMemo } from 'react';

import { NewsStore } from 'src/store/news/news-store';
import { NewsCardDetailsPage } from '../news-card-details-page';

export const NewsDetailsProvider = () => {
  const store = useMemo(() => new NewsStore(), []);
  return (
    <NewsDetailsStoreContext.Provider value={store}>
      <NewsCardDetailsPage />
    </NewsDetailsStoreContext.Provider>
  );
};

export const NewsDetailsStoreContext = createContext<NewsStore>(
  {} as NewsStore
);
