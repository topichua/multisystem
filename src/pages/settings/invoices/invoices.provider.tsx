import * as React from 'react';
import { InvoicesPageSection } from './invoices.page.section';
import { InvoicesStore } from 'src/store/invoices/invoices.store';

export function InvoicesProvider() {
  const store = React.useMemo(() => new InvoicesStore(), []);
  return (
    <InvoicesStoreContext.Provider value={store}>
      <InvoicesPageSection />
    </InvoicesStoreContext.Provider>
  );
}
export const InvoicesStoreContext = React.createContext<InvoicesStore>(
  {} as any
);

export const useInvoicesStore = () => React.useContext(InvoicesStoreContext);
