import * as React from 'react';
import { useParams } from 'react-router-dom';

import { CommunityManagementStore } from './admin-community.store';
import { AdminCommunityLayout } from './admin-community.layout';

// import { useCurrentUserStore } from '../../authorized.layout';

export function AdminCommunityProvider() {
  //   const user = useCurrentUserStore();
  const { id } = useParams();
  const store = React.useMemo(
    () => new CommunityManagementStore(id as string),
    []
  );

  return (
    <CommunityManagementStoreContext.Provider value={store}>
      <AdminCommunityLayout />
    </CommunityManagementStoreContext.Provider>
  );
}
export const CommunityManagementStoreContext =
  React.createContext<CommunityManagementStore>({} as any);

export const useCommunityManagementStore = () =>
  React.useContext(CommunityManagementStoreContext);
