import {
  CheckCircleOutlined,
  DeleteFilled,
  LoadingOutlined,
  OrderedListOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Modal,
  PageHeader,
  Popconfirm,
  Row,
  Select,
  Table,
  Upload,
} from "antd";
import { RcFile } from "antd/lib/upload";
import React, { useEffect, useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import R from "../../component/assets";
import { COLUMNS_VIP, UNIT } from "../../config/constants";
import { ADMIN_ROUTER_PATH } from "../../config/router";
import reactotron from "../../ReactotronConfig";
import axiosInstance, { ApiClient, URL_IMAGE } from "../../service/ApiService";
import {
  requestAddProductToVip,
  requestAddVip,
  requestDeleteVip,
  requestGetListCategory,
  requestGetListLevel,
  requestGetListProduct,
  requestUpdateInfoVip,
  requestUploadImage,
} from "../../service/network/Api";
import DateUtil from "../../util/DateUtil";
import { formatPrice, showToast } from "../../util/funcUtils";
// import { uploadImageToServer } from "../../util/uploadImageToServer";
import { Header } from "../dashboard/component/Header";
import ButtonBottomModal from "../product/component/ButtonBottomModal";
import path from "path";

const { Option } = Select;

const OPTION = {
  UPDATE: 1,
  ADD: 2,
};

const VipScreen = (props: any) => {
  const [fromDaytoDay, setFromDaytoDay] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState(undefined);
  const [listVip, setListVip] = useState([]);
  const [visible, setVisible] = useState(0);
  const [loadMore, setLoadMore] = useState<any>(false);
  const [totalPage, setTotalPage] = useState<any>(undefined);
  const [listProduct, setListProduct] = useState<any>([]);
  const [page, setPage] = useState<any>(1);
  const [idProduct, setIdProduct] = useState<any>();
  const [itemVip, setItemVip] = useState<any>(1);
  const [imageUpload, setImageUpload] = useState<any>();
  const [priority, setPriority] = useState<any>(undefined);
  const [listCategory, setListCategory] = useState<any>([]);
  const [listImages, setListImages] = useState<any>(
    Array.from(Array(1).keys()).map((i) => {
      return {
        id: i,
        fileList: [],
        buffer: null,
        url: "",
      };
    })
  );
  const navigate = useNavigate();
  const [upload, setUpload] = useState<any>({
    loading: false,
    imageUrl: "",
  });
  const [infoVip, setInfoVip] = useState<any>({
    price: "",
    name: "",
    number_of_cash_out_per_day: "",
    limit_amount_cash_out_per_day: "",
    order_quantity_per_day: "",
    commission_percent: "",
  });

  const [isShowModalPreview, setShowModalPreview] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const getData = async () => {
    setIsLoading(true);
    const payload = {
      page: 1,
      limit: 1000,
      from: fromDaytoDay[0],
      to: fromDaytoDay[1],
      name: search,
    };
    try {
      const res = await requestGetListLevel(payload);
      reactotron.logImportant!("LIST_VIP", res);
      if (res) {
        setIsLoading(false);
        setListVip(res.data);
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

  const handleChangeImage = async (file: any, index: number) => {
    // case remove image
    if (file.file.status === "removed") {
      listImages[index].fileList = [];
      listImages[index].url = "";
      setListImages([...listImages]);
      return;
    }
    const isLt3M = file.file.type ? file.file.size / 1024 / 1024 < 3 : true;
    const isJpgOrPng =
      file.file.type === "image/jpeg" || file.file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Bạn chỉ có thể upload ảnh có định dạng JPG/PNG!");
      return;
    } else if (!isLt3M) {
      message.error("Dung lượng ảnh tối đa là 3MB!");
      return;
    }
    // case uploading image
    if (file?.fileList[0]?.status === "uploading") {
      listImages[index].fileList = file.fileList || [];
      setListImages([...listImages]);
    }
    // case upload image
    else if (file.file.status !== "removed") {
      try {
        // const res = await uploadImageToServer(file.file);'
        const res = {
          path: "uploads/1643714526.png",
        };
        console.log("res: ", res);
        listImages[index].fileList = [
          {
            status: "done",
            size: "10000",
            type: "image/jpeg",
            uid: index,
            crossOrigin: "anonymous",
            url: URL_IMAGE + "/" + res?.path,
            path: URL_IMAGE + "/" + res?.path,
          },
        ];
        listImages[index].url = URL_IMAGE + "/" + res?.path;
        console.log("listImages: ", listImages);
        setListImages([...listImages]);
      } catch (error) {
        message.error(
          "Tải ảnh thất bại, vui lòng kiểm tra kết nối và thử lại."
        );
      }
    }
  };

  const handlePreviewImage = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setShowModalPreview(true);
  };

  const handleUpdateInfoVip = async (visible: any) => {
    try {
      if (visible == OPTION.UPDATE && upload.imageUrl.includes("uploads")) {
        const payload = {
          key: itemVip.key,
          body: {
            ...infoVip,
            priority: itemVip.priority,
            commission_percent: +infoVip.commission_percent,
            background_urls: listImages.map((item: any) =>
              item.url.slice(URL_IMAGE.length + 1)
            ),
          },
        };

        const res = await requestUpdateInfoVip(payload);
        if (res) {
          setVisible(0);
          getData();
          setItemVip({});
          setInfoVip({});
          showToast("Cập nhật thông tin thành công!");
        }
        return;
      }
      if (visible === OPTION.UPDATE) {
        const payload = {
          key: itemVip.key,
          body: {
            ...infoVip,
            commission_percent: +infoVip.commission_percent,
            priority: itemVip.priority,
            background_urls: listImages.map((item: any) =>
              item.url.slice(URL_IMAGE.length + 1)
            ),
          },
        };
        console.log("payload_visible_1", payload);
        // return;
        const res = await requestUpdateInfoVip(payload);
        if (res) {
          setVisible(0);
          getData();
          setItemVip({});
          setInfoVip({});
          showToast("Cập nhật thông tin thành công!");
        }
        return;
      }
      if (visible === 3) {
        const payload = {
          ...infoVip,
          key: new Date().getTime().toString(),
          priority,
          commission_percent: +infoVip.commission_percent,
          background_urls: listImages.map((item: any) =>
            item.url.slice(URL_IMAGE.length + 1)
          ),
        };
        console.log("payload_visible_3", payload);
        // return;
        const res = await requestAddVip(payload);
        if (res) {
          setVisible(0);
          getData();
          setItemVip({});
          setInfoVip({});
          showToast("Thêm thành công!");
        }
        return;
      }

      return;
    } catch (error) {
    } finally {
      handleCancelModal();
    }
  };
  const handleAddProduct = async () => {
    const payload = {
      key: itemVip.key,
      productId: idProduct._id,
    };
    try {
      const res = await requestAddProductToVip(payload);
      if (res) {
        setPriority(undefined);
        setVisible(0);
        getData();
        setIdProduct({});
      }
    } catch (error) {
      setIdProduct({});
    } finally {
      handleCancelModal();
    }
  };

  const handleDeletevip = async (key: any) => {
    try {
      const res = await requestDeleteVip(key);
      if (res) {
        setVisible(0);
        getData();
      }
    } catch (error) {}
  };

  const getListCateory = async () => {
    setIsLoading(true);
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
    getData();
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
          style={{ height: "90vh" }}
          loading={isLoading}
          dataSource={listVip}
          bordered
          rowKey={(_: any, index: any) => `${index}`}
          columns={COLUMNS_VIP}
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
                  actions={[
                    <Button
                      onClick={() => {
                        let data = item.background_urls;
                        const images = data.map((item: any, i: number) => {
                          return {
                            id: i,
                            fileList: [
                              {
                                crossOrigin: "anonymous",
                                path: URL_IMAGE + "/" + item,
                                size: "10000",
                                status: "done",
                                type: "image/jpeg",
                                uid: "__AUTO__1660498169653_0__",
                                url: URL_IMAGE + "/" + item,
                              },
                            ],
                            buffer: null,
                            url: URL_IMAGE + "/" + item,
                          };
                        });
                        console.log("imgagessss: ", images);
                        setListImages(images);
                        setVisible(OPTION.UPDATE);
                        setItemVip(item);
                        setInfoVip({
                          price: item.price,
                          name: item.name,
                          number_of_cash_out_per_day:
                            item.number_of_cash_out_per_day,
                          limit_amount_cash_out_per_day:
                            item.limit_amount_cash_out_per_day,
                          order_quantity_per_day: item.order_quantity_per_day,
                          commission_percent: item.commission_percent,
                        });
                        setUpload({
                          ...upload,
                          imageUrl: URL_IMAGE + "/" + item.background_url,
                        });
                        setImageUpload(item.background_url);
                        setPriority(item.priority);
                      }}
                      type="text"
                      size="large"
                      icon={<CheckCircleOutlined color="red" />}
                      style={{
                        color: "#1890ff",
                      }}
                    >
                      Chỉnh sửa thông tin
                    </Button>,
                    <Button
                      onClick={() => {
                        setItemVip(item);
                        setVisible(OPTION.ADD);
                      }}
                      type="text"
                      size="large"
                      icon={<PlusCircleOutlined color="red" />}
                      style={{
                        color: "green",
                      }}
                    >
                      Thêm sản phẩm
                    </Button>,
                    <Button
                      onClick={() => {
                        reactotron.logImportant!(
                          "item.products",
                          item.products
                        );
                        navigate({
                          pathname: `${ADMIN_ROUTER_PATH.LIST_PRODUCT_VIP}`,
                          search: createSearchParams({
                            key: item.key,
                          }).toString(),
                        });
                      }}
                      type="text"
                      size="large"
                      icon={<OrderedListOutlined color="red" />}
                      style={{
                        color: "GrayText",
                      }}
                    >
                      Danh sách sản phẩm
                    </Button>,
                    <Popconfirm
                      title={"Bạn chắc chắn muốn xoá sản phẩm này không?"}
                      onConfirm={() => {
                        handleDeletevip(item.key);
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

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const renderModal = () => {
    return (
      <Modal
        onCancel={handleCancelModal}
        maskClosable={false}
        footer={null}
        title={
          visible == 1
            ? "Cập nhật thông Tin"
            : visible == 3
            ? "Thêm mới Vip"
            : "Thêm Sản phẩm"
        }
        visible={visible == 1 || visible == 2 || visible == 3}
      >
        {visible == 2 ? (
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
                value={idProduct?.name || undefined}
                allowClear
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
                value={formatPrice(idProduct?.price || 0) + UNIT}
                style={{ marginTop: 8 }}
                placeholder=""
              />
            </Col>

            <Col style={{ width: "60%", marginTop: 15 }}>
              <div>
                <label
                  style={{ fontWeight: "bolder", color: "GrayText" }}
                  children={"Ảnh sản phẩm"}
                />
              </div>
              <img
                crossOrigin="anonymous"
                alt="product"
                src={
                  idProduct?.image
                    ? `${URL_IMAGE}/${idProduct?.image}`
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
        {visible == 1 || visible == 3 ? (
          <div style={{ marginBottom: 30 }}>
            {visible == 3 ? (
              <Col style={{ width: "80%" }}>
                <label
                  style={{ fontWeight: "bolder" }}
                  children={"Cấp độ ưu tiên"}
                />
                <Input
                  style={{ marginTop: 8 }}
                  placeholder="Vui lòng nhập cấp độ ưu tiên"
                  onChange={(priority) => {
                    setPriority(+priority.target.value);
                  }}
                />
              </Col>
            ) : null}
            <Col style={{ width: "80%", marginTop: 15 }}>
              <label style={{ fontWeight: "bolder" }} children={"Tên"} />
              <Input
                style={{ marginTop: 8 }}
                value={infoVip.name || ""}
                placeholder="Vui lòng nhập tên (vd: Vip 1)"
                onChange={(name) => {
                  setInfoVip({
                    ...infoVip,
                    name: name.target.value,
                  });
                }}
              />
            </Col>
            <Col style={{ width: "80%", marginTop: 15 }}>
              <label
                style={{ fontWeight: "bolder" }}
                children={"Số lượng đơn/ngày"}
              />
              <Input
                style={{ marginTop: 8 }}
                value={+infoVip.order_quantity_per_day || ""}
                placeholder="Vui lòng nhập số lượng đơn "
                onChange={(order_quantity_per_day) => {
                  setInfoVip({
                    ...infoVip,
                    order_quantity_per_day:
                      +order_quantity_per_day.target.value,
                  });
                }}
              />
            </Col>
            <Col style={{ width: "80%", marginTop: 15 }}>
              <label
                style={{ fontWeight: "bolder" }}
                children={"Số tiền tối đa rút ra/ngày"}
              />
              <Input
                style={{ marginTop: 8 }}
                placeholder="Vui lòng nhập số tiền"
                value={+infoVip.limit_amount_cash_out_per_day || ""}
                onChange={(limit_amount_cash_out_per_day) => {
                  setInfoVip({
                    ...infoVip,
                    limit_amount_cash_out_per_day:
                      +limit_amount_cash_out_per_day.target.value,
                  });
                }}
              />
            </Col>
            <Col style={{ width: "80%", marginTop: 15 }}>
              <label
                style={{ fontWeight: "bolder" }}
                children={"Số tiền/ngày"}
              />
              <Input
                style={{ marginTop: 8 }}
                placeholder="Vui lòng nhập số tiền"
                value={+infoVip.number_of_cash_out_per_day || ""}
                onChange={(number_of_cash_out_per_day) => {
                  setInfoVip({
                    ...infoVip,
                    number_of_cash_out_per_day:
                      +number_of_cash_out_per_day.target.value,
                  });
                }}
              />
            </Col>
            <Col style={{ width: "80%", marginTop: 15 }}>
              <label
                style={{ fontWeight: "bolder" }}
                children={"Hoa hồng(%)"}
              />
              <Input
                style={{ marginTop: 8 }}
                value={infoVip.commission_percent || ""}
                placeholder="Vui lòng nhập % hoa hồng"
                onChange={(commission_percent) => {
                  setInfoVip({
                    ...infoVip,
                    commission_percent: commission_percent.target.value,
                  });
                }}
              />
            </Col>
            <Col style={{ width: "80%", marginTop: 15 }}>
              <label style={{ fontWeight: "bolder" }} children={"Giá"} />
              <Input
                style={{ marginTop: 8 }}
                placeholder="Vui lòng nhập giá"
                value={+infoVip.price || ""}
                onChange={(price) => {
                  setInfoVip({
                    ...infoVip,
                    price: +price.target.value,
                  });
                }}
              />
            </Col>
            <Col style={{ width: "80%", marginTop: 15 }}>
              <label style={{ fontWeight: "bolder" }} children={"Ảnh"} />
              <div style={{ marginTop: 10 }}>
                <Row>
                  {listImages.map((item: any, index: number) => {
                    return (
                      <div>
                        <Upload
                          listType="picture-card"
                          accept="image/jpeg,image/png,image/jpg"
                          fileList={item?.fileList}
                          onPreview={handlePreviewImage}
                          onChange={(value: any) => {
                            handleChangeImage(value, index);
                          }}
                        >
                          {item?.fileList.length >= 1 ? null : (
                            <div>
                              <PlusOutlined />
                              <div style={{ fontWeight: 600 }}>
                                Ảnh {index + 1}
                              </div>
                            </div>
                          )}
                        </Upload>
                      </div>
                    );
                  })}
                  {listImages.length < 5 ? (
                    <Button
                      style={{
                        width: "104px",
                        height: "104px",
                        border: "1px dashed #d9d9d9 ",
                        backgroundColor: "#fafafa",
                        display: "inline-block",
                      }}
                      onClick={() => {
                        setListImages([
                          ...listImages,
                          {
                            id: listImages.length,
                            fileList: [],
                            buffer: null,
                            url: "",
                          },
                        ]);
                      }}
                    >
                      <div>
                        <PlusOutlined />
                        <div style={{ fontWeight: 600 }}>Thêm ảnh</div>
                      </div>
                    </Button>
                  ) : (
                    ""
                  )}
                </Row>
              </div>
            </Col>
            <Modal
              visible={isShowModalPreview}
              footer={null}
              onCancel={() => setShowModalPreview(false)}
            >
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </div>
        ) : null}
        <ButtonBottomModal
          text={"Xác nhận"}
          isLoadingButton={false}
          onCancel={handleCancelModal}
          onClickconfirm={() => {
            if (visible == 1 || visible == 3) {
              if (!!isNaN(priority)) {
                message.warning("Cấp độ ưu tiên bắt buộc là số!");
                return;
              }
              if (!!isNaN(infoVip.commission_percent)) {
                message.warning("Hoa hồng là số hoặc số thập phân!");
                return;
              }
              if (
                !infoVip.price ||
                !infoVip.name ||
                !infoVip.number_of_cash_out_per_day ||
                !infoVip.limit_amount_cash_out_per_day ||
                !infoVip.order_quantity_per_day ||
                !infoVip.commission_percent
                // !imageUpload
              ) {
                message.warning("Vui lòng nhập đầy đủ các trường thông tin !");
                return;
              }

              handleUpdateInfoVip(visible);
              return;
            }
            handleAddProduct();
            return;
          }}
        />
      </Modal>
    );
  };

  const handleCancelModal = () => {
    setVisible(0);
    setInfoVip({});
    setItemVip({});
    setIdProduct({});
    setListImages(
      Array.from(Array(1).keys()).map((i) => {
        return {
          id: i,
          fileList: [],
          buffer: null,
          url: "",
        };
      })
    );
  };
  return (
    <div style={{ marginTop: 10 }}>
      <PageHeader
        title="Vip"
        style={{ backgroundColor: "white", margin: "5px 10px 10px" }}
        extra={[
          <Header
            placeholderDrop={"Sắp xếp"}
            showButton={true}
            onClick={() => {
              setUpload({
                ...upload,
                imageUrl: "",
              });
              setImageUpload("");
              setInfoVip({});
              setVisible(3);
              setListImages(
                Array.from(Array(1).keys()).map((i) => {
                  return {
                    id: i,
                    fileList: [],
                    buffer: null,
                    url: "",
                  };
                })
              );
            }}
          />,
        ]}
      />
      {renderTable()}
      {renderModal()}
    </div>
  );
};

export default VipScreen;
