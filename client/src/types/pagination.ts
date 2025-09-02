export type Pagination = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  metadata: Pagination;
  items: T[];
};
