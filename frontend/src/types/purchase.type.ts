import { TProduct } from "./product.type";
import { TAddress } from "./user.types";

export type TPurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5;
export type TPurchaseListStatus = TPurchaseStatus | 0;

export type TPurchase = {
  id: string;
  buy_count: number;
  price: number;
  price_before_discount: number;
  status: TPurchaseStatus;
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
  orders: TExtendedPurchases[];
  address: TAddress;
  payment_method: string;
};
