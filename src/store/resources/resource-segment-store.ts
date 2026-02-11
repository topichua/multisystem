import { action, makeObservable, observable } from 'mobx';
import { resourceApi } from 'src/transport/resources/resources.api';
import {
  GetItemsParams,
  GetSingleItemParams,
  ResourceSegmentDTO,
} from 'src/transport/resources/resources.dto';

export class ResourceSegmentStore {
  @observable isLoading: boolean = false;
  @observable segments: ResourceSegmentDTO[] | null = null;
  @observable selectedSegment: ResourceSegmentDTO | null = null;
  @observable error: string | null = null;

  constructor() {
    makeObservable(this);
  }

  @action setError(error: unknown): void {
    this.error =
      error instanceof Error ? error.message : 'An unknown error occurred';
  }

  @action getSegments = async (params?: GetItemsParams): Promise<void> => {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await resourceApi.getResourceSegments(params);
      this.segments = response.data;
    } catch (error: unknown) {
      this.setError(error);
    } finally {
      this.isLoading = false;
    }
  };

  @action getSegmentById = async (
    id: string,
    params?: GetSingleItemParams
  ): Promise<void> => {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await resourceApi.getResourceSegmentById(id, params);
      this.selectedSegment = response.data;
    } catch (error: unknown) {
      this.setError(error);
    } finally {
      this.isLoading = false;
    }
  };
}
