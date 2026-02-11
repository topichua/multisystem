import * as React from 'react';
import { ExploreMeetingsStore } from 'src/store/explore-meetings/explore-meetings-store.tsx';
import { ExporeMeetingsPage } from './explore-meetings-page.tsx';

export function ExploreMeetingsProvider() {
  const store = React.useMemo(() => new ExploreMeetingsStore(), []);
  return (
    <ExploreMeetingsStoreContext.Provider value={store}>
      <ExporeMeetingsPage />
    </ExploreMeetingsStoreContext.Provider>
  );
}

export const ExploreMeetingsStoreContext =
  React.createContext<ExploreMeetingsStore>({} as any);

export const useExploreMeetingsStore = () =>
  React.useContext(ExploreMeetingsStoreContext);
