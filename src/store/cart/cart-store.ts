import { makeAutoObservable } from 'mobx';
import { EventTicket } from 'src/transport/events/events.dto';

export type TicketDetails = EventTicket & {
  quantity: number;
};
export type MapTicketsEvent = Map<string, TicketDetails[]>;

export class CartStore {
  tickets: MapTicketsEvent = new Map();

  constructor() {
    makeAutoObservable(this);
  }
}
