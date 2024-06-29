import { TCheckout } from "src/types/purchase.type";
import axiosClient from "./config";

export interface Item {
  productId: string;
  buy_count: number;
}

export interface AddCart {
  userId: string;
  cartItems: Item[];
}

const purchaseAPI = {
  addToCart: (body: AddCart) => axiosClient.post("/order/add-to-cart", body),
  getCart: (userId: string) => axiosClient.get("/order/cart/" + userId),
  updateCart: (body: { productid: string; buy_count: number }) => axiosClient.put("/order/update-cart", body),
  deleteCart: (userId: string, productids: string[]) =>
    axiosClient.delete(`/order/delete-cart`, { data: { userId, productids } }),
  checkout: (body: TCheckout) => axiosClient.post("/order/checkout", body),
};

export default purchaseAPI;
