import { TProductListConfig, TProductList, TProduct } from "src/types/product.type";
import { TSuccessApiResponse } from "src/types/utils.types";
import axiosClient from "./config";

const productApi = {
  getProducts: (params: TProductListConfig) =>
    axiosClient.get<TSuccessApiResponse<TProductList>>("/products", {
      params,
    }),
  getProductById: (productId: string) => axiosClient.get<TSuccessApiResponse<TProduct>>(`/products/${productId}`),
};

export default productApi;
