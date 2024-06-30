import { DeleteFilled } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  PageHeader,
  Popconfirm,
  Row,
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
} from "../../service/network/Api";
import DateUtil from "../../util/DateUtil";
import { showToast } from "../../util/funcUtils";
import { Header } from "../dashboard/component/Header";

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

  const handleResetPassword = async (item: any) => {
    const payload = {
      id: item._id,
      body: {
        password: "123456",
      },
    };
    try {
      const res = await requestResetPassword(payload);
      if (res) {
        setVisible(0);
        getData();
        showToast("Đặt lại mật khẩu thành công!");
      }
    } catch (error) {
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };
  const handleDeleteAccount = async (item: any) => {
    try {
      const res = await requestDeleteAccountAdmin(item._id);
      if (res) {
        getData();
        showToast(`Đã xoá tài khoản "${item.identifier}" ra khỏi hệ thống!`);
      }
    } catch (error) {
      message.warning("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  const handleAddAccountadmin = async (values: any) => {
    const { identifier, password } = values;
    const payload = {
      identifier,
      password,
    };
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
        title="Quản trị viên"
        style={{ backgroundColor: "white", margin: "5px 10px 10px" }}
        extra={[
          <Header
            showButton={true}
            onClick={() => {
              setVisible(1);
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
                        }}
                        type="text"
                        size="large"
                        icon={
                          <img
                            src={R.images.img_reset_password}
                            style={{ width: 20, height: 20, marginRight: 10 }}
                          />
                        }
                      >
                        Đặt lại mật khẩu
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
                      children={"Thông tin tài khoản"}
                    />
                    <Row style={{ marginTop: 20 }}>
                      <Col flex={1}>
                        <h4>id: {item._id}</h4>
                      </Col>
                      <Col flex={1}>
                        <h4>Tên: {item.identifier}</h4>
                      </Col>
                      <Col flex={1}>
                        <h4>
                          Ngày tạo:{" "}
                          {DateUtil.formatTimeDateReview(item.created_at)}
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
        title={"Thêm mới tài khoản quản trị viên"}
        onCancel={() => {
          setVisible(0);
        }}
        children={
          <>
            {visile == 1 && (
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
                      label={"Tên tài khoản"}
                      name="identifier"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên tài khoản!",
                        },
                      ]}
                    >
                      <Input placeholder={"Nhập tên tài khoản"} />
                    </Form.Item>
                    <Form.Item
                      label={"Mật khẩu"}
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mật khẩu!",
                        },
                      ]}
                    >
                      <Input placeholder={"Nhập mật khẩu"} />
                    </Form.Item>
                    <Form.Item
                      label={"Xác nhận mật khẩu"}
                      name="re-password"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập lại mật khẩu!",
                        },
                      ]}
                    >
                      <Input placeholder={"Nhập lại mật khẩu"} />
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
                          children={"Xác nhận"}
                        />
                      </Form.Item>
                    </Row>
                  </>
                }
              />
            )}
            {visile == 2 && (
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
            )}
          </>
        }
      />
    </div>
  );
}
