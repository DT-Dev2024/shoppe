import React, { useEffect, useLayoutEffect } from "react";
import {
  BrowserRouter as Router,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { HeaderComponent } from "../component/Header";
import MenuComponent from "../component/Menu";
import { ADMIN_ROUTER_PATH } from "../config/router";
import LoginScreen from "../screen/auth/LoginScreen";
import TransactionCustomerScreen from "../screen/customer/TransactionCustomerScreen";
import { useStore } from "../store";

export const MainNavigator = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);

  useEffect(() => {
    // if (!user) navigate('/login')
  }, []);

  return (
    <div>
      <HeaderComponent toggle={() => {}} />
      <MenuComponent />
    </div>
  );
};

const AppNavigator = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/" element={<MainNavigator />}>
          <Route path={ADMIN_ROUTER_PATH.HOME} element={<></>} />
          <Route path={ADMIN_ROUTER_PATH.DASH_BOARD} element={<></>} />
          <Route path={ADMIN_ROUTER_PATH.PRODUCT} element={<></>} />
          <Route path={ADMIN_ROUTER_PATH.ORDER} element={<></>} />
          <Route path={ADMIN_ROUTER_PATH.CUSTOMER} element={<></>} />
          <Route path={ADMIN_ROUTER_PATH.VIP} element={<></>} />
          <Route path={ADMIN_ROUTER_PATH.LIST_ADMIN} element={<></>} />
          <Route path={ADMIN_ROUTER_PATH.CATEGORY} element={<></>} />
          <Route path={ADMIN_ROUTER_PATH.CONFIG} element={<></>} />
          <Route path={ADMIN_ROUTER_PATH.LOG} element={<></>} />
          <Route
            path={`/${ADMIN_ROUTER_PATH.CUSTOMER}/${ADMIN_ROUTER_PATH.CUSTOMER_TRANSACTION}`}
            element={<></>}
          />
          <Route
            path={`/${ADMIN_ROUTER_PATH.CUSTOMER}/${ADMIN_ROUTER_PATH.CUSTOMER_ORDER}`}
            element={<></>}
          />
          <Route
            path={`/${ADMIN_ROUTER_PATH.VIP}/${ADMIN_ROUTER_PATH.LIST_PRODUCT_VIP}`}
            element={<></>}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppNavigator;
