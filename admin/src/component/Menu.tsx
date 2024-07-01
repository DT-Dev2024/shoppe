import { Menu } from "antd";
import Layout, { Content } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import { Key, useState } from "react";
import { Link, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { ADMIN_ROUTER_PATH } from "../config/router";
import CategoryScreen from "../screen/category/CategoryScreen";
import ConfigScreen from "../screen/config/ConfigScreen";
import CustomerScreen from "../screen/customer/CustomerScreen";
import OrderCustomerScreen from "../screen/customer/OrderCustomerScreen";
import TransactionCustomerScreen from "../screen/customer/TransactionCustomerScreen";
import HomeScreen from "../screen/dashboard/DashBoardScreen";
import StatisticalScreen from "../screen/dash_board/StatisticalScreen";
import ListAdminScreen from "../screen/list_admin/ListAdminScreen";
import OrderScreen from "../screen/order/OrderScreen";
import ProductScreen from "../screen/product/ProductScreen";
import VipDetailScreen from "../screen/vip/VipDetailScreen";
import VipScreen from "../screen/vip/VipScreen";

import R from "./assets";
import LogScreen from "../screen/logAction/LogScreen";

export default function MenuComponent() {
  const [openKeys, setOpenKeys] = useState<Array<any>>([]);
  const rootSubmenuKeys = Object.values(ADMIN_ROUTER_PATH);
  const navigate = useNavigate();

  const handleChangeMenu = (keys: Key[]) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey as string) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const handleGetCurrentRouter = () => {
    return window.location.pathname;
  };
  return (
    <div className="menu" style={{ background: "blue" }}>
      <Layout style={{ height: "100vh" }}>
        <Sider
          trigger={null}
          breakpoint="xl"
          collapsible
          theme={"light"}
          style={{ height: "100vh", marginTop: 2, backgroundColor: "yellow" }}
          children={
            <Menu
              style={{ height: "100%" }}
              key="MenuHeader"
              mode={"inline"}
              onClick={(e) => {
                navigate(e.key);
              }}
              openKeys={openKeys}
              onOpenChange={(e) => handleChangeMenu(e)}
              // selectedKeys={[handleGetCurrentRouter()]}
            >
              <Menu.Item
                key={ADMIN_ROUTER_PATH.HOME}
                icon={<IconMenu src={R.images.img_transaction} />}
                children={"Giao dịch"}
              />
              <Menu.Item
                key={ADMIN_ROUTER_PATH.PRODUCT}
                icon={<IconMenu src={R.images.img_product} />}
                children={"Sản phẩm"}
              />
              <Menu.Item
                key={ADMIN_ROUTER_PATH.ORDER}
                icon={<IconMenu src={R.images.img_order_delivery} />}
                children={"Đơn hàng"}
              />
              <Menu.Item
                key={ADMIN_ROUTER_PATH.CUSTOMER}
                icon={<IconMenu src={R.images.img_customer} />}
                children={"Khách hàng"}
              />
              <Menu.Item
                key={ADMIN_ROUTER_PATH.VIP}
                icon={<IconMenu src={R.images.img_vip} />}
                children={"Vip"}
              />
              <Menu.Item
                key={ADMIN_ROUTER_PATH.LIST_ADMIN}
                icon={<IconMenu src={R.images.img_team} />}
                children={"Quản trị viên"}
              />
              <Menu.Item
                key={ADMIN_ROUTER_PATH.DASH_BOARD}
                icon={<IconMenu src={R.images.img_monitor} />}
                children={"Thông kê"}
              />
              <Menu.Item
                key={ADMIN_ROUTER_PATH.CATEGORY}
                icon={<IconMenu src={R.images.img_categories} />}
                children={"Danh mục"}
              />
              <Menu.Item
                key={ADMIN_ROUTER_PATH.CONFIG}
                icon={<IconMenu src={R.images.img_settings} />}
                children={"Cấu hình"}
              />
              <Menu.Item
                key={ADMIN_ROUTER_PATH.LOG}
                icon={<IconMenu src={R.images.img_history} />}
                children={"Lịch sử"}
              />
            </Menu>
          }
        />
        <Content style={{ height: "100vh" }}>
          <Routes>
            <Route path={"/"} element={<HomeScreen />} />
            <Route path={ADMIN_ROUTER_PATH.HOME} element={<HomeScreen />} />
            <Route
              path={ADMIN_ROUTER_PATH.PRODUCT}
              element={<ProductScreen />}
            />
            <Route path={ADMIN_ROUTER_PATH.ORDER} element={<OrderScreen />} />
            <Route
              path={ADMIN_ROUTER_PATH.CUSTOMER}
              element={<CustomerScreen />}
            />
            <Route
              path={`${ADMIN_ROUTER_PATH.CUSTOMER}/${ADMIN_ROUTER_PATH.CUSTOMER_TRANSACTION}`}
              element={<TransactionCustomerScreen />}
            />
            <Route
              path={`${ADMIN_ROUTER_PATH.CUSTOMER}/${ADMIN_ROUTER_PATH.CUSTOMER_ORDER}`}
              element={<OrderCustomerScreen />}
            />
            <Route path={ADMIN_ROUTER_PATH.VIP} element={<VipScreen />} />
            <Route
              path={`${ADMIN_ROUTER_PATH.VIP}/${ADMIN_ROUTER_PATH.LIST_PRODUCT_VIP}`}
              element={<VipDetailScreen />}
            />
            <Route
              path={ADMIN_ROUTER_PATH.LIST_ADMIN}
              element={<ListAdminScreen />}
            />
            <Route path={ADMIN_ROUTER_PATH.CONFIG} element={<ConfigScreen />} />
            <Route
              path={ADMIN_ROUTER_PATH.CATEGORY}
              element={<CategoryScreen />}
            />
            <Route
              path={ADMIN_ROUTER_PATH.DASH_BOARD}
              element={<StatisticalScreen />}
            />
            <Route path={ADMIN_ROUTER_PATH.LOG} element={<LogScreen />} />
          </Routes>
        </Content>
      </Layout>
      <Outlet />
    </div>
  );
}

const IconMenu = ({ src }: { src: any }) => {
  return (
    <img
      src={src}
      style={{
        width: 25,
        height: 25,
        marginRight: 8,
      }}
    />
  );
};
