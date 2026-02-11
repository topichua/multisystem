import * as React from 'react';
import { CommunitiesPage } from './communities-page';
import { CommunityStore } from 'src/store/communities/community-store';

export function CommunityProvider() {
  const store = React.useMemo(() => new CommunityStore(), []);
  return (
    <CommunityStoreContext.Provider value={store}>
      <CommunitiesPage />
    </CommunityStoreContext.Provider>
  );
}
export const CommunityStoreContext = React.createContext<CommunityStore>(
  {} as any
);

export const useCommunityManagementStore = () =>
  React.useContext(CommunityStoreContext);
