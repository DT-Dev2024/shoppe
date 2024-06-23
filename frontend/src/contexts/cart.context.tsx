import React, { createContext, useState } from "react";
import { TExtendedPurchases, TPurchaseStatus } from "src/types/purchase.type";

interface AuthContextInterface {
  extendedPurchases: TExtendedPurchases[];
  setExtendedPurchases: React.Dispatch<React.SetStateAction<TExtendedPurchases[]>>;
}

const initialAuthContext: AuthContextInterface = {
  extendedPurchases: [],
  setExtendedPurchases: () => null,
};

const orders: TExtendedPurchases[] = [
  {
    disabled: false,
    checked: false,
    buy_count: 1,
    createdAt: "2022-02-22T07:00:00.000Z",
    price: 150000,
    _id: "1",
    price_before_discount: 200000,
    status: 1 as TPurchaseStatus,
    updatedAt: "2022-02-22T07:00:00.000Z",

    product: {
      _id: "1",
      name: "Set quà tặng Valentine dành cho bạn gái, quà sinh nhật nước hoa, son tone hồng đáng yêu",
      price: 150000,
      price_before_discount: 200000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
      quantity: 10,
      category: {
        _id: "1",
        name: "Gift",
      },
      rating: 4,
      sold: 10,
      view: 10,
      description: "description",
      images: [],
      createdAt: "2022-02-22T07:00:00.000Z",
      updatedAt: "2022-02-22T07:00:00.000Z",
    },
  },

  {
    disabled: false,
    checked: false,
    buy_count: 1,
    createdAt: "2022-02-22T07:00:00.000Z",
    price: 200000,
    _id: "3",
    price_before_discount: 250000,
    status: 1 as TPurchaseStatus,
    updatedAt: "2022-02-22T07:00:00.000Z",

    product: {
      _id: "3",
      name: "Nước hoa Nữ Rosalise by Noison EDP | Hương thơm hoa diên vĩ và hoa nhài, quý phái sang trọng",
      price: 200000,
      price_before_discount: 250000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
      quantity: 10,
      category: {
        _id: "1",
        name: "Gift",
      },
      rating: 4,
      sold: 10,
      view: 10,
      description: "description",
      images: [],
      createdAt: "2022-02-22T07:00:00.000Z",
      updatedAt: "2022-02-22T07:00:00.000Z",
    },
  },
];

export const CartContext = createContext<AuthContextInterface>(initialAuthContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [extendedPurchases, setExtendedPurchases] = useState<TExtendedPurchases[]>(
    initialAuthContext.extendedPurchases.length > 0 ? initialAuthContext.extendedPurchases : orders,
  );

  return <CartContext.Provider value={{ extendedPurchases, setExtendedPurchases }}>{children}</CartContext.Provider>;
};
