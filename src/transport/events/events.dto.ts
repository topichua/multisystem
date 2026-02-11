export interface EventDTO {
  data?: EventListResponse;
  message?: string;
}

interface EventListResponse {
  events?: EventResponse[];
  page?: number;
  size?: number;
  totalItems?: number;
  sortOrder?: string;
  sortField?: string;
}

export type DataMap = Record<string, string>;

export type EventListing = 'cpd' | 'events';

export type GetEventsListDto = {
  keyword?: string | null;
  listing?: EventListing;
  startDateFrom?: string | null;
  startDateTo?: string | null;
  typeId?: string | null;
  locationId?: string[];
  categoryId?: string[];
  tagId?: string[];
  page?: number;
  size?: number;
  sortOrder?: string;
  sortField?: string;
  isPublicEvent?: boolean;
  isActiveEvent?: boolean | null;
};

export type GetEventsListResponse = {
  data: {
    events: EventResponse[];
    page: number;
    size: number;
    totalItems: number;
  };
};

export type EventTicket = {
  ticketPriceId: string;
  name: string;
  amount: number;
  soldOut: boolean;
};

export type CanEnrollLayoutType = {
  canEnrolImageUrl?: string;
  canEnrolTitle?: string;
};

export type Course = {
  courseImageUrl: string;
  courseTitle: string;
  courseDesc: string;
};

export type SessionsType = {
  id: string;
  title: string;
  startDateTime: string;
  startTimeZone: string;
  endDateTime: string;
  endTimeZone: string;
  eventStartUtc: string;
  eventEndUtc: string;
};

export type CpdDetailsType = {
  category: string;
  title: string;
  provider: string;
  practiceDomain: string;
  hours: number;
  points: number;
};

export interface EventResponse {
  id: string;
  title?: string;
  type?: string;
  registerUrlLabel?: string;
  registerUrlLink?: string;
  shortDesc?: string;
  tickets?: TicketPriceResponse[];
  isActive?: boolean;
  isPublic?: boolean;
  acceptRegistration?: boolean;
  presenters: Presenter[];
  isSingleClickRegistration: boolean;
  singleClickTicketPriceId: string | null;
  address?: string;
  venue?: string;
  listingImg?: string;
  featureImg?: string;
  content: string;
  startDateTime: Date;
  startTimeZone: string;
  endDateTime: Date;
  endTimeZone: string;
  eventStartUtc: Date;
  eventEndUtc: Date;
  tags?: Tag[];
  externalUrl?: string;
  canEnrolContent?: string;
  canEnrolLayout?: CanEnrollLayoutType[];
  coursesLayout?: Course[];
  sponsorContent?: string;
  accessContent?: string;
  reasoningContent?: string;
  sessions?: SessionsType[];
  sessionsShortDesc?: string;
  cpdDetails: CpdDetailsType;
}

export interface EventAttachment {
  url: string;
  label: string;
}

export interface Presenter {
  name: string;
  role: string;
  profileDesc: string;
  profileImageUrl: string;
  keywords: string[];
}

export interface Tag {
  id: string;
  label: string;
  type: string;
}

interface TicketPriceResponse {
  id?: string;
  name?: string;
  amount?: number;
  soldOut?: boolean;
}

export interface Ticket {
  ticketId: string;
  ticketNumber: string;
  firstName: string;
  lastName: string;
  mobileName: string;
  email: string;
  orgName?: string | null;
  eventId: string;
  eventTitle: string;
  ticketTypeName: string;
  ticketPrice: number;
  invoiceId: string;
  invoiceNumber: string;
  isPaid: boolean;
  attendanceStatus: string | null;
  address: string;
  venue: string | null;
  eventStart?: Date | null;
  eventEnd?: Date | null;
  dietaryRequirements: string[] | null;
  otherDietaryRequirement: string | null;
  accessibilityRequirement: string | null;
}

export type GetUserUpcomingTicketsDto = {
  page?: number;
  size?: number;
};

export type GetUserUpcomingTicketsResponse = {
  data: {
    registeredTickets: Ticket[];
    page: number;
    size: number;
    totalItems: number;
  };
};

export type ChangeTicketDietaryDto = {
  ticketId: string;
  dietaryRequirements: string[] | null;
  otherDietaryRequirement: string | null;
  accessibilityRequirement: string | null;
};

export type IdLabelType = {
  id: string;
  label: string;
};

export type ValueLabelType = {
  value: string;
  label: string;
};
