import { TProductListConfig, TProductList, TProduct } from "src/types/product.type";
import { TSuccessApiResponse } from "src/types/utils.types";
import axiosClient from "./config";

const productApi = {
  getProducts: async (keyword?: string) => {
    let path = "/product";
    if (keyword) {
      path += `?keyword=${keyword}`;
    }
    const rs = await axiosClient.get<TProduct[]>(path);
    return rs;
  },
  getProductById: (productId: string) => axiosClient.get(`/product/${productId}`),
};

export default productApi;
