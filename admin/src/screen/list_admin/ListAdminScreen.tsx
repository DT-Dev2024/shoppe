import {
  CheckCircleOutlined,
  DeleteFilled,
  LoadingOutlined,
  PlusOutlined,
  EditFilled,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  PageHeader,
  Popconfirm,
  Row,
  Select,
  Spin,
  Table,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import R from "../../component/assets";
import ModalForm from "../../component/ModalForm";
import {
  checkToken,
  COLUMNS_ADMIN,
  FORM_ITEM_LAYOUT_STAFF,
} from "../../config/constants";
import {
  requestAddNewAccount,
  requestDeleteAccountAdmin,
  requestGetListAdmin,
  requestResetPassword,
  requestUpdateVoucher,
} from "../../service/network/Api";
import DateUtil from "../../util/DateUtil";
import { formatPrice, showToast } from "../../util/funcUtils";
import { Header } from "../dashboard/component/Header";
import { Option } from "antd/lib/mentions";

export default function ListAdminScreen() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [listAdmin, setListAdmin] = useState([]);
  const [fromDaytoDay, setFromDaytoDay] = useState([
    moment().subtract(14, "days").format("YYYY-MM-DD"),
    moment().format("YYYY-MM-DD"),
  ]);
  const [visile, setVisible] = useState<any>(0);
  const [item, setItem] = useState<any>();
  const [form] = Form.useForm();

  const getData = async () => {
    setIsLoading(true);
    const payload = {
      page: undefined,
      limit: 1000,
      identifier: undefined,
    };
    try {
      const res = await requestGetListAdmin(payload);
      if (res) {
        setIsLoading(false);
        setListAdmin(res.data);
      }
    } catch (error) {}
  };

  const handleDeleteAccount = async (item: any) => {
    try {
      const res = await requestDeleteAccountAdmin(item.id);
      if (res) {
        getData();
        showToast(`Đã xoá thành công!`);
      }
    } catch (error) {
      message.warning("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  const handleAddAccountadmin = async (values: any) => {
    const { type, code, discount, discount_type, minium_price } = values;
    const currentDate = new Date();
    const nextYearDate = new Date(currentDate);
    nextYearDate.setFullYear(currentDate.getFullYear() + 1);
    const payload = {
      type,
      code,
      discount: Number(discount),
      discount_type,
      minium_price: Number(minium_price),
      expire: nextYearDate.toISOString(),
    };
    if (visile == 1) {
      try {
        const res = await requestAddNewAccount(payload);
        if (res) {
          setVisible(0);
          getData();
          showToast(`Thêm mới tài khoản thành công!`);
        }
      } catch (error) {
        message.warning("Đã có lỗi xảy ra! Vui lòng thử lại.");
      }
    } else {
      try {
        const payloadUpdate = {
          id: item.id,
          ...payload,
        };
        const res = await requestUpdateVoucher(payloadUpdate);
        if (res) {
          setVisible(0);
          getData();
          showToast(`Cập nhật thành công!`);
        }
      } catch (error) {
        message.warning("Đã có lỗi xảy ra! Vui lòng thử lại.");
      }
    }
  };

  useEffect(() => {
    checkToken().then((res) => {
      if (res) return getData();
      navigate("/login");
      showToast("Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.");
    });
  }, []);
  return (
    <div style={{ marginTop: 10 }}>
      <PageHeader
        title="Mã giảm giá"
        style={{ backgroundColor: "white", margin: "5px 10px 10px" }}
        extra={[
          <Header
            showButton={true}
            onClick={() => {
              setVisible(1);
              form.resetFields();
            }}
          />,
        ]}
      />
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
        <div
          style={{
            backgroundColor: "white",
            margin: "0px 10px 0px",
            padding: "15px 20px",
          }}
        >
          <Table
            dataSource={listAdmin}
            // onExpand={async (expanded: boolean, record: any) => {
            //   await getUserDetail(record.id);
            // }}
            bordered
            rowKey={(_, index) => `${index}`}
            columns={COLUMNS_ADMIN}
            //   expandedRowKeys={[currentSelected.id]}
            expandRowByClick={true}
            //   expandedRowKeys={[currentSelected.id]}
            //   onRow={(r) => ({
            //     onClick: () => {
            //       reactotron.log!(r);
            //       if (currentSelected !== r._id) setCurrentSelected(r._id);
            //       else setCurrentSelected({ id: -1 });
            //     },
            //   })}
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
                          item.status == "Reject" || item.status == "Success"
                        }
                        onClick={() => {
                          setVisible(2);
                          setItem(item);
                          form.setFieldsValue({
                            ...item,
                          });
                        }}
                        type="text"
                        size="large"
                        icon={<EditFilled />}
                      >
                        Chỉnh sửa
                      </Button>,
                      <Popconfirm
                        title={"Bạn chắc chắn muốn xoá yêu cầu này không?"}
                        onConfirm={() => handleDeleteAccount(item)}
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
                      children={"Thông tin giảm giá"}
                    />
                    <Row style={{ marginTop: 20 }}>
                      <Col flex={1}>
                        <h4>
                          Mã giảm giá sẽ giảm{" "}
                          <span style={{ color: "blue" }}>
                            {item.discount_type == "FIXED"
                              ? formatPrice(item.discount)
                              : item.discount}{" "}
                            {item.discount_type == "FIXED" ? "VND" : "%"}{" "}
                          </span>
                          được áp dụng cho đơn hàng có giá trị{" "}
                          <span style={{ color: "red" }}>
                            {formatPrice(item.minium_price)}
                          </span>
                          .
                        </h4>
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
        </div>
      )}
      <ModalForm
        visible={visile}
        title={visile == 1 ? "Thêm mã giảm giá mới" : "Chỉnh sửa mã giảm giá"}
        onCancel={() => {
          setVisible(0);
        }}
        children={
          <>
            {true && (
              <Form
                {...FORM_ITEM_LAYOUT_STAFF}
                form={form}
                name="register"
                labelAlign="left"
                onFinish={handleAddAccountadmin}
                initialValues={{}}
                scrollToFirstError
                children={
                  <>
                    <Form.Item
                      label={"Code"}
                      name="code"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mã code!",
                        },
                        {
                          min: 4,
                          message: "Mã giảm giá tối thiểu 4 kí tự ",
                        },
                        {
                          max: 8,
                          message: "Mã giảm giá tối đa là 8 kí tự",
                        },
                      ]}
                    >
                      <Input placeholder={"Vui lòng nhập mã code"} />
                    </Form.Item>
                    <Form.Item
                      label={"Giảm giá theo"}
                      name={"discount_type"}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn giá trị",
                        },
                      ]}
                    >
                      <Select>
                        <Option value="FIXED">Giá tiền</Option>
                        <Option value="PERCENTAGE">Phần trăm</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label={"Giá trị giảm"}
                      name="discount"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập giá trị giảm!",
                        },
                        {
                          pattern: new RegExp(/^[0-9]*$/g),
                          message: "Vui lòng chỉ nhập số",
                        },
                      ]}
                    >
                      <Input placeholder={"Nhập giá trị giảm giá "} />
                    </Form.Item>
                    <Form.Item
                      label={"Đơn hàng tối thiểu"}
                      name="minium_price"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập giá trị",
                        },
                        {
                          pattern: new RegExp(/^[0-9]*$/g),
                          message: "Vui lòng chỉ nhập số",
                        },
                      ]}
                    >
                      <Input placeholder={"Nhập giá trị đơn hàng tối thiểu "} />
                    </Form.Item>
                    <Form.Item
                      label={"Loại mã giảm giá"}
                      name={"type"}
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn loại mã giảm giá",
                        },
                      ]}
                    >
                      <Select>
                        <Option value="USER">Mã giảm của shop</Option>
                        <Option value="SHOP">Mã giảm của shopee</Option>
                      </Select>
                    </Form.Item>

                    <Row justify="end">
                      <Button
                        style={{
                          fontWeight: 800,
                          borderRadius: "3px",
                          marginRight: 10,
                        }}
                        danger
                        type="primary"
                        children={"Huỷ"}
                        onClick={() => setVisible(0)}
                      />
                      <Form.Item>
                        <Button
                          style={{
                            fontWeight: 800,
                            borderRadius: "3px",
                          }}
                          type="primary"
                          htmlType="submit"
                          children={visile == 1 ? "Xác nhận" : "Cập nhật"}
                        />
                      </Form.Item>
                    </Row>
                  </>
                }
              />
            )}
            {/* {visile == 2 && (
              <div>
                <Row>
                  Mật khẩu của bạn sẽ được đặt về mặc định là:
                  <h4 style={{ color: "red" }} children={" 123456"} />
                </Row>
                <Button
                  onClick={() => handleResetPassword(item)}
                  style={{
                    fontWeight: 800,
                    borderRadius: "3px",
                    marginTop: 10,
                  }}
                  type="primary"
                  htmlType="submit"
                  children={"Đặt lại"}
                />
              </div>
            )} */}
          </>
        }
      />
    </div>
  );
}
