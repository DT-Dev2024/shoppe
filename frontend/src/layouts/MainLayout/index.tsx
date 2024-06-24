import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      {/* <Header /> */}
      <div className="container mx-auto mt-10 flex max-w-screen-xl gap-32 px-4">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
