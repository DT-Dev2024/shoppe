import { TCategory } from "src/types/category.type";
import { TSuccessApiResponse } from "src/types/utils.types";
import axiosClient from "./config";

const categoryApi = {
  getCategories: () => axiosClient.get<TSuccessApiResponse<TCategory[]>>("/categories"),
};

export default categoryApi;
