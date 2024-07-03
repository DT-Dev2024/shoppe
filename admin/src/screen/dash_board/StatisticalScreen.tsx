import { Col, PageHeader, Row } from "antd";
import { useEffect, useState } from "react";
import { requestStatistic } from "../../service/network/Api";
import { formatPrice } from "../../util/funcUtils";
import { Header } from "../dashboard/component/Header";
import R from "../../component/assets";

export default function StatisticalScreen() {
  const [status, setStatus] = useState<any>(1);
  const [data, setData] = useState<any>();

  const getData = async () => {
    const res = await requestStatistic();
    setData(res.data);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div style={{ marginTop: 10 }}>
      <PageHeader
        title="Thống kê"
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
              padding: "20px",
              textAlign: "start",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                DOANH THU
              </h3>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {formatPrice(data?.total_price || 0)} VND
              </h3>
            </div>
            <img
              src={R.images.money}
              style={{
                width: "20%",
                height: "auto",
                // marginTop: "10px",
                // marginBottom: "30px",
              }}
              alt=""
            />
          </div>
        </Col>
        <Col span={6}>
          <div
            style={{
              background: "white",
              padding: "20px",
              textAlign: "start",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                KHÁCH HÀNG
              </h3>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {data?.total_customer || 0}
              </h3>
            </div>
            <img
              src={R.images.customer}
              style={{
                width: "20%",
                height: "auto",
                // marginTop: "10px",
                // marginBottom: "30px",
              }}
              alt=""
            />
          </div>
        </Col>
        <Col span={6}>
          <div
            style={{
              background: "white",
              padding: "20px",
              textAlign: "start",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                SẢN PHẨM
              </h3>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {data?.total_products || 0}
              </h3>
            </div>
            <img
              src={R.images.box}
              style={{
                width: "20%",
                height: "auto",
                // marginTop: "10px",
                // marginBottom: "30px",
              }}
              alt=""
            />
          </div>
        </Col>
        <Col span={6}>
          <div
            style={{
              background: "white",
              padding: "20px",
              textAlign: "start",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                TỔNG ĐƠN HÀNG
              </h3>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                {data?.total_orders || 0}
              </h3>
            </div>
            <img
              src={R.images.check_list}
              style={{
                width: "20%",
                height: "auto",
                // marginTop: "10px",
                // marginBottom: "30px",
              }}
              alt=""
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
