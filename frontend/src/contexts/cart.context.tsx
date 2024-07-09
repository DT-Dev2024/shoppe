import React, { createContext, useEffect, useState } from "react";
import purchaseAPI from "src/apis/purchase.api";
import { TExtendedPurchases } from "src/types/purchase.type";

export interface AuthContextInterface {
  extendedPurchases: TExtendedPurchases[];
  setExtendedPurchases: React.Dispatch<React.SetStateAction<TExtendedPurchases[]>>;
}

const initialAuthContext: AuthContextInterface = {
  extendedPurchases: [],
  setExtendedPurchases: () => null,
};

export const CartContext = createContext<AuthContextInterface>(initialAuthContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [extendedPurchases, setExtendedPurchases] = useState<TExtendedPurchases[]>(
    initialAuthContext.extendedPurchases.length > 0 ? initialAuthContext.extendedPurchases : [],
  );

  useEffect(() => {
    const fetchExtendedPurchases = async () => {
      // fetch extended purchases
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.id === undefined) return;
      const response = await purchaseAPI.getCart(user.id);
      if (response.status === 200) {
        if (response.data) {
          setExtendedPurchases(response.data.cart_items || []);
        }
      }
    };

    fetchExtendedPurchases();
  }, []);

  return <CartContext.Provider value={{ extendedPurchases, setExtendedPurchases }}>{children}</CartContext.Provider>;
};
