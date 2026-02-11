import { action, makeObservable, observable } from 'mobx';
import { GetSingleItemParams as _GetSingleItemParams } from 'src/transport/news/news.dto';
import { resourceApi } from 'src/transport/resources/resources.api';
import {
  GetItemsParams,
  ResourceCategoryDTO,
} from 'src/transport/resources/resources.dto';

export class ResourceCategoryStore {
  public isLoading: boolean = false;
  public categories: ResourceCategoryDTO[] | null = null;
  public selectedCategory: ResourceCategoryDTO | null = null;
  public error: string | null = null;
  public isOnlySaved: boolean = false;
  public searchKeyword: string = '';

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      categories: observable,
      selectedCategory: observable,
      error: observable,
      isOnlySaved: observable,
      searchKeyword: observable,
      setError: action,
      getCategories: action,
      getCategoryById: action,
      toggleIsOnlySaved: action,
      updateKeyword: action,
    });
  }
  setError(error: unknown): void {
    this.error =
      error instanceof Error ? error.message : 'An unknown error occurred';
  }

  getCategories = async (params?: GetItemsParams): Promise<void> => {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await resourceApi.getResourceCategories(params);
      this.categories = response.data;
    } catch (error: unknown) {
      this.setError(error);
    } finally {
      this.isLoading = false;
    }
  };

  getCategoryById = async (
    id: string,
    params?: _GetSingleItemParams
  ): Promise<void> => {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await resourceApi.getResourceCategoryById(id, params);
      this.selectedCategory = response.data;
    } catch (error: unknown) {
      this.setError(error);
    } finally {
      this.isLoading = false;
    }
  };

  toggleIsOnlySaved = (): void => {
    this.isOnlySaved = !this.isOnlySaved;
  };

  updateKeyword = (keyWord: string): void => {
    this.searchKeyword = keyWord;
  };
}
