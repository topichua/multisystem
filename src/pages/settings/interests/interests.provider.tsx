import * as React from 'react';
import { InterestsStore } from 'src/store/interests/interests.store';

export function InterestsProvider({ children }: { children: React.ReactNode }) {
  const store = React.useMemo(() => new InterestsStore(), []);
  return (
    <InterestsStoreContext.Provider value={store}>
      {children}
    </InterestsStoreContext.Provider>
  );
}
export const InterestsStoreContext = React.createContext<InterestsStore>(
  {} as any
);

export const useInterestsStore = () => React.useContext(InterestsStoreContext);
