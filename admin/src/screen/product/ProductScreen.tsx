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
  InputNumber,
  message,
  Modal,
  PageHeader,
  Popconfirm,
  Row,
  Select,
  Table,
  Upload,
  Image,
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
import FormItem from "antd/lib/form/FormItem";
import Editor from "../../component/Editor";
import { uploadImageToCloud } from "../../util/uploadImageToServer";
import { TProduct } from "../../types/Product";
import { UploadFile } from "antd/lib/upload/interface";
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
  const [detailImage, setDetailImage] = useState<any>([]);
  const [description, setDescription] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [showDetailImage, setShowDetailImage] = useState<boolean>(false);
  // const [listCategory, setListCategory] = useState<any>([]);
  // const [itemCategory, setItemCategory] = useState<any>([]);
  const [loadMore, setLoadMore] = useState<any>(false);
  // const handleDetailImagesChange = ({ fileList }: { fileList: any[] }) => {
  //   setDetailImage(fileList.slice(-5)); // Limit to 5 images
  // };
  const handleDetailImagesChange = ({
    fileList,
  }: {
    fileList: UploadFile<any>[];
  }) => {
    setDetailImage(fileList);
  };

  const handlePreview = async (file: any) => {
    const fileView: any = await urlToBase64(file);
    console.log(fileView);
    setPreviewImage(fileView);
    setPreviewOpen(true);
  };

  async function urlToBase64(url: string) {
    // Fetch image data from URL
    const response = await fetch(url);
    const blob = await response.blob();

    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const sanitizeContent = (content: string) => {
    const div = document.createElement("div");
    div.innerHTML = content;
    const imgs = div.getElementsByTagName("img");
    Array.from(imgs).forEach((img) => {
      img.style.maxWidth = "100%";
      img.style.height = "auto";
    });
    return div.innerHTML;
  };

  const LIMIT = 8;

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await requestGetListProduct();
      reactotron.logImportant!("LIST_PRODUCT", res);
      if (res) {
        setIsLoading(false);
        setListProduct(res.data);
        setTotalPage(res.total);
      }
    } catch (error) { }
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp";
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
    const handleChangeList = ({
      fileList,
    }: {
      fileList: UploadFile<any>[];
    }) => {
      setDetailImage(fileList);
    };

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
    const apiKey = "00ec1251d5a79a3c69c0dfe013e86412";
    try {
      if (values?.icon_url?.fileList && visible == 1) {
        reactotron.logImportant!("ADD");

        const imageBase64 = values.icon_url.fileList[0].originFileObj;
        const name = values.icon_url.fileList[0].name;
        const res = await uploadImageToCloud(apiKey, imageBase64, name);
        if (res) {
          const listUrlImageDetail: string[] = [];
          // upload detail images
          await Promise.all(
            detailImage.map(async (item: any) => {
              const imageBase64 = item.originFileObj;
              const name = item.name;
              const res = await uploadImageToCloud(apiKey, imageBase64, name);
              listUrlImageDetail.push(res);
            })
          );
          console.log(listUrlImageDetail);

          // Generate random feedback data
          const feedbackStar = parseFloat(
            (Math.random() * 0.5 + 4.5).toFixed(1)
          );
          console.log(listUrlImageDetail);

          let payload: TProduct = {
            name: values.name,
            image: res,
            description: description,
            detailImage: listUrlImageDetail,
            sale_price: +values.sale_price,
            feedback: {
              star: feedbackStar, // Generates a float between 1.0 and 5.0
              comment: Math.floor(Math.random() * (100000 - 2500 + 1)) + 2500, // Generates an integer between 2500 and 100000
              sold: Math.floor(Math.random() * (100000 - 2500 + 1)) + 2500,
            },
            price: +values.price,
          };
          const response = await requestAddProduct(payload);
          if (response) {
            showToast("Thêm mới sản phẩm thành công!");
            setVisible(0);
            getData();
            setItem(undefined);
            setShowDetailImage(false);
          }
        }
        return;
      }

      if (showDetailImage) {
        reactotron.logImportant!("UPDATE1");
        console.log("update 1")
        const imageBase64 = values.icon_url.fileList[0].originFileObj ?? item.image;
        const name = values.icon_url.fileList[0].name;
        const res = await uploadImageToCloud(apiKey, imageBase64, name);
        if (res) {
          const listUrlImageDetail: string[] = [];
          // upload detail images
          await Promise.all(
            detailImage.map(async (item: any) => {
              const imageBase64 = item.originFileObj;
              const name = item.name;
              const res = await uploadImageToCloud(apiKey, imageBase64, name);
              listUrlImageDetail.push(res);
            })
          );
          console.log(listUrlImageDetail);
          // Generate random feedback data

          let payloadUpdate = {
            id: item.id,
            body: {
              name: values.name,
              image: res,
              description: description,
              detailImage: listUrlImageDetail,
              sale_price: +values.sale_price,
              // feedback: {
              //   star: feedbackStar, // Generates a float between 1.0 and 5.0
              //   comment: Math.floor(Math.random() * (100000 - 2500 + 1)) + 2500, // Generates an integer between 2500 and 100000
              //   sold: Math.floor(Math.random() * (100000 - 2500 + 1)) + 2500,
              // },
              price: +values.price,
            }
          };
          console.log(payloadUpdate);
          const response = await requestUpdateProduct(payloadUpdate);
          if (response) {
            showToast("Cập nhật sản phẩm thành công!");
            setVisible(0);
            getData();
            setDescription("");
            setListProduct([]);
            setItem(undefined);
            setShowDetailImage(false);
          }
        }
        return;
      } else {
        console.log('update2')
        reactotron.logImportant!("UPDATE2");
        const imageBase64 = values.icon_url.fileList[0].originFileObj;
        const name = values.icon_url.fileList[0].name;
        const res = await uploadImageToCloud(apiKey, imageBase64, name);
        let payloadUpdate = {
          id: item.id,
          body: {
            id: item.id,
            name: values.name || item.name,
            image: res,
            description: description || item.description,
            sale_price: +values.sale_price || item.sale_price,
            // category_id: listCategory[values.category]._id,
            price: +values.price || item.price,
          },
        };
        const response = await requestUpdateProduct(payloadUpdate);
        if (response) {
          showToast("Cập nhật sản phẩm thành công!");
          setVisible(0);
          getData();
          setDescription("");
          setListProduct([]);
          setItem(undefined);
          setShowDetailImage(false);
        }
        return;
      }
    } catch (error) {
      console.log(error)
      message.error("Đã có lỗi xảy ra!");
    }
  };

  const handleDeleteProduct = async (item: any) => {
    try {
      const res = await requestDeleteProduct(item.id);
      if (res) {
        showToast("Xoá sản phẩm thành công!");
        getData();
      }
    } catch (error) { }
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
  // useEffect(() => {
  //   getListCateory();
  // }, []);z

  // reactotron.logImportant!("itemCategory", itemCategory);

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
              setShowDetailImage(false);
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
            expandedRowRender: (item: TProduct) => (
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
                          sale_price: item.sale_price,
                          icon_url: item.image,
                        });
                        setVisible(2);
                        setUpload({
                          ...upload,
                          imageUrl: item.image,
                        });
                        setDetailImage(item.detailImage);
                        setDescription(item.description);
                        setShowDetailImage(false);
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
                      <h4>Giá gốc: {formatPrice(item.price) || 0}</h4>
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
          setShowDetailImage(false);
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
            sale_price: null,
            icon_url: null,
            detailImages: [],
            description: null,
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
            label="Giảm giá(%)"
            name="sale_price"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá giảm theo %!",
              },
              {
                type: "number",
                min: 0,
                max: 100,
                message: "Giá giảm theo % phải là 0 đến 100",
              },
            ]}
          >
            <InputNumber placeholder="Giảm giá" />
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
          <Form.Item label="Ảnh chi tiết" name="detail_images">
            {!showDetailImage && (
              <Button
                onClick={() => {
                  setShowDetailImage(!showDetailImage);
                  setDetailImage([]);
                }}
              >
                {showDetailImage ? "Xem ảnh chi tiết" : "Cập nhật ảnh chi tiết"}
              </Button>
            )}
            {showDetailImage ? (
              <Upload
                listType="picture-card"
                fileList={detailImage}
                onChange={handleDetailImagesChange}
                onPreview={handlePreview}
                multiple
                beforeUpload={beforeUpload}
              >
                {detailImage.length >= 5 ? null : uploadButton}
              </Upload>
            ) : (
              <Upload
                listType="picture-card"
                fileList={detailImage.map((url: any, index: any) => ({
                  uid: index,
                  name: `image-${index}`,
                  status: "done",
                  url: url,
                }))}
                onChange={handleDetailImagesChange}
                onPreview={handlePreview}
                multiple
                beforeUpload={beforeUpload}
              >
                {/* {detailImage.length >= 5 ? null : uploadButton}  */}
              </Upload>
            )}
          </Form.Item>
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible: boolean) => {
                  setPreviewOpen(visible);
                  if (!visible) {
                    setPreviewImage("");
                  }
                },
              }}
              src={previewImage}
            />
          )}
          <FormItem>
            <Editor value={description} onChange={setDescription} />
          </FormItem>
          {/* <div
            className="description"
            style={{ maxWidth: "100%" }}
            dangerouslySetInnerHTML={{ __html: sanitizeContent(description) }}
          /> */}

          <ButtonBottomModal
            isLoadingButton={false}
            onClickconfirm={() => {

            }}
            onCancel={() => {
              setVisible(0);
              form.setFieldsValue({});
              setItem({});
              setUpload({});
              setShowDetailImage(false);
            }}
            text={visible == 1 ? "Thêm sản phẩm" : "Cập nhật"}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default ProductScreen;
