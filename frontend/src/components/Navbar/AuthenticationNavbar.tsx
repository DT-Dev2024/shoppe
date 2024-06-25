import React from "react";
import { Link, useMatch } from "react-router-dom";
import { path } from "src/constants/path.enum";
import ShopeeLogoIcon from "../Icon/ShopeeLogoIcon";

const AuthenticationNavbar = () => {
  const matchRegister = useMatch("/register");
  const isRegisterPage = Boolean(matchRegister);
  return (
    <header className="py-6 bg-white">
      <div className="container">
        <nav className="flex items-end">
          <Link to={path.home}>
            <ShopeeLogoIcon className="h-[30px] lg:h-12" fillColor="primary"></ShopeeLogoIcon>
          </Link>
          <div className="ml-5 text-2xl lg:text-3xl">{isRegisterPage ? "Đăng ký" : "Đăng nhập"}</div>
        </nav>
      </div>
    </header>
  );
};

export default AuthenticationNavbar;
