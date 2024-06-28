import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  PageHeader,
  Popconfirm,
  Row,
  Select,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  COLUMNS_ORDER,
  handleConvertKeyStatusOrder,
  handleConvertValueStatusOrder,
  UNIT,
} from "../../config/constants";
import reactotron from "../../ReactotronConfig";
import {
  requestCompleteOrder,
  requestDeleteListOrder,
  requestGetListOrder,
  requestGetListProduct,
  requestProcessOrder,
  requestRemoveOrder,
} from "../../service/network/Api";
import { formatPrice, showToast } from "../../util/funcUtils";
import { Header } from "../dashboard/component/Header";
import { DeleteFilled, CheckCircleOutlined } from "@ant-design/icons";
import DateUtil from "../../util/DateUtil";
import ButtonBottomModal from "../product/component/ButtonBottomModal";
import { URL_IMAGE } from "../../service/ApiService";
import R from "../../component/assets";

const OrderCustomerScreen = () => {
  const [searchparams] = useSearchParams();
  const userId = searchparams.get("userId");
  const [listOrder, setListOrder] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(0);
  const [item, setItem] = useState<any>({});
  const [listProduct, setListProduct] = useState([]);
  const [itemProduct, setItemProduct] = useState<any>([]);
  const [page, setPage] = useState<any>(1);
  const [totalPage, setTotalPage] = useState<any>(undefined);
  const { Option } = Select;
  const [status, setStatus] = useState("");
  const [fromDaytoDay, setFromDaytoDay] = useState<any>([]);
  const [loadMore, setLoadMore] = useState<any>(false);
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [userIds, setUserIds] = useState<any>([]);

  const getData = async () => {
    setIsLoading(true);
    const payload = {
      page: page,
      limit: 1000,
      from: fromDaytoDay[0],
      to: fromDaytoDay[1],
      status: handleConvertValueStatusOrder(status),
      user_id: userId,
    };
    try {
      const res = await requestGetListOrder(payload);
      if (res) {
        setIsLoading(false);
        reactotron.logImportant!("List_Order", res);
        setListOrder(res.data);
      }
    } catch (error) {
      setIsLoading(false);
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };
  const handleDeleteOrder = async (item: any) => {
    try {
      const res = await requestRemoveOrder(item._id);
      if (res) {
        showToast("Xoá đơn hàng thành công!");
        getData();
      }
    } catch (error) {
      setIsLoading(false);
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };
  const handleConfirmOrder = async () => {
    try {
      const res = await requestCompleteOrder(item._id);
      if (res) {
        setVisible(0);
        showToast("Hoàn tiền cho đơn hàng thành công!");
        getData();
      }
    } catch (error) {
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };
  const getListProduct = async () => {
    setLoadMore(true);
    const payload = {
      page: page,
      limit: 20,
      from: undefined,
      to: undefined,
      name: undefined,
      sort_by: undefined,
    };
    try {
      const res = await requestGetListProduct(payload);
      reactotron.logImportant!("LIST_PRODUCT", res);
      if (res) {
        setLoadMore(false);
        setTotalPage(res.meta.pagination.total_pages);
        if (page == 1) setListProduct(res.data);
        if (page > 1) setListProduct(listProduct.concat(res.data));
      }
    } catch (error) {}
  };

  const handlePendingOrder = async () => {
    reactotron.logImportant!("item", item);
    let payload = {
      id: item._id,
      productId: itemProduct._id,
    };

    try {
      const res = await requestProcessOrder(payload);
      if (res) {
        setVisible(0);
        showToast("Phê duyệt đơn hàng thành công!");
        getData();
      }
    } catch (error) {
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    let user_ids: any = [];
    newSelectedRowKeys.map((el: any) => {
      return user_ids.push(listOrder[+el]?._id);
    });
    console.log("user_ids: ", user_ids);
    setUserIds(user_ids);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleDeleteListUser = async () => {
    console.log("====================================");
    console.log("asadasda", userIds);
    console.log("====================================");
    // return;
    try {
      const res = await requestDeleteListOrder({ order_ids: userIds });
      if (res) {
        showToast("Xoá đơn hàng thành công!");
        getData();
        setUserIds([]);
        setSelectedRowKeys([]);
      }
    } catch (error) {
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    getListProduct();
  }, [page]);
  useEffect(() => {
    getData();
  }, [userId, status, fromDaytoDay]);

  return (
    <div style={{ marginTop: 10 }}>
      <PageHeader
        onBack={() => {
          navigate(-1);
        }}
        title="Lịch sử đơn hàng"
        style={{ backgroundColor: "white", margin: "5px 10px 10px" }}
        extra={[
          <Header
            onStatusSubmit={(statusKey: string) => {
              setStatus(statusKey);
            }}
            placeholderDrop={"Trạng thái"}
            dataDropdown={[
              {
                name: "Tất cả",
              },
              {
                name: "Chờ xử lý",
              },
              {
                name: "Đang xử lý",
              },
              {
                name: "Chờ hoàn tiền",
              },
              {
                name: "Hoàn thành",
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
        {userIds?.length ? (
          <Button
            onClick={handleDeleteListUser}
            type="primary"
            htmlType="submit"
            style={{
              fontWeight: 800,
              borderRadius: "5px",
              backgroundColor: "#00abba",
              borderColor: "#00abba",
              height: "35px",
              marginBottom: 10,
              marginTop: -20,
            }}
          >
            Xoá
          </Button>
        ) : null}
        <Table
          dataSource={listOrder}
          loading={isLoading}
          bordered
          rowKey={(_, index) => `${index}`}
          columns={COLUMNS_ORDER}
          expandRowByClick={true}
          rowSelection={rowSelection}
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
                        item.status == "Success" ||
                        item.status == "Processing" ||
                        item.status == "Frozen"
                      }
                      onClick={() => {
                        setVisible(1);
                        setItem(item);
                      }}
                      type="text"
                      size="large"
                      icon={<CheckCircleOutlined color="red" />}
                      style={{
                        color:
                          item.status == "Success" ||
                          item.status == "Processing" ||
                          item.status == "Frozen"
                            ? undefined
                            : "#1890ff",
                      }}
                    >
                      Phê duyệt
                    </Button>,
                    <Button
                      disabled={
                        item.status == "Pending" ||
                        item.status == "Processing" ||
                        item.status == "Success"
                      }
                      onClick={() => {
                        setVisible(2);
                        setItem(item);
                      }}
                      type="text"
                      size="large"
                      icon={<CheckCircleOutlined color="red" />}
                      style={{
                        color:
                          item.status == "Pending" ||
                          item.status == "Processing" ||
                          item.status == "Success"
                            ? undefined
                            : "orange",
                      }}
                    >
                      Hoàn tiền
                    </Button>,
                    <Popconfirm
                      title={"Bạn chắc chắn muốn xoá đơn này không?"}
                      onConfirm={() => {
                        handleDeleteOrder(item);
                      }}
                      okText="Xoá"
                      cancelText="Quay lại"
                      okButtonProps={{
                        danger: true,
                        type: "primary",
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
                    children={"Thông tin khách hàng"}
                  />
                  <Row style={{ marginTop: 20 }}>
                    <Col flex={1}>
                      <h4>id: {item.user?._id}</h4>
                      <h4>Số điện thoại: {item.user?.phone}</h4>
                    </Col>
                    <Col flex={1}>
                      <h4>Cấp độ: {item.user?.level}</h4>
                      <h4>
                        Số dư tài khoản:{" "}
                        {formatPrice(item.user?.balance.toFixed(2))}
                        {UNIT}
                      </h4>
                    </Col>
                    <Col flex={1} style={{ marginTop: 5 }}>
                      <Row>
                        <h4> Trạng thái: </h4>
                        <Tag
                          style={{ height: 22, marginLeft: 5 }}
                          color={
                            item.status == "Pending"
                              ? "blue"
                              : item.status == "Processing"
                              ? "yellow"
                              : item.status == "Success"
                              ? "green"
                              : "orange"
                          }
                        >
                          {`${handleConvertKeyStatusOrder(item.status)}`}
                        </Tag>
                      </Row>
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
      <Modal
        onCancel={() => {
          setVisible(0);
        }}
        maskClosable={false}
        footer={null}
        title={visible == 1 ? "Thêm sản phẩm" : "Xác nhận hoàn tiền"}
        visible={visible == 1 || visible == 2}
      >
        {visible == 1 ? (
          <div
            style={{
              marginBottom: 30,
            }}
          >
            <Col style={{ width: "80%" }}>
              <label
                style={{ fontWeight: "bolder", color: "GrayText" }}
                children={"Sản phẩm"}
              />
              <Select
                // allowClear={}
                placeholder={"Chọn sản phẩm"}
                style={{ width: "100%", marginTop: 8 }}
                onChange={(value) => {
                  setItemProduct(listProduct[value]);
                }}
                onPopupScroll={(event: any) => {
                  let isEndOfList =
                    event.target.scrollTop >= 0.5 * event.target.scrollHeight;
                  if (isEndOfList && page != totalPage) {
                    if (!loadMore) {
                      setPage((prev: any) => (prev = page + 1));
                      return;
                    }
                    setPage(page);
                  }
                }}
              >
                {listProduct.map((item: any, index: number) => {
                  return (
                    <Option value={index}>
                      {
                        <Row>
                          <Col>
                            <h3>
                              [{index + 1}]{item.name}
                            </h3>{" "}
                            <h4 style={{ color: "red" }}>
                              Giá: {formatPrice(item.price.toFixed(2)) + UNIT}
                            </h4>
                          </Col>
                        </Row>
                      }
                    </Option>
                  );
                })}
              </Select>
            </Col>
            <Col style={{ width: "80%", marginTop: 15 }}>
              <label
                style={{ fontWeight: "bolder", color: "GrayText" }}
                children={"Giá"}
              />
              <Input
                disabled
                value={formatPrice(itemProduct.price.toFixed(2)) + UNIT}
                style={{ marginTop: 8 }}
                placeholder=""
              />
            </Col>
            <Col style={{ width: "50%", marginTop: 15 }}>
              <label
                style={{ fontWeight: "bolder", color: "GrayText" }}
                children={"Ảnh sản phẩm"}
              />
              <img
                crossOrigin="anonymous"
                src={
                  itemProduct.image
                    ? `${URL_IMAGE}${itemProduct.image}`
                    : R.images.img_image_empty
                }
                style={{
                  width: 150,
                  height: 150,
                  marginTop: 10,
                  resize: "vertical",
                }}
              />
            </Col>
          </div>
        ) : null}
        {visible == 2 && (
          <div style={{ marginBottom: 20 }}>
            <h2>Bạn có chắc chắn muốn hoàn tiền cho đơn hàng này không?</h2>
          </div>
        )}
        <ButtonBottomModal
          text={visible == 1 ? "Xác nhận" : "Hoàn tiền"}
          isLoadingButton={false}
          onCancel={() => {
            setVisible(0);
          }}
          onClickconfirm={() => {
            if (visible == 1) return handlePendingOrder();
            handleConfirmOrder();
          }}
        />
      </Modal>
    </div>
  );
};

export default OrderCustomerScreen;
