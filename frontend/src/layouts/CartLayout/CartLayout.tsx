import React from "react";
import { Header } from "src/components/Navbar";
import { Footer } from "src/components/old";

type CartLayoutPropsType = {
  children: React.ReactNode;
};

const CartLayout = ({ children }: CartLayoutPropsType) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default CartLayout;
