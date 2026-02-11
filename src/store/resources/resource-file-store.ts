import { action, makeObservable, observable } from 'mobx';
import { resourceApi } from 'src/transport/resources/resources.api';
import {
  GetItemsParams,
  GetSingleItemParams,
  ResourceFilesDTO,
} from 'src/transport/resources/resources.dto';

export class ResourceFileStore {
  @observable isLoading: boolean = false;
  @observable files: ResourceFilesDTO[] | null = null;
  @observable selectedFile: ResourceFilesDTO | null = null;
  @observable error: string | null = null;

  constructor() {
    makeObservable(this);
  }

  @action setError(error: unknown): void {
    this.error =
      error instanceof Error ? error.message : 'An unknown error occurred';
  }

  @action getFiles = async (params?: GetItemsParams): Promise<void> => {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await resourceApi.getResourceFilesList(params);
      this.files = response.data;
    } catch (error: unknown) {
      this.setError(error);
    } finally {
      this.isLoading = false;
    }
  };

  @action getFileById = async (
    id: number,
    params?: GetSingleItemParams
  ): Promise<void> => {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await resourceApi.getResourceFilesById(id, params);
      this.selectedFile = response.data;
    } catch (error: unknown) {
      this.setError(error);
    } finally {
      this.isLoading = false;
    }
  };
}
