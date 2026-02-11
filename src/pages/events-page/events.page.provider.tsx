import { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { EventsRootStore } from 'src/store/events/events-root.store';

export function EventsProvider() {
  const [store] = useState(() => new EventsRootStore());

  return (
    <EventsStoreContext.Provider value={store}>
      <Outlet />
    </EventsStoreContext.Provider>
  );
}

export const EventsStoreContext = createContext<EventsRootStore | null>(null);

export const useEventsStore = () => {
  const context = useContext(EventsStoreContext);

  if (!context) {
    throw new Error('useEventsStore must be used within an EventsProvider');
  }

  return context;
};
