import { TProductListConfig, TProductList, TProduct } from "src/types/product.type";
import { TSuccessApiResponse } from "src/types/utils.types";
import axiosClient from "./config";

const productApi = {
  getProducts: () => axiosClient.get("/product"),
  getProductById: (productId: string) => axiosClient.get(`/product/${productId}`),
};

export default productApi;
