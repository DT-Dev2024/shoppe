import { PageHeader, Tabs } from "antd";
import React, { useState } from "react";
import { Header } from "../dashboard/component/Header";
import ConfigCommission from "./ConfigCommission";
import InfoBankScreen from "./InfoBankScreen";
import UserInfoScreen from "./UserInfoScreen";
import ConfigAlertHome from './ConfigAlertHome';

const { TabPane } = Tabs;

const ConfigScreen = () => {
  const [tabs, setTabs] = useState(1);
  const onChange = (key: string) => {
    setTabs(+key);
  };
  return (
    <div>
      <PageHeader
        title="Cấu hình"
        style={{ backgroundColor: "white", margin: "5px 10px 10px" }}
      />
      <div
        style={{
          backgroundColor: "white",
          margin: "0px 10px 0px",
          padding: "15px 20px",
        }}
      >
        <Tabs onChange={onChange} type="card">
          {/* <TabPane tab="Tài khoản" key="1">
            <UserInfoScreen />
          </TabPane> */}
          <TabPane tab="Ngân hàng" key="2">
            <InfoBankScreen />
          </TabPane>
          <TabPane tab="Cấu hình hoa hồng" key="3">
            <ConfigCommission />
          </TabPane>
          <TabPane tab="Cấu hình thông báo trang chủ" key="4">
            <ConfigAlertHome />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ConfigScreen;
