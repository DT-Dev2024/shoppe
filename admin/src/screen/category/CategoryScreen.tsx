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
import React, { useState } from "react";
import {
  COLUMNS_CATEGORY,
  COLUMNS_VIP,
  getBase64,
} from "../../config/constants";
import reactotron from "../../ReactotronConfig";
import {
  requestAddCategory,
  requestDeleteCategory,
  requestGetListCategory,
  requestGetListLevel,
  requestUpdateCategory,
  requestUploadImage,
} from "../../service/network/Api";
import { Header } from "../dashboard/component/Header";
import {
  CheckCircleOutlined,
  DeleteFilled,
  LoadingOutlined,
  PlusOutlined,
  PlusCircleOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { formatPrice, showToast } from "../../util/funcUtils";
import DateUtil from "../../util/DateUtil";
import ButtonBottomModal from "../product/component/ButtonBottomModal";
import { URL_IMAGE } from "../../service/ApiService";

const CategoryScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [listCategory, setListCategory] = useState([]);
  const [fromDaytoDay, setFromDaytoDay] = useState<any>([]);
  const [search, setSearch] = useState(undefined);
  const [visible, setVisible] = useState(0);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [upload, setUpload] = useState<any>({
    loading: false,
    imageUrl: "",
  });
  const [payloadAdd, setPayloadAdd] = useState<any>({
    name: "",
    image: "",
  });
  const [item, setItem] = useState<any>({});
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

  const handleDeleteCategory = async (id: any) => {
    try {
      const res = await requestDeleteCategory(id);
      if (res) {
        getData();
        showToast("Xoá danh mục thành công!");
      }
    } catch (error) {}
  };

  const handleChange = (info: any) => {
    reactotron.logImportant!("info", info);
    if (info.file.status === "uploading") {
      let length = info.fileList.length - 1;
      setPayloadAdd({
        ...payloadAdd,
        image: info.fileList[length].originFileObj,
      });
      console.log("info", info);
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

  const handleAddCategory = async (visible: number) => {
    let formData = new FormData();
    reactotron.logImportant!("payloadAdd", payloadAdd);
    if (visible == 1 && upload.imageUrl.includes("uploads")) {
      let payloadUpdate = {
        id: item._id,
        body: {
          name: payloadAdd.name || item.name,
          image: upload.imageUrl.slice(URL_IMAGE.length + 1),
        },
      };
      const res = await requestUpdateCategory(payloadUpdate);
      if (res) {
        showToast("Cập nhật thông tin thành công!");
        getData();
        setVisible(0);
        setPayloadAdd("");
        setUpload("");
        setItem("");
      }
      return;
    }
    formData.append("file", payloadAdd?.image);
    // return;
    try {
      const responseImage = await requestUploadImage(formData);

      if (responseImage) {
        if (visible == 1) {
          let payloadUpdate = {
            id: item._id,
            body: {
              name: payloadAdd.name || item.name,
              image: responseImage.data.path,
            },
          };
          const res = await requestUpdateCategory(payloadUpdate);
          if (res) {
            showToast("Cập nhật thông tin thành công!");
            getData();
            setVisible(0);
            setPayloadAdd("");
            setUpload("");
            setItem("");
          }
          return;
        }
        if (visible == 2) {
          const res = await requestAddCategory({
            name: payloadAdd.name,
            image: responseImage.data.path,
          });
          if (res) {
            showToast("Thêm danh mục thành công!");
            getData();
            setVisible(0);
            setPayloadAdd("");
            setUpload("");
            setItem("");
          }
          return;
        }
      }
    } catch (error) {
      showToast("Đã có lỗi xảy ra!");
    }
  };

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
      const res = await requestGetListCategory(payload);
      if (res) {
        setIsLoading(false);
        setListCategory(res.data);
      }
    } catch (error) {}
  };

  React.useEffect(() => {
    getData();
  }, []);
  React.useEffect(() => {
    getData();
  }, [search, fromDaytoDay]);

  const uploadButton = (
    <div>
      {upload.loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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
          dataSource={listCategory}
          bordered
          rowKey={(_: any, index: any) => `${index}`}
          columns={COLUMNS_CATEGORY}
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
                        setVisible(1);
                        setItem(item);
                        setUpload({
                          ...upload,
                          imageUrl: URL_IMAGE + "/" + item.image,
                        });
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
                    <Popconfirm
                      title={"Bạn chắc chắn muốn xoá sản phẩm này không?"}
                      onConfirm={() => {
                        handleDeleteCategory(item._id);
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
                    children={"Thông tin danh mục"}
                  />
                  <Row style={{ marginTop: 20 }}>
                    <Col flex={1}>
                      <h4>Tên danh mục: {item.name}</h4>
                      <h4>Ảnh danh mục:</h4>
                      <img
                        crossOrigin="anonymous"
                        src={URL_IMAGE + "/" + item.image}
                        style={{ width: 150, height: 150 }}
                      />
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
          setVisible(0);
        }}
        maskClosable={false}
        footer={null}
        title={
          visible == 1 ? "Cập nhật thông tin danh mục" : "Thêm mới danh mục"
        }
        visible={visible == 1 || visible == 2}
      >
        <div style={{ marginBottom: 30 }}>
          <Col>
            <label style={{ fontWeight: "bolder" }} children={"Tên danh mục"} />
            <Input
              value={payloadAdd.name || item.name}
              style={{ marginTop: 8 }}
              placeholder="Nhập tên danh mục"
              onChange={(input) => {
                setPayloadAdd({
                  ...payloadAdd,
                  name: input.target.value,
                });
              }}
            />
          </Col>
          <Col style={{ width: "80%", marginTop: 15 }}>
            <label style={{ fontWeight: "bolder" }} children={"Ảnh"} />
            <div style={{ marginTop: 10 }}>
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
            </div>
          </Col>
        </div>

        <ButtonBottomModal
          text={"Xác nhận"}
          isLoadingButton={false}
          onCancel={() => {
            setVisible(0);
          }}
          onClickconfirm={() => {
            handleAddCategory(visible);
          }}
        />
      </Modal>
    );
  };
  return (
    <div style={{ marginTop: 10 }}>
      <PageHeader
        title="Danh mục"
        style={{ backgroundColor: "white", margin: "5px 10px 10px" }}
        extra={[
          <Header
            showButton={true}
            onClick={() => {
              setVisible(2);
            }}
            onSearchSubmit={(input: any) => {
              setSearch(input);
            }}
            isSearchLoading={isSearchLoading}
            fromDaytoDay={fromDaytoDay}
            dateOnSubmit={(x: string, y: string) => {
              setFromDaytoDay([x, y]);
            }}
            placeholderSearch={"Nhập tên hoặc mã danh mục"}
          />,
        ]}
      />
      {renderTable()}
      {renderModal()}
    </div>
  );
};

export default CategoryScreen;
