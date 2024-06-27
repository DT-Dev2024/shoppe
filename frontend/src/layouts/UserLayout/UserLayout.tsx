import { Outlet } from "react-router-dom";
import { Header } from "src/components/Navbar";
import { MotionPart } from "src/components/old";
import { FooterLink, FooterPolicyAndTerms } from "src/components/old/Footer";
type UserLayoutPropsType = {
  children?: React.ReactNode;
};
const UserLayout = ({ children }: UserLayoutPropsType) => {
  return (
    <div className="bg-neutral-100">
      <Header />

      <div className="mt-32 py-16 text-sm text-gray-600 lg:mt-40">
        <div className="mx-2 lg:mx-[16%]">{children}</div>
      </div>
      <hr className="mt-32 h-2 w-full bg-[#f94f2f]" />

      <FooterLink bg="bg-white" />
      <div>
        <FooterPolicyAndTerms />
      </div>
      <MotionPart />
    </div>
  );
};

export default UserLayout;
