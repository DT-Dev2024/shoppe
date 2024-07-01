import { Button, Card, Col, PageHeader, Row, Table } from "antd";
import React, { Component, useEffect, useState } from "react";
import { Header } from "../dashboard/component/Header";
import { COLUMNS_LOG } from "../../config/constants";
import { requestLogHistory } from "../../service/network/Api";
import DateUtil from "../../util/DateUtil";

export default function LogScreen() {
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getData = async () => {
    setIsLoading(true);
    const payload = {
      page: undefined,
      limit: 1000,
    };
    try {
      const res = await requestLogHistory(payload);
      if (res) {
        setIsLoading(false);
        setListData(res.data);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const renderTable = () => {
    return (
      <div
        style={{
          backgroundColor: "white",
          margin: "0px 10px 0px",
          padding: "15px 20px",
        }}
      >
        <Table
          style={{ height: "90vh" }}
          loading={isLoading}
          dataSource={listData}
          bordered
          rowKey={(_: any, index: any) => `${index}`}
          columns={COLUMNS_LOG}
          expandRowByClick={true}
          pagination={{}}
          expandable={{
            expandedRowRender: (item: any) => (
              <div style={{ backgroundColor: "white" }}>
                <Card
                  style={{
                    width: "100%",
                    backgroundColor: "#f6f9ff",
                    borderColor: "#1890ff",
                    borderTop: "none",
                  }}
                  actions={[]}
                >
                  <h3
                    style={{
                      color: "#007aff",
                    }}
                    children={"Thông tin giao dịch"}
                  />
                  <Row style={{ marginTop: 20 }}>
                    <Col flex={1}>
                      <h4>Tên: {item.name}</h4>
                      <h4>Nội dung: {item.content}</h4>
                    </Col>
                    <Col flex={1}>
                      <h4>Loại tương tác: {item.action}</h4>
                      <h4>
                        Ngày tạo:{" "}
                        {DateUtil.formatTimeDateReview(item.created_at)}
                      </h4>
                    </Col>
                  </Row>
                </Card>
              </div>
            ),
          }}
        />
      </div>
    );
  };

  return (
    <div style={{ marginTop: 10 }}>
      <PageHeader
        title="Lịch sử"
        style={{ backgroundColor: "white", margin: "5px 10px 10px" }}
        extra={[<Header showButton={false} onClick={() => {}} />]}
      />
      {renderTable()}
    </div>
  );
}
