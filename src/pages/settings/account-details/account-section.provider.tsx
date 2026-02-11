import * as React from 'react';
import { AccountDetailsPage } from './account-details.page';
import { SettingsAccountStore } from 'src/store/settings/SettingsAccountStore';

export function SettingsAccountDetailsProvider() {
  const store = React.useMemo(() => new SettingsAccountStore(), []);
  return (
    <SettingsAccountStoreContext.Provider value={store}>
      <AccountDetailsPage />
    </SettingsAccountStoreContext.Provider>
  );
}
export const SettingsAccountStoreContext =
  React.createContext<SettingsAccountStore>({} as any);

export const useSettingsAccountStore = () =>
  React.useContext(SettingsAccountStoreContext);
