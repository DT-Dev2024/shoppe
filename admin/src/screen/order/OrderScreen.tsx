import { PageHeader, Tabs } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkToken } from "../../config/constants";
import { showToast } from "../../util/funcUtils";
import { Header } from "../dashboard/component/Header";
import ListOrderScreen from "./component/ListOrderScreen";
const { TabPane } = Tabs;
const OrderScreen = () => {
  const [tabs, setTabs] = useState(1);
  const [fromDaytoDay, setFromDaytoDay] = useState<any>([]);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const onChange = (key: string) => {
    setTabs(+key);
  };
  useEffect(() => {
    checkToken().then((res) => {
      if (res) return;
      navigate("/login");
      showToast("Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.");
    });
  }, []);
  return (
    <div style={{ marginTop: 10 }}>
      <PageHeader
        title="Đơn hàng"
        style={{ backgroundColor: "white", margin: "5px 10px 10px" }}
        extra={[
          <Header
            fromDaytoDay={fromDaytoDay}
            dateOnSubmit={(x: string, y: string) => {
              setFromDaytoDay([x, y]);
            }}
          />,
        ]}
      />
      <div
        style={{
          backgroundColor: "white",
          margin: "0px 10px 0px",
          padding: "15px 20px",
        }}
      >
        <Tabs onChange={onChange} type="card">
          {/* <TabPane tab="Chờ xử lý" key="1">
            <ListOrderScreen
              tabs={tabs}
              statusTransaction={status}
              date={fromDaytoDay}
            />
          </TabPane>
          <TabPane tab="Đang xử lý" key="2">
            <ListOrderScreen
              tabs={tabs}
              statusTransaction={status}
              date={fromDaytoDay}
            />
          </TabPane> */}
          <TabPane tab="Đóng băng" key="3">
            <ListOrderScreen
              tabs={tabs}
              statusTransaction={status}
              date={fromDaytoDay}
            />
          </TabPane>
          <TabPane tab="Hoàn thành" key="4">
            <ListOrderScreen
              tabs={tabs}
              statusTransaction={status}
              date={fromDaytoDay}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderScreen;
