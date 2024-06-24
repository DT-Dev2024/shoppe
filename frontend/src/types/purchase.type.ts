import { TProduct } from "./product.type";

export type TPurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5;
export type TPurchaseListStatus = TPurchaseStatus | 0;

export type TPurchase = {
  _id: string;
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
  _id: string;
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
