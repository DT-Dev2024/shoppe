export type PaginationOptions = {
  /**
   * the amount of items to be requested per page
   */
  limit?: number;
  /**
   * the page that is requested
   */
  page?: number;
};

export type Pagination = {
  /**
   * the amount of items on this specific page
   */
  amount_this_page: number;
  /**
   * the total amount of items
   */
  total: number;
  /**
   * the amount of items that were requested per page
   */
  amount_per_page: number;
  /**
   * the total amount of pages in this paginator
   */
  total_pages: number;
  /**
   * the current page this paginator "points" to
   */
  current_page: number;
};
