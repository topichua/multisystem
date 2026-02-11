import { computed, makeAutoObservable } from 'mobx';
import { EventsRootStore } from './events-root.store';
import dayjs, { Dayjs } from 'dayjs';
import { GetEventsListDto } from 'src/transport/events/events.dto';

type EventsFilterStringKeys = keyof Pick<
  EventsFilterStore,
  'typeId' | 'dateFrom' | 'dateTo' | 'keyword' | 'listingId'
>;
type EventsFilterArrayKeys = keyof Pick<
  EventsFilterStore,
  'tagId' | 'locationId' | 'categoryId'
>;
type EventsFilterQueryParamKeys =
  | 'type'
  | 'tag'
  | 'category'
  | 'location'
  | 'startDate'
  | 'endDate'
  | 'keyword'
  | 'listing';

interface CustomURLSearchParams extends URLSearchParams {
  get(key: EventsFilterQueryParamKeys): string | null;
  set(key: EventsFilterQueryParamKeys, value: string): void;
}

export class EventsFilterStore {
  keyword: string = '';
  typeId: string | null = null;
  listingId: string | null = null;
  dateFrom: Dayjs | null = null;
  dateTo: Dayjs | null = null;
  locationId: string[] = [];
  categoryId: string[] = [];
  tagId: string[] = [];

  eventsRootStore: EventsRootStore;

  constructor(eventsRootStore: EventsRootStore) {
    this.eventsRootStore = eventsRootStore;

    makeAutoObservable(this);
  }

  setFilterStringValue = <K extends EventsFilterStringKeys>(
    key: K,
    value: EventsFilterStore[K]
  ) => {
    (this as EventsFilterStore)[key] = value;
  };

  /*
   * There are use-cases such as selecting Tags from the sidebar menu items,
   * wherein we receive the selected id as the value to be stored or removed from the array
   */
  toggleFilterArrayValue = <K extends EventsFilterArrayKeys>(
    key: K,
    value: string
  ) => {
    const array = (this as EventsFilterStore)[key] as string[];

    if (array.includes(value)) {
      this[key] = array.filter((existingItem) => existingItem !== value);
    } else {
      this[key] = [...array, value];
    }
  };

  /*
   * There are use-cases such as selecting options from a Dropdown Multi-Select component (Event Categories, Location),
   * wherein we receive an array of selected id's to overwrite our array
   */
  setFilterArrayValues = <K extends EventsFilterArrayKeys>(
    key: K,
    values: string[]
  ) => {
    this[key] = [...values];
  };

  resetSelectedFilters = () => {
    this.keyword = '';
    this.typeId = null;
    this.listingId = null;
    this.dateFrom = null;
    this.dateTo = null;
    this.tagId = [];
    this.categoryId = [];
    this.locationId = [];
  };

  syncEventFiltersFromQuery = (params: CustomURLSearchParams) => {
    if (!params.toString() || location.pathname.endsWith('/all')) {
      this.resetSelectedFilters();
      return;
    }

    const startDate = params.get('startDate');
    const endDate = params.get('endDate');

    this.dateFrom = startDate ? dayjs(startDate) : null;
    this.dateTo = endDate ? dayjs(endDate) : null;

    this.typeId = params.get('type') || null;
    this.listingId = params.get('listing') || null;
    this.keyword = params.get('keyword') || '';

    this.tagId = params.get('tag')?.split(',') || [];
    this.categoryId = params.get('category')?.split(',') || [];
    this.locationId = params.get('location')?.split(',') || [];
  };

  get eventsQueryString() {
    return computed(() => {
      const params: CustomURLSearchParams = new URLSearchParams();

      const addParams = (
        key: EventsFilterQueryParamKeys,
        value: Dayjs | string | string[] | null | undefined
      ) => {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(','));
        } else if (typeof value === 'string' && value) {
          params.set(key, value);
        } else if (dayjs.isDayjs(value)) {
          params.set(key, value.format('YYYY-MM-DD'));
        }
      };

      addParams('category', this.categoryId);
      addParams('type', this.typeId);
      addParams('tag', this.tagId);
      addParams('location', this.locationId);
      addParams('startDate', this.dateFrom);
      addParams('endDate', this.dateTo);
      addParams('keyword', this.keyword);
      addParams('listing', this.listingId);

      return params.toString();
    }).get();
  }

  get isEmptyFilterItemChips(): boolean {
    const queryParams: CustomURLSearchParams = new URLSearchParams(
      this.eventsQueryString
    );
    const queryParamKeys = Array.from(
      queryParams.keys()
    ) as EventsFilterQueryParamKeys[];

    return (
      (queryParamKeys.length === 2 &&
        queryParamKeys.includes('startDate') &&
        queryParamKeys.includes('endDate')) ||
      (queryParamKeys.length === 1 && queryParamKeys.includes('keyword'))
    );
  }

  get categorySet() {
    return new Set(this.categoryId);
  }

  get tagSet() {
    return new Set(this.tagId);
  }

  get locationSet() {
    return new Set(this.locationId);
  }

  get payloadForFetchingEvents(): GetEventsListDto {
    return computed(() => {
      const addField = <T>(
        key: keyof GetEventsListDto,
        value: T | null | undefined
      ) => {
        if (
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return {};
        }
        return { [key]: value };
      };

      return {
        ...addField('startDateFrom', this.dateFrom?.utc().toISOString()),
        ...addField('startDateTo', this.dateTo?.utc().toISOString()),
        ...addField('keyword', this.keyword),
        ...addField('typeId', this.typeId),
        ...addField('locationId', this.locationId),
        ...addField('categoryId', this.categoryId),
        ...addField('tagId', this.tagId),
        ...addField('listing', this.listingId),
      };
    }).get();
  }
}
