import { useState, createContext, ReactNode } from "react";

// Context
const ModalStatusContext = createContext<{
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}>({} as any);

// Provider
function ModalStatusContextProvider({ children }: { children: ReactNode }) {
  const [showModal, setShowModal] = useState(false);

  return <ModalStatusContext.Provider value={{ showModal, setShowModal }}>{children}</ModalStatusContext.Provider>;
}

export { ModalStatusContext, ModalStatusContextProvider };
