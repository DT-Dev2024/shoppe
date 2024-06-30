import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Button } from "antd";
import Icon, {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  background-color: white;
`;
type ButtonBottomModalProps = {
  isLoadingButton: boolean;
  onCancel: any;
  text?: string;
  onClickconfirm?: any;
};

const ButtonBottomModal = ({
  isLoadingButton,
  onCancel,
  text,
  onClickconfirm,
}: ButtonBottomModalProps) => {
  return (
    <Row gutter={16} justify="end" style={{ marginTop: 30 }}>
      <Col>
        <Button
          style={{ fontWeight: 800, borderRadius: "5px", height: "35px" }}
          danger
          onClick={() => {
            // form.resetFields()
            onCancel();
          }}
        >
          <CloseCircleOutlined />
          Huỷ
        </Button>
      </Col>
      <Col>
        <Button
          onClick={() => onClickconfirm()}
          type="primary"
          loading={isLoadingButton}
          htmlType="submit"
          style={{
            fontWeight: 800,
            borderRadius: "5px",
            backgroundColor: "#00abba",
            borderColor: "#00abba",
            height: "35px",
          }}
        >
          <CheckCircleOutlined />
          {text}
        </Button>
      </Col>
    </Row>
  );
};

export default ButtonBottomModal;
