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
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { COLUMNS_PRODUCT, UNIT } from "../../config/constants";
import reactotron from "../../ReactotronConfig";
import { Header } from "../dashboard/component/Header";
import {
  CheckCircleOutlined,
  DeleteFilled,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import DateUtil from "../../util/DateUtil";
import { formatPrice, showToast } from "../../util/funcUtils";
import {
  requestAddProductToVip,
  requestDeleteProductVip,
  requestGetListCategory,
  requestGetListProduct,
  requestGetListProductVip,
} from "../../service/network/Api";
import { URL_IMAGE } from "../../service/ApiService";
import R from "../../component/assets";
import ButtonBottomModal from "../product/component/ButtonBottomModal";
const { Option } = Select;
const VipDetailScreen = () => {
  const [searchparams] = useSearchParams();
  const key: any = searchparams.get("key");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [listProductVip, setListProductVip] = useState<any>();
  const [listProduct, setListProduct] = useState([]);
  const [visible, setVisible] = useState(false);
  const [idProduct, setIdProduct] = useState<any>(1);
  const [loadMore, setLoadMore] = useState<any>(false);
  const [totalPage, setTotalPage] = useState<any>(undefined);
  const [page, setPage] = useState<any>(1);
  const [listCategory, setListCategory] = useState<any>([]);
  const [itemCategory, setItemCategory] = useState<any>([]);

  const handleDeleteProduct = async (id: any) => {
    const payload = {
      key: key,
      productId: id,
    };

    try {
      const res = await requestDeleteProductVip(payload);
      if (res) {
        var lists = listProductVip.filter((item: any) => {
          return item._id != id;
        });
        setListProductVip(lists);
        showToast("Xoá sản phẩm thành công!");
      }
    } catch (error) {}
  };

  const handleAddProduct = async () => {
    let data = [];
    const payload = {
      key: key,
      productId: idProduct._id,
      category_id: itemCategory._id,
    };
    try {
      const res = await requestAddProductToVip(payload);
      if (res) {
        setListProductVip(res.data.products);
        showToast("Thêm sản phẩm thành công!");
        setVisible(false);
        setIdProduct({});
      }
    } catch (error) {
      setIdProduct({});
    }
  };

  const getListProductVip = async () => {
    try {
      const res = await requestGetListProductVip(key);
      if (res) {
        setListProductVip(res?.data?.products);
      }
    } catch (error) {}
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
      const res = await requestGetListProduct(payload);
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

  const getListCateory = async () => {
    const payload = {
      page: 1,
      limit: 1000,
      from: "",
      to: "",
      name: "",
    };
    try {
      const res = await requestGetListCategory(payload);
      if (res) {
        setListCategory(res.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getListCateory();
  }, []);
  useEffect(() => {
    getListProductVip();
  }, []);

  useEffect(() => {
    getListProduct(page);
  }, [page]);

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
          // scroll={{
          //   x:,
          //   y:,
          // }}
          style={{ height: "90vh" }}
          loading={isLoading}
          dataSource={listProductVip}
          bordered
          rowKey={(_, index) => `${index}`}
          columns={COLUMNS_PRODUCT}
          expandRowByClick={true}
          pagination={
            {
              // pageSize: LIMIT,
              // total: totalPage,
              // onChange: (page) => {
              //   setPage(page);
              // },
            }
          }
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
                    <Popconfirm
                      title={"Bạn chắc chắn muốn xoá sản phẩm này không?"}
                      onConfirm={() => {
                        handleDeleteProduct(item._id);
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
                    children={"Thông tin tài khoản"}
                  />
                  <Row style={{ marginTop: 20 }}>
                    <Col flex={1}>
                      <h4>Tên sản phẩm: {item.name}</h4>
                    </Col>
                    <Col flex={1}>
                      <h4>Giá: {formatPrice(item.price) + UNIT}</h4>
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
          }}
        />
      </div>
    );
  };

  const renderModal = () => {
    return (
      <Modal
        onCancel={() => {
          setVisible(false);
        }}
        maskClosable={false}
        footer={null}
        title={"Thêm Sản phẩm"}
        visible={visible}
      >
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
              value={idProduct.name}
              // allowClear
              placeholder={"Chọn sản phẩm"}
              style={{ width: "100%", marginTop: 8 }}
              onChange={(value) => {
                setIdProduct(listProduct[value]);
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
                      <Col>
                        <h3>
                          [{index + 1}]{item.name}
                        </h3>
                        <h4 style={{ color: "red" }}>
                          {"Giá:" + formatPrice(item.price) + UNIT}
                        </h4>
                      </Col>
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
              value={formatPrice(idProduct.price) + UNIT}
              style={{ marginTop: 8 }}
              placeholder=""
            />
          </Col>
          {/* <Col style={{ width: "80%", marginTop: 15 }}>
            <label
              style={{ fontWeight: "bolder", color: "GrayText" }}
              children={"Danh mục"}
            />
            <Select
              value={itemCategory?.name}
              allowClear
              placeholder={"Chọn danh mục"}
              style={{ width: "100%", marginTop: 8 }}
              onChange={(value) => {
                setItemCategory(listCategory[value]);
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
              {listCategory.map((item: any, index: number) => {
                return (
                  <Option value={index}>
                    {
                      <Col>
                        <h3>
                          [{index + 1}]{item.name}
                        </h3>
                      </Col>
                    }
                  </Option>
                );
              })}
            </Select>
          </Col> */}
          <Col style={{ width: "60%", marginTop: 15 }}>
            <div>
              <label
                style={{ fontWeight: "bolder", color: "GrayText" }}
                children={"Ảnh sản phẩm"}
              />
            </div>
            <img
              crossOrigin="anonymous"
              src={
                idProduct.image
                  ? `${URL_IMAGE}/${idProduct.image}`
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
        <ButtonBottomModal
          text={"Xác nhận"}
          isLoadingButton={false}
          onCancel={() => {
            setIdProduct({});
          }}
          onClickconfirm={() => {
            handleAddProduct();
          }}
        />
      </Modal>
    );
  };

  return (
    <div style={{ marginTop: 10 }}>
      <PageHeader
        onBack={() => {
          navigate(-1);
        }}
        title="Danh sách sản phẩm"
        style={{ backgroundColor: "white", margin: "5px 10px 10px" }}
        extra={[
          <Header
            onStatusSubmit={(statusKey: string) => {}}
            showButton={true}
            onClick={() => {
              setVisible(true);
            }}
          />,
        ]}
      />
      {renderTable()}
      {renderModal()}
    </div>
  );
};

export default VipDetailScreen;
