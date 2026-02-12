import {
  GetItemsParams,
  GetSingleItemParams,
  NewsCategoryDTO,
  NewsCategoryMappingDTO,
  NewsDTO,
  NewsListResponse,
  NewsSubcategoryDTO,
  NewsSubcategoryMappingDTO,
  NewsTagsDTO,
  NewsTagsMappingDTO,
} from './news.dto';
import { PaginationResponse } from 'src/transport/types.ts';

// --- Mock data: realistic private team news & resources ---
const MOCK_IMAGE = {
  id: 'mock-file-id',
  storage: 'local',
  filename_disk: 'placeholder.jpg',
  filename_download: 'placeholder.jpg',
  title: 'Placeholder',
  type: 'image/jpeg',
  folder: null,
  uploaded_by: 'mock-user',
  created_on: new Date().toISOString(),
  modified_by: null,
  modified_on: new Date().toISOString(),
  charset: null,
  filesize: '0',
  width: 400,
  height: 300,
  duration: null,
  embed: null,
  description: null,
  location: null,
  tags: null,
  metadata: {},
  focal_point_x: null,
  focal_point_y: null,
  tus_id: null,
  tus_data: null,
  uploaded_on: new Date().toISOString(),
};

const mockNewsList: NewsDTO[] = [
  {
    id: 'news-1',
    status: 'published',
    dateCreated: '2025-01-15T10:00:00Z',
    dateUpdated: '2025-02-01T14:00:00Z',
    name: 'Updated remote work policy',
    shortDescription:
      'Effective March 1: hybrid schedule, equipment allowance, and home office guidelines for the team.',
    publishStartDate: '2025-01-15',
    publishEndDate: '2025-12-31',
    membersOnly: true,
    private: true,
    content: 'Full policy details and FAQs for remote work.',
    categories: [],
    tags: [],
    subcategories: [],
    images: [{ directusFilesId: MOCK_IMAGE }],
  },
  {
    id: 'news-2',
    status: 'published',
    dateCreated: '2025-01-20T09:00:00Z',
    dateUpdated: '2025-01-20T09:00:00Z',
    name: 'Q4 planning recap and key dates',
    shortDescription:
      'Summary of OKRs, roadmap highlights, and important deadlines for the quarter.',
    publishStartDate: '2025-01-20',
    membersOnly: true,
    private: true,
    content: 'Planning deck and timeline attached.',
    categories: [],
    tags: [],
    subcategories: [],
    images: [{ directusFilesId: MOCK_IMAGE }],
  },
  {
    id: 'news-3',
    status: 'published',
    dateCreated: '2025-02-01T11:00:00Z',
    dateUpdated: '2025-02-01T11:00:00Z',
    name: 'VPN and SSO setup guide',
    shortDescription:
      'Step-by-step instructions for new joiners: VPN, SSO, and MFA enrollment.',
    publishStartDate: '2025-02-01',
    membersOnly: true,
    private: true,
    content: '<p>IT setup guide and troubleshooting.</p>',
    categories: [],
    tags: [],
    subcategories: [],
    images: [{ directusFilesId: MOCK_IMAGE }],
  },
  {
    id: 'news-4',
    status: 'published',
    dateCreated: '2025-02-05T08:00:00Z',
    dateUpdated: '2025-02-05T08:00:00Z',
    name: 'Annual compliance training now available',
    shortDescription:
      'Mandatory training must be completed by March 15. Link and instructions inside.',
    publishStartDate: '2025-02-05',
    membersOnly: true,
    private: true,
    content: 'Compliance training portal and FAQ.',
    categories: [],
    tags: [],
    subcategories: [],
    images: [{ directusFilesId: MOCK_IMAGE }],
  },
  {
    id: 'news-5',
    status: 'published',
    dateCreated: '2025-02-10T16:00:00Z',
    dateUpdated: '2025-02-10T16:00:00Z',
    name: 'Expense and travel policy changes',
    shortDescription:
      'Updated per diem rates, approval thresholds, and preferred vendors from April 1.',
    publishStartDate: '2025-02-10',
    membersOnly: true,
    private: true,
    content: 'Finance policy update summary.',
    categories: [],
    tags: [],
    subcategories: [],
    images: [{ directusFilesId: MOCK_IMAGE }],
  },
];

const mockCategories: NewsCategoryDTO[] = [
  { id: 1, label: 'Internal' },
  { id: 2, label: 'Policies' },
  { id: 3, label: 'How-to' },
  { id: 4, label: 'Security & compliance' },
];

const mockSubcategories: NewsSubcategoryDTO[] = [
  { id: 'sub-1' as const, name: 'Team updates', news_category_id: 1 },
  { id: 'sub-2' as const, name: 'HR', news_category_id: 2 },
  { id: 'sub-3' as const, name: 'IT', news_category_id: 3 },
];

const mockTags: NewsTagsDTO[] = [
  { id: 1, label: 'mandatory' },
  { id: 2, label: 'new joiners' },
  { id: 3, label: 'policy' },
];

const mockCategoryMappings: NewsCategoryMappingDTO[] = [
  { id: 1, news_id: 'news-1', category_id: 2 },
  { id: 2, news_id: 'news-2', category_id: 1 },
  { id: 3, news_id: 'news-3', category_id: 3 },
  { id: 4, news_id: 'news-4', category_id: 4 },
  { id: 5, news_id: 'news-5', category_id: 2 },
];

