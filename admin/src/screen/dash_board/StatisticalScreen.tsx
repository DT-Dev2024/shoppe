import { Col, PageHeader, Row } from "antd";
import { useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import {
  convertVndToDollar,
  DOLLARS,
  handleConvertValueStatus,
  UNIT,
} from "../../config/constants";
import reactotron from "../../ReactotronConfig";
import { requestGetStatistic } from "../../service/network/Api";
import { formatPrice } from "../../util/funcUtils";
import { Header } from "../dashboard/component/Header";

export default function StatisticalScreen() {
  const [status, setStatus] = useState<any>(1);
  const [totalTopUp, setTotalTopUp] = useState<any>();
  const [totalCashOut, setTotalCashOut] = useState<any>();
  const [fromDaytoDay, setFromDaytoDay] = useState<any>([]);

  const getData = async (type: any) => {
    let payload = {
      from: fromDaytoDay[0] || "",
      to: fromDaytoDay[1] || "",
      user_id: "",
      status: handleConvertValueStatus(status),
      type: type,
    };
    try {
      const res = await requestGetStatistic(payload);
      if (res) {
        if (type == "TopUp") {
          setTotalTopUp(res.data.total);
        }
        if (type == "CashOut") {
          setTotalCashOut(res.data.total);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    getData("TopUp");
    getData("CashOut");
  }, [status, fromDaytoDay]);
  return (
    <div style={{ marginTop: 10 }}>
      <PageHeader
        title="Thông kê"
        style={{ backgroundColor: "white", margin: "5px 10px 10px" }}
        extra={[
          <Header
            onStatusSubmit={(statusKey: string) => {
              console.log!("statusKey", statusKey);
              if (!status) {
                setStatus(1);
                return;
              }
              setStatus(statusKey + 1);
            }}
            // onClear={() => {
            //   setStatus(1);
            // }}
            placeholderDrop={"Trạng thái"}
            dataDropdown={[
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
            // fromDaytoDay={fromDaytoDay}
            // dateOnSubmit={(x: string, y: string) => {
            //   setFromDaytoDay([x, y]);
            // }}
          />,
        ]}
      />
      <Row style={{ marginLeft: 5, marginRight: 5 }} gutter={16}>
        <Col span={6}>
          <div
            style={{
              background: "white",
              padding: "10px",
              textAlign: "start",
            }}
          >
            <h4>DOANH THU</h4>
          </div>
        </Col>
        <Col span={6}>
          <div
            style={{
              background: "white",
              padding: "10px",
              textAlign: "start",
            }}
          >
            <h4>KHÁCH HÀNG</h4>
          </div>
        </Col>
        <Col span={6}>
          <div
            style={{
              background: "white",
              padding: "10px",
              textAlign: "start",
            }}
          >
            <h4>SẢN PHẨM</h4>
          </div>
        </Col>
        <Col span={6}>
          <div
            style={{
              background: "white",
              padding: "10px",
              textAlign: "start",
            }}
          >
            <h4>ĐƠN HOÀN THÀNH</h4>
          </div>
        </Col>
      </Row>
    </div>
  );
}
