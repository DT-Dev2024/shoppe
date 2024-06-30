import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  message,
  Modal,
  Popconfirm,
  Row,
  Spin,
  Table,
  Tag,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalForm from "../../../component/ModalForm";
import {
  checkToken,
  COLUMNS_TRANSACTION,
  convertVndToDollar,
  handleConvertKeyStatus,
  handleConvertValueStatus,
  SESSION,
  UNIT,
} from "../../../config/constants";
import reactotron from "../../../ReactotronConfig";
import { BASE_URL_DEV } from "../../../service/ApiService";
import {
  requestDeleteTransaction,
  requestRejectTransaction,
  requestSuccessTransaction,
} from "../../../service/network/Api";
import DateUtil from "../../../util/DateUtil";
import { formatPrice, showToast } from "../../../util/funcUtils";
const { confirm } = Modal;

const ListTransaction = (props: any) => {
  const { tabs, statusTransaction, date } = props;
  const [listTransaction, setListTransaction] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [item, setItem] = useState<any>();
  const [input, setInput] = useState<any>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const LIMIT = 100;

  const getData = () => {
    setIsLoading(true);
    try {
      const payload = {
        page: page,
        limit: LIMIT,
        from: date[0],
        to: date[1],
        status: handleConvertValueStatus(statusTransaction),
        type: tabs == 1 ? "TopUp" : tabs == 2 ? "CashOut" : "PurchaseLevel",
      };
      let headers = { Authorization: `Bearer ${Cookies.get(SESSION)}` };
      axios({
        url: `${BASE_URL_DEV}/api/v1/admin/transaction`,
        headers,
        method: "GET",
        data: null,
        params: payload,
      })
        .then(({ data }: any) => {
          reactotron.logImportant!("getDataHome", data);
          setIsLoading(false);
          setListTransaction(data.data);
          // setTotalPage(data.meta.pagination.total);
        })
        .catch(() => {});
    } catch (error) {
      setIsLoading(false);
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.", "error");
    }
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
          const res = await requestRejectTransaction(payload);
          if (res) {
            setShowModal(false);
            getData();
            showToast("Từ chối yêu cầu thành công!");
          }
          // let header = { Authorization: `Bearer ${Cookies.get(SESSION)}` };
          // axios
          //   .put(
          //     `${BASE_URL_DEV}transaction/${payload.id}/reject`,
          //     payload.body,
          //     { headers: header }
          //   )
          //   .then((res) => {
          //     setShowModal(false);
          //     getData();
          //     showToast("Từ chối yêu cầu thành công!");
          //   });
        } catch (error) {
          showToast("Đã có lỗi xảy ra! Vui lòng thử lại.", "error");
        }
      },
      onCancel() {},
    });
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

  useEffect(() => {
    getData();
  }, [tabs, statusTransaction, date, page]);
  // useEffect(() => {
  //   getData();
  // }, [page]);

  useEffect(() => {
    checkToken().then((res) => {
      if (res) return getData();
      navigate("/login");
      showToast("Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.");
    });
  }, []);

  return (
    <div
      style={{
        height: "76vh",
        width: "100%",
      }}
    >
      {isLoading ? (
        <div
          style={{
            height: "100vh",
            width: "100%",
          }}
        >
          <Spin
            style={{ marginTop: "40vh", marginLeft: "45%" }}
            tip="Đang tải dữ liệu..."
          ></Spin>
        </div>
      ) : (
        <Table
          dataSource={listTransaction}
          // onExpand={async (expanded: boolean, record: any) => {
          //   await getUserDetail(record.id);
          // }}
          bordered
          rowKey={(_, index) => `${index}`}
          columns={COLUMNS_TRANSACTION}
          //   expandedRowKeys={[currentSelected.id]}
          expandRowByClick={true}
          // pagination={{
          //   pageSize: LIMIT,
          //   total: totalPage,
          //   onChange: (page) => {
          //     setPage(page);
          //   },
          // }}
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
                    children={"Thông tin tài khoản khách hàng"}
                  />
                  <Row style={{ marginTop: 20 }}>
                    <Col flex={1}>
                      <h4>Số điện thoại: {item.user.phone}</h4>
                      {item.type !== "PurchaseLevel" && (
                        <h4>
                          {item.type == "TopUp"
                            ? `Số tiền yêu cầu nạp: ${
                                (formatPrice(item.amount.toFixed(2)) || 0) +
                                UNIT
                              }`
                            : `Số tiền yêu cầu rút: ${
                                (formatPrice(item.amount.toFixed(2)) || 0) +
                                UNIT
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
                            Giá:{" "}
                            {(formatPrice(
                              item?.meta?.level?.price.toFixed(2)
                            ) || 0) + UNIT}
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
                        {(formatPrice(item?.balance.toFixed(2)) || 0) + UNIT ||
                          "(Trống))"}
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
            // onExpand: (status: any, r: any) => {
            //   if (currentSelected !== r._id) setCurrentSelected(r._id);
            //   else setCurrentSelected({ id: -1 });
            //   reactotron.log!(r);
            // },
          }}
        />
      )}
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

export default ListTransaction;