const mockSubcategoryMappings: NewsSubcategoryMappingDTO[] = [
  { id: 1, news_id: 'news-1', news_subcategory_id: 'sub-2' },
  { id: 2, news_id: 'news-2', news_subcategory_id: 'sub-1' },
  { id: 3, news_id: 'news-3', news_subcategory_id: 'sub-3' },
];

const mockTagsMappings: NewsTagsMappingDTO[] = [
  { id: 1, news_id: 'news-1', news_tags_id: 3 },
  { id: 2, news_id: 'news-4', news_tags_id: 1 },
  { id: 3, news_id: 'news-3', news_tags_id: 2 },
];

function applyPagination<T>(arr: T[], params?: GetItemsParams): T[] {
  if (!params) return arr;
  const limit = params.limit ?? arr.length;
  const offset = params.offset ?? 0;
  const page = params.page;
  if (page != null && params.limit != null) {
    return arr.slice((page - 1) * limit, page * limit);
  }
  return arr.slice(offset, offset + limit);
}

export const newsApi = {
  getNewsList<T = NewsDTO>(
    params?: GetItemsParams
  ): Promise<NewsListResponse<T>> {
    const data = applyPagination(mockNewsList, params) as T[];
    return Promise.resolve({
      data,
      meta: { totalCount: mockNewsList.length, filterCount: data.length },
    });
  },

  getNewsDetails(
    id: string,
    _params?: GetSingleItemParams
  ): Promise<{ data: NewsDTO }> {
    const item = mockNewsList.find((n) => n.id === id) ?? mockNewsList[0];
    return Promise.resolve({ data: { ...item, id: item.id } });
  },

  getNewsByIds(ids: string[]): Promise<NewsListResponse<NewsDTO>> {
    const data = mockNewsList.filter((n) => ids.includes(n.id));
    return Promise.resolve({
      data,
      meta: { totalCount: data.length, filterCount: data.length },
    });
  },

  getNewsTags(_params?: GetItemsParams): Promise<{ data: NewsTagsDTO[] }> {
    return Promise.resolve({ data: mockTags });
  },

  getNewsTag(
    id: string,
    _params?: GetSingleItemParams
  ): Promise<NewsTagsDTO> {
    const tag = mockTags.find((t) => String(t.id) === id) ?? mockTags[0];
    return Promise.resolve(tag);
  },

  getNewsTagsMapping(_params?: GetItemsParams): Promise<NewsTagsMappingDTO> {
    return Promise.resolve(mockTagsMappings[0]);
  },

  getNewsTagsMappingById(
    id: string,
    _params?: GetSingleItemParams
  ): Promise<{ data: NewsTagsMappingDTO }> {
    const mapping =
      mockTagsMappings.find((m) => String(m.id) === id) ?? mockTagsMappings[0];
    return Promise.resolve({ data: mapping });
  },

  getNewsCategories(
    _params?: GetItemsParams
  ): Promise<{ data: NewsCategoryDTO[] }> {
    return Promise.resolve({ data: mockCategories });
  },

  getNewsCategoryById(
    id: string,
    _params?: GetSingleItemParams
  ): Promise<{ data: NewsCategoryDTO }> {
    const cat =
      mockCategories.find((c) => String(c.id) === id) ?? mockCategories[0];
    return Promise.resolve({ data: cat });
  },

  getNewsCategoryMappingList(
    params?: GetItemsParams
  ): Promise<NewsCategoryMappingDTO[]> {
    const list = applyPagination(mockCategoryMappings, params);
    return Promise.resolve(list);
  },

  getNewsCategoryMappingById(
    id: string,
    _params?: GetSingleItemParams
  ): Promise<NewsCategoryMappingDTO> {
    const mapping =
      mockCategoryMappings.find((m) => String(m.id) === id) ??
      mockCategoryMappings[0];
    return Promise.resolve(mapping);
  },

  getNewsSubcategories(
    params?: GetItemsParams
  ): Promise<NewsSubcategoryDTO[]> {
    return Promise.resolve(applyPagination(mockSubcategories, params));
  },

  getNewsSubcategoryById(
    id: string,
    _params?: GetSingleItemParams
  ): Promise<NewsSubcategoryDTO> {
    const sub =
      mockSubcategories.find((s) => s.id === id) ?? mockSubcategories[0];
    return Promise.resolve(sub);
  },

  getNewsSubcategoryMappingList(
    params?: GetItemsParams
  ): Promise<NewsSubcategoryMappingDTO[]> {
    return Promise.resolve(
      applyPagination(mockSubcategoryMappings, params)
    );
  },

  getNewsSubcategoryMappingById(
    id: string,
    _params?: GetSingleItemParams
  ): Promise<NewsSubcategoryMappingDTO> {
    const mapping =
      mockSubcategoryMappings.find((m) => String(m.id) === id) ??
      mockSubcategoryMappings[0];
    return Promise.resolve(mapping);
  },

  async getFavoriteNewsIds(
    page: number = 1,
    pageSize = 1000
  ): Promise<PaginationResponse<{ favoriteNewsIds: Array<string> }>> {
    const favoriteNewsIds = [mockNewsList[0].id, mockNewsList[2].id];
    return Promise.resolve({
      favoriteNewsIds,
      args: { page, pageSize },
      totalItemCount: favoriteNewsIds.length,
    });
  },

  async addNewsToFavorite(_newsId: string) {
    return Promise.resolve({});
  },

  async removeNewsFromFavorite(_newsId: string) {
    return Promise.resolve({});
  },
};
