export type PaginationResponse<T> = T & {
  args: {
    page: number;
    pageSize: number;
  };
  totalItemCount: number;
};

export type PaginationParams<T = {}> = T & {
  page?: number;
  pageSize?: number;
};
