import { TProduct } from "./product.type";
import { TAddress } from "./user.types";

export type TPurchaseListStatus = TOrderStatus | "ALL";

export type TOrderStatus = "CANCELED" | "WAITING" | "DELIVERING" | "WAIT_RECEIVED" | "DELIVERED" | "RETURN";

export type TPurchase = {
  id: string;
  buy_count: number;
  price: number;
  price_before_discount: number;
  status: TOrderStatus;
  product: TProduct;
  createdAt: string;
  updatedAt: string;
};

export type TExtendedPurchases = {
  disabled: boolean;
  checked: boolean;
} & TPurchase;

export type TVoucherType = "SHOP" | "USER";
export type TDiscountType = "PERCENTAGE" | "FIXED";

export type TVoucher = {
  id: string;
  type: TVoucherType;
  code: string;
  discount: number;
  discount_type: TDiscountType;
  minium_price: number;
  maxium_discount?: number;
  expire: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type TCheckout = {
  totalPrice: number;
  userId: string;
  orderDetails: {
    productId: string;
    buy_count: number;
    status: TOrderStatus;
    price: number;
    price_before_discount: number;
  }[];
  voucherId: string;
  addressId: string;
  paymentMethod: string;
};
