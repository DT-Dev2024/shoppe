export type TProduct = {
  id: string;
  images: string[];
  price: number;
  rating: number;
  price_before_discount: number;
  quantity: number;
  sale_price: number;
  sold: number;
  view: number;
  detailImage: string[];
  name: string;
  description: string;
  keyword: string;
  product_feeback: TProductFeedback;
  category: {
    id: string;
    name: string;
  };
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type TProductFeedback = {
  id: string;
  star: number;
  comment: string;
  sold: number;
  productId: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

export type TProductList = {
  products: TProduct[];
  pagination: {
    page: number;
    limit: number;
    page_size: number;
  };
};

export type TProductListConfig = {
  page?: number | string;
  limit?: number | string;
  sort_by?: "createdAt" | "view" | "sold" | "price";
  order?: "asc" | "desc";
  exclude?: string;
  rating_filter?: number | string;
  price_max?: number | string;
  price_min?: number | string;
  name?: string;
  category?: string;
};
