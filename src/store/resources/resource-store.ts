import { action, makeObservable, observable } from 'mobx';
import { GetSingleItemParams as _GetSingleItemParams } from 'src/transport/news/news.dto';
import { resourceApi } from 'src/transport/resources/resources.api';
import {
  GetItemsParams,
  ResourceDTO,
} from 'src/transport/resources/resources.dto';

export class ResourceStore {
  public isLoading: boolean = false;
  public isResourceFavoriteIdsLoading: boolean = false;
  public resources: ResourceDTO[] | null = null;
  public favoriteResourceIds: string[] | null = null;
  public selectedResource: ResourceDTO | null = null;
  public error: string | null = null;

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      isResourceFavoriteIdsLoading: observable,
      resources: observable,
      selectedResource: observable,
      error: observable,
      setError: action,
      getResourceList: action,
      getResourceDetails: action,
      getFavoriteResourceIds: action,
    });
  }

  setError(error: unknown): void {
    this.error =
      error instanceof Error ? error.message : 'An unknown error occurred';
  }

  getResourceList = async (params?: GetItemsParams): Promise<void> => {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await resourceApi.getResourceList(params);
      this.resources = response.data;
    } catch (error: unknown) {
      this.setError(error);
    } finally {
      this.isLoading = false;
    }
  };

  getResourceDetails = async (
    id: string,
    params?: _GetSingleItemParams
  ): Promise<void> => {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await resourceApi.getResourceDetails(id, params);
      this.selectedResource = response.data;
    } catch (error: unknown) {
      this.setError(error);
    } finally {
      this.isLoading = false;
    }
  };

  getFavoriteResourceIds = async (): Promise<void> => {
    this.isResourceFavoriteIdsLoading = true;
    this.error = null;
    try {
      const response = await resourceApi.getFavoriteResourceIds();

      this.favoriteResourceIds = response.favoriteResourcesIds;
    } catch (error: unknown) {
      this.setError(error);
    } finally {
      this.isResourceFavoriteIdsLoading = false;
    }
  };
}
