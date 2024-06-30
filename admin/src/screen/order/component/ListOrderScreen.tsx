import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Spin,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import R from "../../../component/assets";
import reactotron from "../../../ReactotronConfig";
import {
  requestCompleteOrder,
  requestDefrost,
  requestDeleteListOrder,
  requestFrozen,
  requestGetListOrder,
  requestGetListProduct,
  requestProcessOrder,
  requestRemoveOrder,
} from "../../../service/network/Api";
import DateUtil from "../../../util/DateUtil";
import { formatPrice, showToast } from "../../../util/funcUtils";
import {
  DeleteFilled,
  CheckCircleOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import {
  COLUMNS_ORDER,
  COLUMNS_PRODUCT,
  convertVndToDollar,
  handleConvertKeyStatusOrder,
  handleConvertValueStatusOrder,
  UNIT,
} from "../../../config/constants";
import ButtonBottomModal from "../../product/component/ButtonBottomModal";
import { URL_IMAGE } from "../../../service/ApiService";

const { Option } = Select;

const ListOrderScreen = (props: any) => {
  const { tabs, statusOrder, date } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(0);
  const [item, setItem] = useState<any>({});
  const [productIds, setProductIds] = useState<any>(undefined);
  const [listOrder, setListOrder] = useState<any>([]);
  const [listProduct, setListProduct] = useState<any>([]);
  const [totalPriceOrder, setTotalPriceOrder] = useState<any>();
  const [page, setPage] = useState<any>(1);
  const [totalPage, setTotalPage] = useState<any>(undefined);
  const [loadMore, setLoadMore] = useState<any>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [userIds, setUserIds] = useState<any>([]);

  const getData = async () => {
    setIsLoading(true);
    const payload = {
      page: page,
      limit: 1000,
      from: date[0],
      to: date[1],
      status: handleConvertValueStatusOrder(tabs),
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

  const handlePendingOrder = async () => {
    reactotron.logImportant!("item", item);
    let payload = {
      id: item._id,
      product_ids: productIds,
    };

    reactotron.logImportant!("payload", payload);
    // return;
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

  const getListProduct = async (PAGE: number) => {
    setLoadMore(true);
    const payload = {
      page: PAGE,
      limit: undefined,
      from: undefined,
      to: undefined,
      name: undefined,
      sort_by: undefined,
    };
    try {
      const res = await requestGetListProduct();
      reactotron.logImportant!("LIST_PRODUCT", res);
      if (res) {
        setLoadMore(false);
        setTotalPage(res.meta.pagination.total_pages);
        if (page == 1) setListProduct(res.data);
        if (page > 1) {
          let data = listProduct;
          data = data.concat(res.data);
          setListProduct(data);
        }
      }
    } catch (error) {}
  };
  const handleSelectID = (arrIndex: []) => {
    var arrID: any = [];
    var arrProducts: any = [];
    var TotalPrice;
    arrIndex.map((item) => {
      arrID.push(listProduct[item]?._id);
      arrProducts.push(listProduct[item]);
    });
    TotalPrice = arrProducts.reduce((accumulator: any, object: any) => {
      return accumulator + object.price;
    }, 0);
    setTotalPriceOrder(TotalPrice);
    setProductIds(arrID);
  };

  const handleFrozen = async (item: any, status: any) => {
    try {
      const res =
        status == "Success"
          ? await requestFrozen(item._id)
          : await requestDefrost(item._id);
      if (res) {
        setVisible(0);
        showToast(
          status == "Success"
            ? "Đóng băng đơn hàng thành công!"
            : "Mở đóng băng đơn hàng thành công!"
        );
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
    getData();
  }, [tabs, date]);

  useEffect(() => {
    getListProduct(page);
  }, [page]);

  reactotron.logImportant!("listProduct", listProduct);
  return (
    <div
      style={{
        height: "76vh",
        width: "100%",
      }}
    >
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
          // onExpand={async (expanded: boolean, record: any) => {
          //   await getUserDetail(record.id);
          // }}
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
                    <Popconfirm
                      title={
                        item.status == "Success"
                          ? `Bạn chắc chắn muốn "Đóng băng" đơn này không?`
                          : `Bạn chắc chắn muốn "Mở đóng băng" đơn này không?`
                      }
                      onConfirm={() => {
                        handleFrozen(item, item.status);
                      }}
                      okText="Đồng ý"
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
                        icon={<ApiOutlined />}
                        style={{
                          color: item.status == "Success" ? "orange" : "green",
                        }}
                      >
                        {item.status == "Success"
                          ? "Đóng băng"
                          : "Mở đóng băng"}
                      </Button>
                    </Popconfirm>,
                    <Button
                      disabled={
                        item.status == "Pending" ||
                        item.status == "Processing" ||
                        item.status == "Success" ||
                        item.status == "Frozen"
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
                          item.status == "Success" ||
                          item.status == "Frozen"
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
                      <h4>Cấp độ: {item.user?.level || "Chưa cập nhật"}</h4>
                      <h4>
                        Số dư tài khoản: {formatPrice(item.user?.balance) || 0}{" "}
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
              width: 500,
            }}
          >
            <Col style={{ width: "80%" }}>
              <label
                style={{ fontWeight: "bolder", color: "GrayText" }}
                children={"Sản phẩm"}
              />
              <Select
                mode="multiple"
                allowClear
                placeholder={"Chọn sản phẩm"}
                style={{ width: "100%", marginTop: 8 }}
                onChange={(value) => {
                  handleSelectID(value);
                }}
                onPopupScroll={(event: any) => {
                  let isEndOfList =
                    event.target.scrollTop >= 0.8 * event.target.scrollHeight;
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
                          <h3>
                            [{index + 1}]{item.name + " "}
                          </h3>
                          <h4 style={{ color: "red" }}>
                            {"- Giá:" +
                              formatPrice(item.price.toFixed(2)) +
                              UNIT}
                          </h4>
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
                children={"Tổng giá đơn"}
              />
              <Input
                disabled
                value={formatPrice(totalPriceOrder.toFixed(2)) + UNIT}
                style={{ marginTop: 8 }}
                placeholder=""
              />
            </Col>
            {/* <Col style={{ width: "50%", marginTop: 15 }}>
              <label
                style={{ fontWeight: "bolder", color: "GrayText" }}
                children={"Ảnh sản phẩm"}
              />
              <img
                crossOrigin="anonymous"
                src={
                  itemProduct.image
                    ? `${URL_IMAGE}/${itemProduct.image}`
                    : R.images.img_image_empty
                }
                style={{
                  width: 150,
                  height: 150,
                  marginTop: 10,
                  resize: "vertical",
                }}
              />
            </Col> */}
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

export default ListOrderScreen;
