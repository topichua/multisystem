import * as React from 'react';
import { CommunicationPreferncesStore } from 'src/store/communication-preferences/communication-preferences.store';

export function CommunicationPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = React.useMemo(() => new CommunicationPreferncesStore(), []);
  return (
    <CommunicationPreferncesContext.Provider value={store}>
      {children}
    </CommunicationPreferncesContext.Provider>
  );
}
export const CommunicationPreferncesContext =
  React.createContext<CommunicationPreferncesStore>({} as any);

export const useCommunicationPreferncesStore = () =>
  React.useContext(CommunicationPreferncesContext);
