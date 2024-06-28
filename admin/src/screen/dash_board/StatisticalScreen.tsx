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
            fromDaytoDay={fromDaytoDay}
            dateOnSubmit={(x: string, y: string) => {
              setFromDaytoDay([x, y]);
            }}
          />,
        ]}
      />
      <div>
        <Col>
          <Col>
            <div
              style={{
                marginLeft: "1vh",
                backgroundColor: "#3AB4F2",
                height: 150,
                width: "50vh",
                borderRadius: 10,
                boxShadow: "1px 3px 1px #DDD",
                paddingTop: 5,
              }}
            >
              <Row>
                <h1 style={{ color: "white", marginLeft: 10 }}>
                  Tổng yêu cầu nạp
                </h1>
                <h1 style={{ color: "white", marginLeft: 10 }}>
                  {status == 1
                    ? "- Chờ xác nhận"
                    : status == 2
                    ? "- Đã xác nhận"
                    : "- Từ chối"}
                </h1>
              </Row>
              <div style={{ paddingLeft: 30 }}>
                <h1
                  style={{ color: "white" }}
                  children={`${formatPrice(totalTopUp) || 0} ${UNIT}`}
                />
              </div>
            </div>
          </Col>
          <Col>
            <div
              style={{
                marginLeft: "1vh",
                marginTop: "2vh",
                backgroundColor: "#D61C4E",
                height: 150,
                width: "50vh",
                borderRadius: 10,
                boxShadow: "1px 3px 1px #DDD",
                paddingTop: 5,
              }}
            >
              <Row>
                <h1 style={{ color: "white", marginLeft: 10 }}>
                  Tổng yêu cầu rút
                </h1>
                <h1 style={{ color: "white", marginLeft: 10 }}>
                  {status == 1
                    ? "- Chờ xác nhận"
                    : status == 2
                    ? "- Đã xác nhận"
                    : "- Từ chối"}
                </h1>
              </Row>
              <div style={{ paddingLeft: 30 }}>
                <h1
                  style={{ color: "white" }}
                  children={`${formatPrice(totalCashOut) || 0} ${UNIT}`}
                />
                {/* <NumberFormat
                  value={totalCashOut}
                  className="foo"
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                /> */}
              </div>
            </div>
          </Col>
        </Col>
      </div>
    </div>
  );
}
