import { Outlet } from "react-router-dom";
import { Header } from "src/components/Navbar";
import { Footer, MotionPart } from "src/components/old";

const UserLayout = () => {
  return (
    <>
      <Header />

      <div className="mt-40 bg-neutral-100 py-16 text-sm text-gray-600">
        <div className="mx-[28%] w-[51%]">
          <Outlet />
        </div>
      </div>
      <Footer />
      <MotionPart />
    </>
  );
};

export default UserLayout;
