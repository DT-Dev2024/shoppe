import { createContext, useEffect, useState } from "react";
import purchaseAPI from "src/apis/purchase.api";
import { TOrderHisotry } from "src/types/order.type";

interface OrderContextInterface {
  order: TOrderHisotry[];
  setOrder: React.Dispatch<React.SetStateAction<TOrderHisotry[]>>;
}

const initialOrderContext: OrderContextInterface = {
  order: [],
  setOrder: () => null,
};

export const OrderContext = createContext<OrderContextInterface>(initialOrderContext);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [order, setOrder] = useState<TOrderHisotry[]>([]);
  useEffect(() => {
    const fetchExtendedPurchases = async () => {
      // fetch extended purchases
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const response = await purchaseAPI.getCart(user.id);
      console.log("response", response.data);
      if (response.status === 200) {
        setOrder(response.data ?? []);
      }
    };

    fetchExtendedPurchases();
  }, []);
  return <OrderContext.Provider value={{ order, setOrder }}>{children}</OrderContext.Provider>;
};
