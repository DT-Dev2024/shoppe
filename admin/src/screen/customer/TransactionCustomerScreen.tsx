import {
  Button,
  Card,
  Col,
  message,
  Modal,
  PageHeader,
  Popconfirm,
  Row,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useId, useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import {
  COLUMNS_TRANSACTION,
  handleConvertKeyStatus,
  handleConvertValueStatus,
  handleConvertValueType,
  SESSION,
  UNIT,
} from "../../config/constants";
import reactotron from "../../ReactotronConfig";
import {
  requestDeleteTransaction,
  requestGetTransaction,
  requestSuccessTransaction,
} from "../../service/network/Api";
import DateUtil from "../../util/DateUtil";
import { formatPrice, showToast } from "../../util/funcUtils";
import { Header } from "../dashboard/component/Header";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import ModalForm from "../../component/ModalForm";
import Cookies from "js-cookie";
import { BASE_URL_DEV } from "../../service/ApiService";
import axios from "axios";

const { confirm } = Modal;
const TransactionCustomerScreen = (props: any) => {
  const [searchparams] = useSearchParams();
  const userId = searchparams.get("userId");
  const navigate = useNavigate();
  const [listTransaction, setListTransaction] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [fromDaytoDay, setFromDaytoDay] = useState<any>([]);
  const [item, setItem] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState<any>();
  const LIMIT = 100;

  const getData = async () => {
    setIsLoading(true);
    let payload = {
      page: 1,
      limit: LIMIT,
      from: fromDaytoDay[0],
      to: fromDaytoDay[1],
      status: handleConvertValueStatus(status),
      type: handleConvertValueType(type),
      user_id: userId,
    };
    try {
      const res = await requestGetTransaction(payload);
      if (res) {
        setIsLoading(false);
        reactotron.logImportant!("getData", res);
        setListTransaction(res.data);
      }
    } catch (error) {
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };
  const handleAccept = (item: any) => {
    confirm({
      title: "Thông báo",
      content: "Bạn có chắc chắn muốn phê duyệt yêu cầu này không?",
      cancelText: "Huỷ",
      okText: "Đồng ý",
      async onOk() {
        try {
          const res = await requestSuccessTransaction(item._id);
          if (res) {
            reactotron.logImportant!("handleAccept", res);
            getData();
            showToast("Phê duyệt yêu cầu thành công!");
          }
        } catch (error) {
          showToast("Đã có lỗi xảy ra! Vui lòng thử lại.", "error");
        }
      },
      onCancel() {},
    });
  };
  const handleDelete = async (item: any) => {
    confirm({
      title: "Thông báo",
      content: "Bạn có chắc chắn muốn xoá yêu cầu này không?",
      cancelText: "Huỷ",
      async onOk() {
        try {
          const res = await requestDeleteTransaction(item._id);
          if (res) {
            reactotron.logImportant!("handleDelete", res);
            getData();
            showToast("Xoá yêu cầu thành công!");
          }
        } catch (error) {
          showToast("Đã có lỗi xảy ra! Vui lòng thử lại.", "error");
        }
      },
      onCancel() {},
    });
  };
  const handleReject = (item: any) => {
    const payload = {
      id: item._id,
      body: {
        reject_reason: input,
      },
    };
    confirm({
      title: "Thông báo",
      content: "Bạn có chắc chắn muốn từ chối yêu cầu này không?",
      async onOk() {
        try {
          let header = { Authorization: `Bearer ${Cookies.get(SESSION)}` };
          axios
            .put(
              `${BASE_URL_DEV}transaction/${payload.id}/reject`,
              payload.body,
              { headers: header }
            )
            .then((res: any) => {
              setShowModal(false);
              getData();
              showToast("Từ chối yêu cầu thành công!");
            });
        } catch (error) {
          showToast("Đã có lỗi xảy ra! Vui lòng thử lại.", "error");
        }
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    getData();
  }, [userId, status, fromDaytoDay, type]);
  return (
    <div style={{ marginTop: 10 }}>
      <PageHeader
        onBack={() => {
          navigate(-1);
        }}
        title="Lịch sử giao dịch"
        style={{ backgroundColor: "white", margin: "5px 10px 10px" }}
        extra={[
          <Header
            onStatusSubmit={(statusKey: string) => {
              setStatus(statusKey);
            }}
            onStatusSubmit2={(statusKey: string) => {
              setType(statusKey);
            }}
            placeholderDrop={"Trạng thái"}
            placeholderDrop2={"Yêu cầu"}
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
            dataDropdown2={[
              {
                name: "Tất cả",
              },
              {
                name: "Nạp tiền",
              },
              {
                name: "Rút tiền",
              },
              {
                name: "Nâng cấp tài khoản",
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
        <Table
          dataSource={listTransaction}
          loading={isLoading}
          bordered
          rowKey={(_, index) => `${index}`}
          columns={COLUMNS_TRANSACTION}
          expandRowByClick={true}
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
                  actions={[
                    <Button
                      disabled={
                        item.status == "Success" || item.status == "Reject"
                      }
                      onClick={() => {
                        handleAccept(item);
                      }}
                      type="text"
                      size="large"
                      icon={<CheckCircleOutlined color="red" />}
                      style={{
                        color: item.status == "Pending" ? "#1890ff" : undefined,
                      }}
                    >
                      {"Phê duyệt"}
                    </Button>,
                    <Button
                      disabled={
                        item.status == "Reject" || item.status == "Success"
                      }
                      onClick={() => {
                        setShowModal(true);
                        setItem(item);
                      }}
                      type="text"
                      size="large"
                      icon={<CloseCircleOutlined color="red" />}
                    >
                      Từ chối
                    </Button>,

                    <Popconfirm
                      title={"Bạn chắc chắn muốn xoá yêu cầu này không?"}
                      onConfirm={() => {
                        handleDelete(item);
                      }}
                      okText="Xoá"
                      cancelText="Quay lại"
                      okButtonProps={{
                        danger: true,
                        type: "primary",
                        // loading: isShowDeleteConfirm,
                      }}
                    >
                      <Button
                        type="text"
                        size="large"
                        danger
                        icon={<DeleteFilled />}
                      >
                        Xoá
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <h3
                    style={{
                      color: "#007aff",
                    }}
                    children={"Thông tin tài khoản"}
                  />
                  <Row style={{ marginTop: 20 }}>
                    <Col flex={1}>
                      <h4>Số điện thoại: {item.user.phone}</h4>
                      {item.type !== "PurchaseLevel" && (
                        <h4>
                          {item.type == "TopUp"
                            ? `Số tiền yêu cầu nạp: ${
                                formatPrice(item.amount.toFixed(2) || 0) + UNIT
                              }`
                            : `Số tiền yêu cầu rút: ${
                                formatPrice(item.amount.toFixed(2) || 0) + UNIT
                              }`}
                        </h4>
                      )}
                      {item?.meta?.user_bank ? (
                        <>
                          <h4>Họ và tên: {item?.meta?.user_bank?.full_name}</h4>
                          <h4>
                            Số tài khoản: {item?.meta?.user_bank?.bank_number}
                          </h4>
                        </>
                      ) : null}
                      {item?.meta?.level ? (
                        <>
                          <h4>Cấp độ: {item?.meta?.level?.key}</h4>
                          <h4>
                            Giá: {formatPrice(item?.meta?.level?.price.toFixed(2)) + UNIT}
                          </h4>
                          <h4>
                            Phần trăm hoa hồng:{" "}
                            {item?.meta?.level?.commission_percent + "%"}
                          </h4>
                        </>
                      ) : null}
                    </Col>
                    <Col flex={1}>
                      <h4>
                        Số dư tài khoản:{" "}
                        {(formatPrice(item?.balance.toFixed(2)) || 0) + UNIT || "(Trống))"}
                      </h4>
                      <Row>
                        Trạng thái:{" "}
                        <Tag
                          color={
                            item.status == "Pending"
                              ? "blue"
                              : item.status == "Success"
                              ? "green"
                              : "volcano"
                          }
                        >
                          {`${handleConvertKeyStatus(item.status)}`}
                        </Tag>
                      </Row>
                    </Col>
                    <Col flex={1}>
                      <h4>
                        Ngân hàng: {item?.user?.bank?.bank_name || "(Trống)"}
                      </h4>
                      <h4>
                        Ngày yêu cầu:{" "}
                        {DateUtil.formatTimeDateReview(item.created_at)}
                      </h4>
                      {item.reject_reason ? (
                        <h4>Lý do từ chối: {item.reject_reason}</h4>
                      ) : null}
                    </Col>
                  </Row>
                </Card>
              </div>
            ),
          }}
        />
      </div>
      <ModalForm
        visible={showModal}
        title={"Lý do từ chối"}
        onCancel={() => {
          setShowModal((prev) => !prev);
        }}
        children={
          <>
            <TextArea
              placeholder="Nhập lý do từ chối"
              showCount
              value={input}
              maxLength={100}
              style={{ height: 120 }}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <Button
              onClick={() => {
                if (!input) {
                  return message.warning("Vui lòng nhập lý do từ chối!");
                }
                handleReject(item);
              }}
              style={{
                marginTop: 20,
                fontWeight: 800,
                borderRadius: "3px",
              }}
              type="primary"
              htmlType="submit"
              children={"Xác nhận"}
            />
          </>
        }
      />
    </div>
  );
};

export default TransactionCustomerScreen;
