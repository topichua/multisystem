import { eventsApi } from 'src/transport/events/events.api';
import { EventsStore } from './events-store';
import { EventsFilterStore } from './events-filter.store';

export class EventsRootStore {
  eventsStore: EventsStore;
  eventsFilterStore: EventsFilterStore;

  constructor() {
    this.eventsStore = new EventsStore(this, eventsApi);
    this.eventsFilterStore = new EventsFilterStore(this);
  }
}
