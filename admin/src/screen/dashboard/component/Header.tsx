import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Row, Select } from "antd";
import React from "react";
import styled from "styled-components";
import "./css/Header.css";
import moment from "moment";
import TypingAutoSearch from "../../../component/TypingAutoSearch";
const { Option } = Select;
const { RangePicker } = DatePicker;

const Container = styled.div`
  width: 100%;
  padding: 0.5rem;
  background-color: white;
  border-bottom: 1px solid #dddd;
`;

type HeaderProps = {
  onStatusSubmit?: (statusKey: any) => void;
  fromDaytoDay?: any;
  dateOnSubmit?: (from_date: any, to_date: any) => void;
};

export const Header = ({
  onStatusSubmit,
  fromDaytoDay,
  dateOnSubmit,
  showButton,
  onClick,
  onSearchSubmit,
  isSearchLoading,
  dataDropdown,
  placeholderDrop,
  onStatusSubmit2,
  placeholderDrop2,
  dataDropdown2,
  onClear,
  placeholderSearch,
  title
}: any) => {
  return (
    <Row
      style={{
        marginRight: 20,
        justifyContent: "space-between",
      }}
    >
      {onSearchSubmit ? (
        <Col style={{ width: "250px", marginRight: 30 }}>
          <TypingAutoSearch
            onSearchSubmit={(key: string) => {
              onSearchSubmit(key.trim());
            }}
            isSearchLoading={isSearchLoading}
            placeholder={placeholderSearch || "Nhập tên hoặc mã sản phẩm ..."}
          />
        </Col>
      ) : null}
      {fromDaytoDay ? (
        <Col style={{}}>
          <RangePicker
            style={{ width: "300px" }}
            placeholder={["Từ ngày", "đến ngày"]}
            className="rangerpicker-order"
            onChange={(value, dateString) => {
              dateOnSubmit(dateString[0], dateString[1]);
            }}
          />
          {onStatusSubmit ? (
            <Select
              // allowClear
              onClear={onClear}
              placeholder={placeholderDrop || "Trạng thái"}
              style={{ minWidth: "150px", marginLeft: 30 }}
              onChange={(value) => {
                onStatusSubmit(value);
              }}
            >
              {dataDropdown.map((item: any, index: number) => {
                return <Option value={index}>{item.name}</Option>;
              })}
            </Select>
          ) : null}
          {onStatusSubmit2 ? (
            <Select
              allowClear
              placeholder={placeholderDrop2 || "Trạng thái"}
              style={{ minWidth: "150px", marginLeft: 30 }}
              onChange={(value) => {
                onStatusSubmit2(value);
              }}
            >
              {dataDropdown2.map((item: any, index: number) => {
                return <Option value={index}>{item.name}</Option>;
              })}
            </Select>
          ) : null}

          <Col span={4}></Col>
        </Col>
      ) : null}

      {showButton ? (
        <Button
          onClick={onClick}
          style={{
            fontWeight: 800,
            borderRadius: "3px",
            marginLeft: 30,
          }}
          type="primary"
          htmlType="submit"
          children={title||"Thêm mới"}
        />
      ) : null}
    </Row>
  );
};
