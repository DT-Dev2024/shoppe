import { memo } from "react";
import { Outlet } from "react-router-dom";
import { AuthenticationNavbar } from "src/components/Navbar";
import { FooterLink, FooterPolicyAndTerms } from "src/components/old/Footer";

type RegisterLayoutProps = {
  children?: React.ReactNode;
};

const AuthenticationLayoutInner = ({ children }: RegisterLayoutProps) => {
  return (
    <div>
      <AuthenticationNavbar></AuthenticationNavbar>
      <div className="h-full py-20 bg-primary">
        <div className="container lg:h-[390px] lg:bg-shopee-pattern lg:bg-no-repeat">
          <Outlet></Outlet>
          {children}
        </div>
      </div>
      <div className="">
        <FooterLink />
        <FooterPolicyAndTerms />
      </div>
    </div>
  );
};

const AuthenticationLayout = memo(AuthenticationLayoutInner);

export default AuthenticationLayout;
