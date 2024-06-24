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
      <div className="h-full bg-primary py-20">
        <div className="container lg:bg-shopee-pattern lg:bg-no-repeat">
          <Outlet></Outlet>
          {children}
        </div>
      </div>
      <div className="px-[30rem]">
        <FooterLink />
        <FooterPolicyAndTerms />
      </div>
    </div>
  );
};

const AuthenticationLayout = memo(AuthenticationLayoutInner);

export default AuthenticationLayout;
