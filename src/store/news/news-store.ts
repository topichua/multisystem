import { action, makeObservable, observable } from 'mobx';

import { newsApi } from 'src/transport/news/news.api';
import {
  GetItemsParams,
  GetSingleItemParams,
  NewsCategoryDTO,
  NewsCategoryMappingDTO,
  NewsDTO,
  NewsSubcategoryDTO,
  NewsSubcategoryMappingDTO,
  NewsTagsDTO,
  NewsTagsMappingDTO,
} from 'src/transport/news/news.dto';

type ErrorFields = {
  newsError: string | null;
  favoriteNewsIdsError: string | null;
  favoriteNewsError: string | null;
  newsTagsError: string | null;
  newsCategoriesError: string | null;
  newsSubcategoriesError: string | null;
  newsTagsMappingError: string | null;
  newsCategoryMappingError: string | null;
  newsSubcategoryMappingError: string | null;
};

export class NewsStore {
  public isNewsLoading: boolean = false;
  public isFavoriteNewsIdsLoading: boolean = false;
  public isNewsTagsLoading: boolean = false;
  public isNewsCategoriesLoading: boolean = false;
  public isNewsSubcategoriesLoading: boolean = false;
  public isNewsTagsMappingLoading: boolean = false;
  public isNewsCategoryMappingLoading: boolean = false;
  public isNewsSubcategoryMappingLoading: boolean = false;

  public news: NewsDTO[] | null = null;
  public favoriteNewsIds: string[] | null = null;
  public newsTags: NewsTagsDTO[] | null = null;
  public newsCategories: NewsCategoryDTO[] | null = null;
  public newsSubcategories: NewsSubcategoryDTO[] | null = null;
  public newsTagsMapping: NewsTagsMappingDTO | null = null;
  public newsCategoryMappings: NewsCategoryMappingDTO[] | null = null;
  public newsSubcategoryMappings: NewsSubcategoryMappingDTO[] | null = null;

  public selectedNewsItem: NewsDTO | null = null;
  public selectedNewsTag: NewsTagsDTO | null = null;
  public selectedTags: number[] = [];
  public isOnlySaved: boolean = false;
  public selectedNewsCategory: NewsCategoryDTO | null = null;
  public selectedNewsSubcategory: NewsSubcategoryDTO | null = null;
  public selectedNewsTagMapping: NewsTagsMappingDTO | null = null;
  public selectedNewsCategoryMapping: NewsCategoryMappingDTO | null = null;
  public selectedNewsSubcategoryMapping: NewsSubcategoryMappingDTO | null =
    null;

  public newsError: string | null = null;
  public favoriteNewsIdsError: string | null = null;
  public favoriteNewsError: string | null = null;
  public newsTagsError: string | null = null;
  public newsCategoriesError: string | null = null;
  public newsSubcategoriesError: string | null = null;
  public newsTagsMappingError: string | null = null;
  public newsCategoryMappingError: string | null = null;
  public newsSubcategoryMappingError: string | null = null;

  public searchKeyword: string = '';

  constructor() {
    makeObservable(this, {
      isNewsLoading: observable,
      isFavoriteNewsIdsLoading: observable,
      isNewsTagsLoading: observable,
      isNewsCategoriesLoading: observable,
      isNewsSubcategoriesLoading: observable,
      isNewsTagsMappingLoading: observable,
      isNewsCategoryMappingLoading: observable,
      isNewsSubcategoryMappingLoading: observable,
      news: observable,
      favoriteNewsIds: observable,
      newsTags: observable,
      newsCategories: observable,
      newsSubcategories: observable,
      newsTagsMapping: observable,
      newsCategoryMappings: observable,
      newsSubcategoryMappings: observable,
      selectedNewsItem: observable,
      selectedNewsTag: observable,
      selectedTags: observable,
      selectedNewsCategory: observable,
      selectedNewsSubcategory: observable,
      selectedNewsTagMapping: observable,
      selectedNewsCategoryMapping: observable,
      selectedNewsSubcategoryMapping: observable,
      newsError: observable,
      newsTagsError: observable,
      newsCategoriesError: observable,
      newsSubcategoriesError: observable,
      newsTagsMappingError: observable,
      newsCategoryMappingError: observable,
      newsSubcategoryMappingError: observable,
      isOnlySaved: observable,
      searchKeyword: observable,
      getNewsList: action,
      getNewsDetails: action,
      getNewsTags: action,
      getNewsTag: action,
      getNewsCategories: action,
      getNewsCategoryById: action,
      getNewsSubcategories: action,
      getNewsSubcategoryById: action,
      getNewsTagsMapping: action,
      getNewsTagsMappingById: action,
      getNewsCategoryMappingList: action,
      getNewsCategoryMappingById: action,
      getNewsSubcategoryMappingList: action,
      getNewsSubcategoryMappingById: action,
      getFavoriteNewsIds: action,
      handleTagsChange: action,
      toggleIsOnlySaved: action,
      updateKeyword: action,
    });
  }

