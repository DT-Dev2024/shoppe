import {
  CheckCircleOutlined,
  DeleteFilled,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkToken,
  COLUMNS_PRODUCT,
  convertVndToDollar,
  FORM_ITEM_LAYOUT_STAFF,
  getBase64,
  handleConvertValueQuerySortProduct,
  UNIT,
} from "../../config/constants";
import reactotron from "../../ReactotronConfig";
import { URL_IMAGE } from "../../service/ApiService";
import {
  requestAddProduct,
  requestDeleteProduct,
  requestGetListCategory,
  requestGetListProduct,
  requestUpdateProduct,
  requestUploadImage,
} from "../../service/network/Api";
import DateUtil from "../../util/DateUtil";
import {
  convertDataToFrom,
  formatPrice,
  showToast,
} from "../../util/funcUtils";
import { Header } from "../dashboard/component/Header";
import ButtonBottomModal from "./component/ButtonBottomModal";
const { Option } = Select;

const ProductScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listProduct, setListProduct] = useState([]);
  const [visible, setVisible] = useState<any>(0);
  const [item, setItem] = useState<any>();
  const [form] = Form.useForm();
  const [upload, setUpload] = useState<any>({
    loading: false,
    imageUrl: "",
  });
  const navigate = useNavigate();
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [search, setSearch] = useState(undefined);
  const [fromDaytoDay, setFromDaytoDay] = useState<any>([]);
  const [status, setStatus] = useState("");
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [listCategory, setListCategory] = useState<any>([]);
  const [itemCategory, setItemCategory] = useState<any>([]);
  const [loadMore, setLoadMore] = useState<any>(false);
  const LIMIT = 8;
  const getData = async () => {
    setIsLoading(true);
    const payload = {
      page: page,
      limit: LIMIT,
      from: fromDaytoDay[0],
      to: fromDaytoDay[1],
      name: search,
      sort_by: handleConvertValueQuerySortProduct(status),
    };
    try {
      const res = await requestGetListProduct(payload);
      reactotron.logImportant!("LIST_PRODUCT", res);
      if (res) {
        setIsLoading(false);
        setListProduct(res.data);
        setTotalPage(res.meta.pagination.total);
      }
    } catch (error) {}
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Xảy ra lỗi! Bạn chỉ có thể upload ảnh có dạng JPG/PNG!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Cho phép ảnh có dung lượng tối đa là 2MB");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info: any) => {
    reactotron.logImportant!("info", info);
    if (info.file.status === "uploading") {
      setUpload({
        imageUrl: "",
        loading: true,
      });
      return;
    }

    if (info.file.status === "done" || info.file.status === "error") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        return setUpload({
          imageUrl: imageUrl,
          loading: false,
        });
      });
    }
  };

  const handleOnFinish = async (values: any) => {
    reactotron.logImportant!("values", values);
    // return;
    let formData = new FormData();
    try {
      if (values?.icon_url?.fileList && visible == 1) {
        reactotron.logImportant!("ADD");
        formData.append("file", values.icon_url.fileList[0].originFileObj);
        const res = await requestUploadImage(formData);
        if (res) {
          let payload = {
            name: values.name,
            image: res.data.path,
            category_id: listCategory[values.category]._id,
            price: +values.price,
          };
          const response = await requestAddProduct(payload);
          if (response) {
            showToast("Thêm mới sản phẩm thành công!");
            setVisible(0);
            getData();
            setItem(undefined);
          }
        }
        return;
      }
      if (values?.icon_url?.fileList && upload?.imageUrl) {
        reactotron.logImportant!("UPDATE1");
        formData.append("file", values.icon_url.fileList[0].originFileObj);
        const res = await requestUploadImage(formData);
        if (res) {
          let payloadUpdate = {
            id: item._id,
            body: {
              name: values.name,
              image: res.data.path,
              category_id: listCategory[values.category]._id,
              price: +values.price,
            },
          };
          const response = await requestUpdateProduct(payloadUpdate);
          if (response) {
            showToast("Cập nhật sản phẩm thành công!");
            setVisible(0);
            getData();
            setItem(undefined);
          }
        }
        return;
      }
      if (upload?.imageUrl && !values?.icon_url?.fileList) {
        reactotron.logImportant!("UPDATE2");
        let payloadUpdate = {
          id: item._id,
          body: {
            name: values.name || item.name,
            image: values?.icon_url,
            category_id: listCategory[values.category]._id,
            price: +values.price || item.price,
          },
        };
        const response = await requestUpdateProduct(payloadUpdate);
        if (response) {
          showToast("Cập nhật sản phẩm thành công!");
          setVisible(0);
          getData();
          setItem(undefined);
        }
        return;
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra!");
    }
  };

  const handleDeleteProduct = async (item: any) => {
    try {
      const res = await requestDeleteProduct(item._id);
      if (res) {
        showToast("Xoá sản phẩm thành công!");
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

  const uploadButton = (
    <div>
      {upload.loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const initialValues = convertDataToFrom(item);

  useEffect(() => {
    checkToken().then((res) => {
      if (res) return getData();
      navigate("/login");
      showToast("Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.");
    });
  }, [search, fromDaytoDay, status, page]);
  useEffect(() => {
    getListCateory();
  }, []);

  reactotron.logImportant!("itemCategory", itemCategory);
  return (
    <div style={{ marginTop: 10 }}>
      <PageHeader
        title="Sản phẩm"
        style={{ backgroundColor: "white", margin: "5px 10px 10px" }}
        extra={[
          <Header
            onStatusSubmit={(statusKey: string) => {
              setStatus(statusKey);
            }}
            placeholderDrop={"Sắp xếp"}
            dataDropdown={[
              {
                name: "Giá tăng dần",
              },
              {
                name: "Giá giảm dần",
              },
              {
                name: "Tên từ A->Z ",
              },
              {
                name: "Tên từ Z->A",
              },
            ]}
            showButton={true}
            onSearchSubmit={(input: any) => {
              setSearch(input);
            }}
            isSearchLoading={isSearchLoading}
            fromDaytoDay={fromDaytoDay}
            dateOnSubmit={(x: string, y: string) => {
              setFromDaytoDay([x, y]);
            }}
            onClick={() => {
              setItem(undefined);
              setVisible(1);
              form.resetFields();
              setUpload({
                ...upload,
                imageUrl: "",
              });
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
          style={{ height: "90vh" }}
          loading={isLoading}
          dataSource={listProduct}
          bordered
          rowKey={(_, index) => `${index}`}
          columns={COLUMNS_PRODUCT}
          expandRowByClick={true}
          pagination={{
            pageSize: LIMIT,
            total: totalPage,
            onChange: (page) => {
              setPage(page);
            },
          }}
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
                        setItem(item);
                        form.setFieldsValue({
                          name: item.name,
                          price: item.price,
                          icon_url: item.image,
                        });
                        setVisible(2);
                        setUpload({
                          ...upload,
                          imageUrl: URL_IMAGE + "/" + item.image,
                        });
                        setItemCategory(item.category);
                      }}
                      type="text"
                      size="large"
                      icon={<CheckCircleOutlined color="red" />}
                      style={{
                        color: "#1890ff",
                      }}
                    >
                      Chỉnh sửa
                    </Button>,
                    <Popconfirm
                      title={"Bạn chắc chắn muốn xoá sản phẩm này không?"}
                      onConfirm={() => {
                        handleDeleteProduct(item);
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
                    children={"Thông tin sản phẩm"}
                  />
                  <Row style={{ marginTop: 20 }}>
                    <Col flex={1}>
                      <h4>Tên sản phẩm: {item.name}</h4>
                    </Col>
                    <Col flex={1}>
                      <h4>Danh mục: {item.category.name}</h4>
                    </Col>
                    <Col flex={1}>
                      <h4>Giá: {(formatPrice(item.price) || 0) + UNIT}</h4>
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

      <Modal
        onCancel={() => {
          setVisible(0);
          setItem(undefined);
          form.resetFields();
        }}
        maskClosable={false}
        footer={null}
        title={visible == 1 ? "Thêm sản phẩm" : "Chỉnh sửa sản phẩm"}
        visible={visible}
      >
        <Form
          {...FORM_ITEM_LAYOUT_STAFF}
          form={form}
          name="register"
          labelAlign="left"
          onFinish={(values: any) => {
            handleOnFinish(values);
          }}
          initialValues={{
            name: null,
            price: null,
            icon_url: null,
          }}
          scrollToFirstError
        >
          <Form.Item
            label="Tên"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng điền tên sản phẩm",
              },
              {
                whitespace: true,
                message: "Không được nhập khoảng trắng!",
              },
            ]}
          >
            <Input placeholder="Tên sản phẩm" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá sản phẩm",
              },
            ]}
          >
            <Input placeholder="Giá sản phẩm" />
          </Form.Item>
          <Form.Item
            label="Danh mục"
            name="category"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn danh mục sản phẩm!",
              },
            ]}
          >
            <Select
              value={itemCategory?.name}
              allowClear
              placeholder={"Chọn danh mục"}
              style={{ marginTop: 8 }}
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
          </Form.Item>

          <Form.Item
            label="Ảnh sản phẩm"
            name="icon_url"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ảnh sản phẩm!",
              },
            ]}
          >
            <Upload
              name="icon_url"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {upload.imageUrl ? (
                <img
                  crossOrigin="anonymous"
                  src={upload.imageUrl}
                  alt="avatar"
                  style={{
                    width: "100%",
                    objectFit: "contain",
                    height: "100%",
                  }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
          <ButtonBottomModal
            isLoadingButton={false}
            onCancel={() => {
              setVisible(0);
              form.setFieldsValue({});
              setItem({});
              setUpload({});
            }}
            text={visible == 1 ? "Thêm sản phẩm" : "Cập nhật"}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default ProductScreen;
