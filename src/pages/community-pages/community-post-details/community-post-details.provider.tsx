import * as React from 'react';
import { useParams } from 'react-router-dom';

import { CommunityPostDetails } from './community-post-details';
import { CommunityPostDetailsStore } from './community-post-details.store';

export function CommunityPostDetailsProvider() {
  const { alias, id } = useParams();
  const store = React.useMemo(
    () => new CommunityPostDetailsStore(id as string, alias as string),
    [alias, id]
  );

  return (
    <CommunityPostDetailsStoreContext.Provider value={store}>
      <CommunityPostDetails />
    </CommunityPostDetailsStoreContext.Provider>
  );
}
export const CommunityPostDetailsStoreContext =
  React.createContext<CommunityPostDetailsStore>({} as any);

export const useCommunityPostDetailsStore = () =>
  React.useContext(CommunityPostDetailsStoreContext);
