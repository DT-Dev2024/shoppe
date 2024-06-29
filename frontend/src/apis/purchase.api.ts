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

export interface UpdateItem {
  userId: string;
  cartItem: {
    productId: string;
    buy_count: number;
  };
}

const purchaseAPI = {
  addToCart: (body: AddCart) => axiosClient.post("/order/add-to-cart", body),
  getCart: (userId: string) => axiosClient.get("/order/cart/" + userId),
  updateCart: (body: UpdateItem) => axiosClient.post("/order/update-cart", body),
  deleteCart: (userId: string, productIds: string[]) =>
    axiosClient.delete(`/order/delete-cart`, { data: { userId, productIds } }),
  checkout: (body: TCheckout) => axiosClient.post("/order/checkout", body),
};

export default purchaseAPI;
