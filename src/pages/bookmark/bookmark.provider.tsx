import * as React from 'react';
import { BookmarkStore } from 'src/store/bookmark/bookmark-store.tsx';
import { BookmarkPage } from './bookmark-page.tsx';

export function BookmarkProvider() {
  const store = React.useMemo(() => new BookmarkStore(), []);
  return (
    <BookmarkStoreContext.Provider value={store}>
      <BookmarkPage />
    </BookmarkStoreContext.Provider>
  );
}

export const BookmarkStoreContext = React.createContext<BookmarkStore>(
  {} as any
);

export const useBookmarkStore = () => React.useContext(BookmarkStoreContext);
