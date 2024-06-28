import { TPurchaseListStatus, TPurchase, TCheckout } from "src/types/purchase.type";
import { TSuccessApiResponse } from "src/types/utils.types";
import axiosClient from "./config";

const purchaseAPI = {
  addToCart: (body: { productid: string; buy_count: number }) => axiosClient.post("/order/add-to-cart", body),
  getCart: () => axiosClient.get("/order"),
  updateCart: (body: { purchaseid: string; buy_count: number }) => axiosClient.put("/order/update-cart", body),
  deleteCart: (purchaseids: string[]) => axiosClient.delete(`/order/delete-cart`, { data: { purchaseids } }),
  checkout: (body: TCheckout) => axiosClient.post("/order/checkout", body),
};

export default purchaseAPI;
