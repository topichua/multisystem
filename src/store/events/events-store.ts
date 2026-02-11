import { makeAutoObservable, runInAction } from 'mobx';
import { eventsApi } from 'src/transport/events/events.api';
import {
  EventResponse,
  GetEventsListDto,
  IdLabelType,
  Tag,
  ValueLabelType,
} from 'src/transport/events/events.dto';
import {
  convertObjectMapToDropdownOptionsArray,
  convertObjectMapToMenuItemsArray,
} from 'src/utils/object-array.utils';
import { EventsRootStore } from './events-root.store';
import { debounce, DebouncedFunc } from 'lodash';

type EventsBooleanKeys = keyof Pick<
  EventsStore,
  | 'isLoadingEvents'
  | 'isLoadingFavoriteEvents'
  | 'isLoadingEventFilters'
  | 'areEventsListLoaded'
  | 'areFavoriteEventsLoaded'
  | 'areEventFiltersLoaded'
>;

type EventsNumericalKeys = keyof Pick<
  EventsStore,
  'currentPage' | 'totalEvents'
>;

export type DebouncedFetchAllEventsType = DebouncedFunc<
  (options: GetEventsListDto) => void
>;

export class EventsStore {
  eventListingOptions: IdLabelType[] = [
    { id: 'events', label: 'Event' },
    { id: 'cpd', label: 'CPD' },
  ];

  isLoadingEvents = true;
  isLoadingFavoriteEvents = true;
  isLoadingEventFilters = true;

  areEventsListLoaded = false;
  areFavoriteEventsLoaded = false;
  areEventFiltersLoaded = false;

  currentPage = 1;
  totalEvents = 0;
  pageSize: number = 20;

  eventsFavoriteList: EventResponse[] = [];
  eventLocations: ValueLabelType[] = [];
  eventCategories: IdLabelType[] = [];
  eventTypes: IdLabelType[] = [];
  eventTags: Tag[] = [];
  filteredEventTags: Tag[] = [];
  visitedPages: Set<number> = new Set();
  eventsListMap: Map<number, EventResponse[]> = new Map();

  eventsRootStore: EventsRootStore;
  private eventsService: typeof eventsApi;
  private debouncedFetchAllEvents: DebouncedFetchAllEventsType;

  constructor(
    eventsRootStore: EventsRootStore,
    eventsService: typeof eventsApi
  ) {
    this.eventsRootStore = eventsRootStore;
    this.eventsService = eventsService;

    this.debouncedFetchAllEvents = this.createDebouncedFetchEvents(300);

    makeAutoObservable(this);
  }

  setEventsNumericalValue = <K extends EventsNumericalKeys>(
    key: K,
    value: EventsStore[K]
  ) => {
    if (typeof value === 'number') {
      this[key] = value;
    } else {
      console.error(`Expected a numerical value for ${key}`);
    }
  };

  setEventsBooleanValue = <K extends EventsBooleanKeys>(
    key: K,
    value: boolean
  ) => {
    if (typeof value === 'boolean') {
      this[key] = value;
    } else {
      console.error(`Expected a boolean value for ${key}`);
    }
  };

  clearMapsAndSets = () => {
    this.visitedPages = new Set();
    this.eventsListMap = new Map();
    this.currentPage = 1;
    this.totalEvents = 0;
  };

  private createDebouncedFetchEvents = (
    delay: number
  ): DebouncedFetchAllEventsType => {
    return debounce((options: GetEventsListDto) => {
      this.fetchAllEvents(options);
    }, delay);
  };

  fetchAllEvents = async (options: GetEventsListDto) => {
    if (
      this.eventsListMap.size > 0 &&
      (this.isLoadingEvents || this.visitedPages.has(this.currentPage))
    )
      return;

    this.setEventsBooleanValue('isLoadingEvents', true);

    try {
      const {
        data: { events, totalItems },
      } = await this.eventsService.getEventList({
        ...options,
        page: this.currentPage,
        size: this.pageSize,
        sortOrder: 'asc',
        isActiveEvent: null,
      });

      runInAction(() => {
        this.totalEvents = totalItems;
        this.visitedPages.add(this.currentPage);

        if (events.length > 0) {
          this.eventsListMap.set(this.currentPage, [...events]);
        }
      });
    } catch (error) {
      this.setEventsBooleanValue('areEventsListLoaded', false);
      console.error('Failed to fetch all events: ', error);
    } finally {
      this.setEventsBooleanValue('isLoadingEvents', false);
    }
  };

  fetchAllEventsDebounced = (options: GetEventsListDto) => {
    this.debouncedFetchAllEvents(options);
  };

  fetchAllFavoriteEvents = async () => {
    this.setEventsBooleanValue('isLoadingFavoriteEvents', true);

    try {
      const {
        data: { events: favoriteEvents },
      } = await this.eventsService.getFavoriteEvents();
      this.eventsFavoriteList.push(...favoriteEvents);
    } catch (error) {
      this.setEventsBooleanValue('areFavoriteEventsLoaded', false);
      console.error('Failed to fetch all favorite events: ', error);
    } finally {
      this.setEventsBooleanValue('isLoadingFavoriteEvents', false);
    }
  };

  fetchAllEventsFilter = async () => {
    if (this.areEventFiltersLoaded) return;

    this.setEventsBooleanValue('isLoadingEventFilters', true);

    try {
      const [
        eventCategoriesResponse,
        eventLocationsResponse,
        eventTypesResponse,
        eventTagsResponse,
      ] = await Promise.all([
        this.eventsService.getCategories(), // CPD Category (Should be available for CPD events only)
        this.eventsService.getLocations(),
        this.eventsService.getTypes(),
        this.eventsService.getTags(),
      ]);

      runInAction(() => {
        this.eventCategories.push(
          ...convertObjectMapToMenuItemsArray(
            eventCategoriesResponse?.data || []
          )
        );

        this.eventLocations.push(
          ...convertObjectMapToDropdownOptionsArray(
            eventLocationsResponse?.data || []
          )
        );

        this.eventTypes.push(
          ...convertObjectMapToMenuItemsArray(eventTypesResponse?.data || [])
        );

        this.eventTags.push(...(eventTagsResponse?.data || []));
      });

      this.setEventsBooleanValue('areEventFiltersLoaded', true);
    } catch (error) {
      this.setEventsBooleanValue('areEventFiltersLoaded', false);
      console.error('Failed to fetch all event filters: ', error);
    } finally {
      this.setEventsBooleanValue('isLoadingEventFilters', false);
    }
  };

  get currentPageEvents(): EventResponse[] {
    return this.eventsListMap.get(this.currentPage) ?? [];
  }
}
