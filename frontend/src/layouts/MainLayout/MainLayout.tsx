import React, { memo } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "src/components/Navbar";
import { Footer, MotionPart } from "src/components/old";
type MainLayoutProps = {
  children?: React.ReactNode;
};
const MainLayoutInner = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Header />
      {children}
      <Outlet />
      <Footer />
      <MotionPart />
    </>
  );
};

const MainLayout = memo(MainLayoutInner);

export default MainLayout;