  setError(error: unknown, errorField: keyof ErrorFields): void {
    if (error instanceof Error) {
      this[errorField] = error.message || 'An unknown error occurred';
    } else {
      this[errorField] = 'An unknown error occurred';
    }
  }

  getNewsList = async (params?: GetItemsParams): Promise<void> => {
    this.isNewsLoading = true;
    this.newsError = null;
    try {
      const response = await newsApi.getNewsList(params);
      this.news = response?.data;
    } catch (error: unknown) {
      this.setError(error, 'newsError');
    } finally {
      this.isNewsLoading = false;
    }
  };

  getNewsDetails = async (
    id: string,
    params?: GetSingleItemParams
  ): Promise<void> => {
    this.isNewsLoading = true;
    this.newsError = null;
    try {
      const response = await newsApi.getNewsDetails(id, params);
      this.selectedNewsItem = response?.data;
    } catch (error: unknown) {
      this.setError(error, 'newsError');
    } finally {
      this.isNewsLoading = false;
    }
  };

  getNewsTags = async (params?: GetItemsParams): Promise<void> => {
    this.isNewsTagsLoading = true;
    this.newsTagsError = null;
    try {
      const response = await newsApi.getNewsTags(params);
      this.newsTags = response?.data;
    } catch (error: unknown) {
      this.setError(error, 'newsTagsError');
    } finally {
      this.isNewsTagsLoading = false;
    }
  };

  getNewsTag = async (
    id: string,
    params?: GetSingleItemParams
  ): Promise<void> => {
    this.isNewsTagsLoading = true;
    this.newsTagsError = null;
    try {
      this.selectedNewsTag = await newsApi.getNewsTag(id, params);
    } catch (error: unknown) {
      this.setError(error, 'newsTagsError');
    } finally {
      this.isNewsTagsLoading = false;
    }
  };

  handleTagsChange = (tag: number, checked: boolean): void => {
    this.selectedTags = checked
      ? [...(this.selectedTags || []), tag]
      : this.selectedTags?.filter((t) => t !== tag);
  };

  getNewsCategories = async (params?: GetItemsParams): Promise<void> => {
    this.isNewsCategoriesLoading = true;
    this.newsCategoriesError = null;
    try {
      const response = await newsApi.getNewsCategories(params);

      this.newsCategories = response?.data;
    } catch (error: unknown) {
      this.setError(error, 'newsCategoriesError');
    } finally {
      this.isNewsCategoriesLoading = false;
    }
  };

  getNewsCategoryById = async (
    id: string,
    params?: GetSingleItemParams
  ): Promise<void> => {
    this.isNewsCategoriesLoading = true;
    this.newsCategoriesError = null;
    try {
      const response = await newsApi.getNewsCategoryById(id, params);

      this.selectedNewsCategory = response?.data;
    } catch (error: unknown) {
      this.setError(error, 'newsCategoriesError');
    } finally {
      this.isNewsCategoriesLoading = false;
    }
  };

  getNewsSubcategories = async (params?: GetItemsParams): Promise<void> => {
    this.isNewsSubcategoriesLoading = true;
    this.newsSubcategoriesError = null;
    try {
      this.newsSubcategories = await newsApi.getNewsSubcategories(params);
    } catch (error: unknown) {
      this.setError(error, 'newsSubcategoriesError');
    } finally {
      this.isNewsSubcategoriesLoading = false;
    }
  };

