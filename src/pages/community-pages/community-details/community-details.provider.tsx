import * as React from 'react';
import { useParams } from 'react-router';

import { CommunityDetailsStore } from './community-details.store';
import { CommunityDetails } from './community-details';

export function CommunityDetailsProvider() {
  const { alias } = useParams();
  const store = React.useMemo(
    () => new CommunityDetailsStore(alias as any),
    [alias]
  );

  return (
    <CommunityStoreContext.Provider value={store}>
      <CommunityDetails />
    </CommunityStoreContext.Provider>
  );
}
const CommunityStoreContext = React.createContext<CommunityDetailsStore>(
  {} as any
);

export const useCommunityDetailsStore = () =>
  React.useContext(CommunityStoreContext);
