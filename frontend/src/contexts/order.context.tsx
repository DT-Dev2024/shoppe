import { createContext, useState } from "react";
import { TExtendedPurchases } from "src/types/purchase.type";
import { orders } from "./cart.context";

interface OrderContextInterface {
  order: TExtendedPurchases[];
  setOrder: React.Dispatch<React.SetStateAction<TExtendedPurchases[]>>;
}

const initialOrderContext: OrderContextInterface = {
  order: [],
  setOrder: () => null,
};

export const OrderContext = createContext<OrderContextInterface>(initialOrderContext);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [order, setOrder] = useState<TExtendedPurchases[]>(orders);
  return <OrderContext.Provider value={{ order, setOrder }}>{children}</OrderContext.Provider>;
};
