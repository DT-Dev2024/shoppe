import { Outlet } from "react-router-dom";
import { Header } from "src/components/Navbar";
import { MotionPart } from "src/components/old";
import { FooterLink, FooterPolicyAndTerms } from "src/components/old/Footer";

const UserLayout = () => {
  return (
    <div className="bg-neutral-100">
      <Header />

      <div className="mt-40 py-16 text-sm text-gray-600">
        <div className="mx-[28%] w-[51%]">
          <Outlet />
        </div>
      </div>
      <hr className="mt-32 h-2 w-full bg-[#f94f2f]" />

      <FooterLink
        bg="bg-white"
        p="px-[35rem]"
      />
      <div className="px-[35rem]">
        <FooterPolicyAndTerms />
      </div>
      <MotionPart />
    </div>
  );
};

export default UserLayout;
