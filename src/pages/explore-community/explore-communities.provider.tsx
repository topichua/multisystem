import * as React from 'react';
import { ExporeCommunitiesPage } from './explore-community-page.tsx';
import { ExploreCommunityStore } from 'src/store/explore-community/explore-community-store.tsx';

export function ExploreCommunityProvider() {
  const store = React.useMemo(() => new ExploreCommunityStore(), []);
  return (
    <ExploreCommunityStoreContext.Provider value={store}>
      <ExporeCommunitiesPage />
    </ExploreCommunityStoreContext.Provider>
  );
}

export const ExploreCommunityStoreContext =
  React.createContext<ExploreCommunityStore>({} as any);

export const useExploreCommunityStore = () =>
  React.useContext(ExploreCommunityStoreContext);
