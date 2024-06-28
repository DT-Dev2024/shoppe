import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import reactotron from "../../ReactotronConfig";
import {
  requestDeleteTransaction,
  requestGetTransaction,
  requestRejectTransaction,
  requestSuccessTransaction,
} from "../../service/network/Api";
import axios from "axios";
import Cookies from "js-cookie";
import { callAPI } from "../../util/CallApiHelper";
import {
  Button,
  Col,
  Modal,
  PageHeader,
  Row,
  Spin,
  Switch,
  Table,
  Tabs,
} from "antd";
import moment from "moment";
import DateUtil from "../../util/DateUtil";
import { showToast } from "../../util/funcUtils";
import { BASE_URL_DEV } from "../../service/ApiService";
import { COLUMNS_TRANSACTION } from "../../config/constants";
import ListTransaction from "./component/ListTransaction";
import { Header } from "./component/Header";
const { confirm } = Modal;
const { TabPane } = Tabs;

export default function HomeScreen() {
  const [tabs, setTabs] = useState(1);
  const [fromDaytoDay, setFromDaytoDay] = useState<any>([]);

  const [status, setStatus] = useState("");

  const onChange = (key: string) => {
    setTabs(+key);
  };
  return (
    <div style={{ marginTop: 10 }}>
      <PageHeader
        title="Giao dịch"
        style={{ backgroundColor: "white", margin: "5px 10px 10px" }}
        extra={[
          <Header
            onStatusSubmit={(statusKey: string) => {
              setStatus(statusKey);
            }}
            dataDropdown={[
              {
                name: "Tất cả",
              },
              {
                name: "Chờ phê duyệt",
              },
              {
                name: "Đã phê duyệt",
              },
              {
                name: "Từ chối",
              },
            ]}
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
          <TabPane tab="Yêu cầu nạp tiền" key="1">
            <ListTransaction
              tabs={tabs}
              statusTransaction={status}
              date={fromDaytoDay}
            />
          </TabPane>
          <TabPane tab="Yêu cầu rút tiền" key="2">
            <ListTransaction
              tabs={tabs}
              statusTransaction={status}
              date={fromDaytoDay}
            />
          </TabPane>
          <TabPane tab="Yêu cầu nâng cấp tài khoản" key="3">
            <ListTransaction
              tabs={tabs}
              statusTransaction={status}
              date={fromDaytoDay}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