  getNewsSubcategoryById = async (
    id: string,
    params?: GetSingleItemParams
  ): Promise<void> => {
    this.isNewsSubcategoriesLoading = true;
    this.newsSubcategoriesError = null;
    try {
      this.selectedNewsSubcategory = await newsApi.getNewsSubcategoryById(
        id,
        params
      );
    } catch (error: unknown) {
      this.setError(error, 'newsSubcategoriesError');
    } finally {
      this.isNewsSubcategoriesLoading = false;
    }
  };

  getNewsTagsMapping = async (params?: GetItemsParams): Promise<void> => {
    this.isNewsTagsMappingLoading = true;
    this.newsTagsMappingError = null;
    try {
      this.newsTagsMapping = await newsApi.getNewsTagsMapping(params);
    } catch (error: unknown) {
      this.setError(error, 'newsTagsMappingError');
    } finally {
      this.isNewsTagsMappingLoading = false;
    }
  };

  getNewsTagsMappingById = async (
    id: string,
    params?: GetSingleItemParams
  ): Promise<void> => {
    this.isNewsTagsMappingLoading = true;
    this.newsTagsMappingError = null;
    try {
      const response = await newsApi.getNewsTagsMappingById(id, params);

      this.selectedNewsTagMapping = response.data;
    } catch (error: unknown) {
      this.setError(error, 'newsTagsMappingError');
    } finally {
      this.isNewsTagsMappingLoading = false;
    }
  };

  getNewsCategoryMappingList = async (
    params?: GetItemsParams
  ): Promise<void> => {
    this.isNewsCategoryMappingLoading = true;
    this.newsCategoryMappingError = null;
    try {
      this.newsCategoryMappings =
        await newsApi.getNewsCategoryMappingList(params);
    } catch (error: unknown) {
      this.setError(error, 'newsCategoryMappingError');
    } finally {
      this.isNewsCategoryMappingLoading = false;
    }
  };

  getNewsCategoryMappingById = async (
    id: string,
    params?: GetSingleItemParams
  ): Promise<void> => {
    this.isNewsCategoryMappingLoading = true;
    this.newsCategoryMappingError = null;
    try {
      this.selectedNewsCategoryMapping =
        await newsApi.getNewsCategoryMappingById(id, params);
    } catch (error: unknown) {
      this.setError(error, 'newsCategoryMappingError');
    } finally {
      this.isNewsCategoryMappingLoading = false;
    }
  };

  getNewsSubcategoryMappingList = async (
    params?: GetItemsParams
  ): Promise<void> => {
    this.isNewsSubcategoryMappingLoading = true;
    this.newsSubcategoryMappingError = null;
    try {
      this.newsSubcategoryMappings =
        await newsApi.getNewsSubcategoryMappingList(params);
    } catch (error: unknown) {
      this.setError(error, 'newsSubcategoryMappingError');
    } finally {
      this.isNewsSubcategoryMappingLoading = false;
    }
  };

  getNewsSubcategoryMappingById = async (
    id: string,
    params?: GetSingleItemParams
  ): Promise<void> => {
    this.isNewsSubcategoryMappingLoading = true;
    this.newsSubcategoryMappingError = null;
    try {
      this.selectedNewsSubcategoryMapping =
        await newsApi.getNewsSubcategoryMappingById(id, params);
    } catch (error: unknown) {
      this.setError(error, 'newsSubcategoryMappingError');
    } finally {
      this.isNewsSubcategoryMappingLoading = false;
    }
  };

  getFavoriteNewsIds = async (): Promise<void> => {
    this.isFavoriteNewsIdsLoading = true;
    this.favoriteNewsIdsError = null;
    try {
      const response = await newsApi.getFavoriteNewsIds();

      this.favoriteNewsIds = response.favoriteNewsIds;
    } catch (error: unknown) {
      this.setError(error, 'favoriteNewsIdsError');
    } finally {
      this.isFavoriteNewsIdsLoading = false;
    }
  };

  toggleIsOnlySaved = (): void => {
    this.isOnlySaved = !this.isOnlySaved;
  };

  updateKeyword = (keyWord: string): void => {
    this.searchKeyword = keyWord;
  };
}
