import { action, makeObservable, observable } from 'mobx';
import { resourceApi } from 'src/transport/resources/resources.api';
import {
  GetItemsParams,
  GetSingleItemParams,
  ResourceTagDTO,
} from 'src/transport/resources/resources.dto';

export class ResourceTagStore {
  public isLoading: boolean = false;
  public tags: ResourceTagDTO[] | null = null;
  public selectedTag: ResourceTagDTO | null = null;
  public selectedTags: number[] = [];
  public error: string | null = null;

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      tags: observable,
      selectedTag: observable,
      selectedTags: observable,
      error: observable,
      setError: action,
      getTags: action,
      getTagById: action,
      handleTagsChange: action,
    });
  }

  setError(error: unknown): void {
    this.error =
      error instanceof Error ? error.message : 'An unknown error occurred';
  }

  getTags = async (params?: GetItemsParams): Promise<void> => {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await resourceApi.getResourceTags(params);
      this.tags = response.data;
    } catch (error: unknown) {
      this.setError(error);
    } finally {
      this.isLoading = false;
    }
  };

  getTagById = async (
    id: number,
    params?: GetSingleItemParams
  ): Promise<void> => {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await resourceApi.getResourceTagById(id, params);
      this.selectedTag = response.data;
    } catch (error: unknown) {
      this.setError(error);
    } finally {
      this.isLoading = false;
    }
  };

  handleTagsChange = (tag: number, checked: boolean): void => {
    this.selectedTags = checked
      ? [...(this.selectedTags || []), tag]
      : this.selectedTags?.filter((t) => t !== tag);
  };
}
