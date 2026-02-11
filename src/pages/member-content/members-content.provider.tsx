import * as React from 'react';

import { MemberContentStore } from 'src/store/member-content/member-content-store';

import { MemberContentLayout } from './member-content.layout';

export function MemberContentProvider() {
  const store = React.useMemo(() => new MemberContentStore(), []);
  return (
    <MemberContentStoreContext.Provider value={store}>
      <MemberContentLayout />
    </MemberContentStoreContext.Provider>
  );
}

export const MemberContentStoreContext =
  React.createContext<MemberContentStore>({} as any);

export const useMemberContentStore = () =>
  React.useContext(MemberContentStoreContext);
