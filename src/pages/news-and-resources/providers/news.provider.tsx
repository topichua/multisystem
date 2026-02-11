import { createContext, useMemo } from 'react';

import { NewsStore } from 'src/store/news/news-store';

import { NewsPage } from '../news';

export const NewsProvider = () => {
  const store = useMemo(() => new NewsStore(), []);
  return (
    <NewsStoreContext.Provider value={store}>
      <NewsPage />
    </NewsStoreContext.Provider>
  );
};

export const NewsStoreContext = createContext<NewsStore>({} as NewsStore);
