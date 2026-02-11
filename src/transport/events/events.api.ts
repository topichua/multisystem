import axiosBond from '../axios/axios-bond-instance';

import { EventQueryParams, NominateTicketParams } from './events.cart.dto';

import {
  ChangeTicketDietaryDto,
  DataMap,
  EventAttachment,
  EventResponse,
  EventTicket,
  GetEventsListDto,
  GetEventsListResponse,
  GetUserUpcomingTicketsDto,
  GetUserUpcomingTicketsResponse,
  Tag,
  Ticket,
} from './events.dto';

export const eventsApi = {
  async getEventList(
    options: GetEventsListDto
  ): Promise<GetEventsListResponse> {
    return await axiosBond.post(`/api/event/list`, options);
  },

  async getTicket(id: string): Promise<{ data: EventTicket[] }> {
    return await axiosBond.get(`/api/event/${id}/tickets`);
  },

  async getTypes(): Promise<{ data: DataMap }> {
    return await axiosBond.get(`/api/event/types`);
  },

  async getCategories(): Promise<{ data: DataMap }> {
    return await axiosBond.get(`/api/event/categories`);
  },

  async getLocations(): Promise<{ data: DataMap }> {
    return await axiosBond.get(`/api/event/locations`);
  },

  async getTags(): Promise<{ data: Tag[] }> {
    return await axiosBond.get(`/api/tag/tags`);
  },

  async getWhenFilter() {
    return await axiosBond.get(`/api/event/whenfilter`);
  },

  async getEvent(id: string): Promise<{ data: EventResponse }> {
    return await axiosBond.get(`/api/Event/${id}`);
  },

  async getEventTickets(id: string): Promise<{ data: EventTicket[] }> {
    return await axiosBond.get(`/api/event/${id}/tickets`);
  },

  async getUserUpcomingTickets({
    page = 1,
    size = 20,
  }: GetUserUpcomingTicketsDto): Promise<GetUserUpcomingTicketsResponse> {
    return await axiosBond.post(`/api/user/upcomingevents`, { page, size });
  },

  async getUserPastTickets({
    page = 1,
    size = 20,
  }: GetUserUpcomingTicketsDto): Promise<GetUserUpcomingTicketsResponse> {
    return await axiosBond.post(`/api/user/pastevents`, { page, size });
  },

  async getEventAttachment(
    eventId: string,
    type: 'links' | 'docs'
  ): Promise<{ data: { attachments: EventAttachment[] } }> {
    return await axiosBond.get(`/api/event/${eventId}/${type}`);
  },

  async getUserEventTickets(
    eventId: string
  ): Promise<{ data: { registeredTickets: Ticket[] } }> {
    return await axiosBond.get(`/api/user/event/${eventId}/tickets`);
  },

  async registerToEvent(
    ticketPriceId: string,
    userId: string
  ): Promise<{ data: Ticket }> {
    return await axiosBond.post(`/api/event/register`, {
      ticketPriceId,
      userId,
    });
  },

  async cancelTicket(
    ticketId: string
  ): Promise<{ data: boolean; message: string }> {
    return await axiosBond.post(`/api/ticket/cancel`, {
      ticketId,
    });
  },

  async nominateTicket(
    data: NominateTicketParams
  ): Promise<{ data: boolean; message: string }> {
    return await axiosBond.post('/api/ticket/nominatesubstitute', data);
  },

  async sendEventQuery(
    data: EventQueryParams
  ): Promise<{ data: boolean; message: string }> {
    return await axiosBond.post('/api/user/eventquery', data);
  },

  async changeTicketDietary(
    data: ChangeTicketDietaryDto
  ): Promise<{ data: boolean; message: string }> {
    return await axiosBond.post('/api/ticket/update', data);
  },

  async getFavoriteEvents(): Promise<GetEventsListResponse> {
    return await axiosBond.get(`api/favourite/events`);
  },

  async addEventToFavorite(eventId: string) {
    return await axiosBond.post(`api/favourite/event/${eventId}`);
  },

  async removeEventFromFavorite(eventId: string) {
    return await axiosBond.delete(`api/favourite/event/${eventId}`);
  },
};
