import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Input,
  message,
  Row,
  Select,
  Spin,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { getBase64, IS_ACTIVE } from "../../config/constants";
import reactotron from "../../ReactotronConfig";
import { URL_IMAGE } from "../../service/ApiService";
import {
  requestGetListMethod,
  requestUpdateMethod,
  requestUploadImage,
} from "../../service/network/Api";
import { showToast } from "../../util/funcUtils";

const { Option } = Select;
const InfoBankScreen = () => {
  const [listBank, setListBank] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState<any>();
  const [imageLogoUpload, setImageLogoUpload] = useState<any>();
  const [methodName, setMethodName] = useState<any>();
  const [state, setState] = useState<any>({
    full_name: "",
    phone: "",
    bank_name: "",
    bank_number: "",
    is_active: IS_ACTIVE.ACTIVE,
    logo_url: "",
    qr_url: "",
  });
  const [upload, setUpload] = useState<any>({
    loading: false,
    imageUrl: "",
  });
  const [uploadLogo, setUploadLogo] = useState<any>({
    loading: false,
    imageUrl: "",
  });

  const getListBank = async () => {
    try {
      const res = await requestGetListMethod();
      if (res) {
        reactotron.logImportant!("getListBank", res);
        setListBank(res.data);
      }
    } catch (error) {}
  };

  const onChangeSelect = (value: any) => {
    reactotron.logImportant!("value", listBank[value]);
    setState({
      full_name: listBank[value]?.full_name || undefined,
      phone: listBank[value]?.phone || undefined,
      bank_name: listBank[value]?.bank_name || undefined,
      bank_number: listBank[value]?.bank_number || undefined,
    });
    setMethodName(listBank[value]?.method_name);
    setUpload({
      ...upload,
      imageUrl: `${URL_IMAGE}${listBank[value]?.qr_url}` || "",
    });
    setUploadLogo({
      ...upload,
      imageUrl: `${URL_IMAGE}${listBank[value]?.logo_url}` || "",
    });
  };

  const handleUpdatBank = async () => {
    try {
      let payload;
      if (
        !state.full_name ||
        !state.phone ||
        !state.bank_number ||
        !state.bank_name
      ) {
        return message.warning("Vui lòng nhập đầy đủ các trường thông tin!");
      }
      setLoading(true);
      if (imageUpload && !imageLogoUpload) {
        let formData = new FormData();
        formData.append("file", imageUpload);
        const res = await requestUploadImage(formData);
        if (res) {
          payload = {
            methobName: methodName,
            body: { ...state, qr_url: res.data.path || "" },
          };

          const response = await requestUpdateMethod(payload);
          if (response) {
            setLoading(false);
            getListBank();
            showToast("Cập nhật thành công!");
          }
        }
        return;
      }
      if (imageLogoUpload && !imageUpload) {
        let formData = new FormData();
        formData.append("file", imageLogoUpload);
        const res = await requestUploadImage(formData);
        if (res) {
          payload = {
            methobName: methodName,
            body: { ...state, logo_url: res.data.path || "" },
          };
          const response = await requestUpdateMethod(payload);
          if (response) {
            setLoading(false);
            getListBank();
            showToast("Cập nhật thành công!");
            // setImageUpload({});
            // setImageLogoUpload({});
          }
        }
      }
      if (imageLogoUpload && imageUpload) {
        let formData = new FormData();
        formData.append("file", imageUpload);
        const res = await requestUploadImage(formData);
        if (res) {
          let formDataLogo = new FormData();
          formDataLogo.append("file", imageLogoUpload);
          const resLogo = await requestUploadImage(formDataLogo);
          if (resLogo) {
            payload = {
              methobName: methodName,
              body: {
                ...state,
                qr_url: res.data.path || "",
                logo_url: resLogo.data.path || "",
              },
            };
            const response = await requestUpdateMethod(payload);
            if (response) {
              setLoading(false);
              getListBank();
              showToast("Cập nhật thành công!");
              // setImageUpload({});
              // setImageLogoUpload({});
            }
          }
        }
        return;
      }
      payload = {
        methobName: methodName,
        body: state,
      };
      const response = await requestUpdateMethod(payload);
      if (response) {
        setLoading(false);
        getListBank();
        showToast("Cập nhật thành công!");
        // setImageUpload({});
        // setImageLogoUpload({});
      }
    } catch (error) {
      setLoading(false);
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
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

  const handleChange = (info: any, type: any) => {
    reactotron.logImportant!("info", info);
    if (info.file.status === "uploading") {
      if (type == "QR") {
        setUpload({
          imageUrl: "",
          loading: true,
        });
        return;
      }
      setUploadLogo({
        imageUrl: "",
        loading: true,
      });
      return;
    }

    if (info.file.status === "done" || info.file.status === "error") {
      // Get this url from response in real world.

      getBase64(info.file.originFileObj, (imageUrl: any) => {
        if (type == "QR") {
          setImageUpload(info.fileList[0].originFileObj);
          return setUpload({
            imageUrl: imageUrl,
            loading: false,
          });
        }
        setImageLogoUpload(info.fileList[0].originFileObj);
        return setUploadLogo({
          imageUrl: imageUrl,
          loading: false,
        });
      });
    }
  };

  useEffect(() => {
    getListBank();
  }, []);

  const uploadButton = (
    <div>
      {upload.loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Spin style={{}} size={"large"} spinning={loading} tip="Đang xử lý...">
      <div style={{ display: "flex", height: "80vh" }}>
        <Col style={{}}>
          <h2>Thông tin</h2>
          <Col style={{ marginTop: 15 }}>
            <label
              style={{ fontWeight: "bolder", color: "GrayText" }}
              children={"Phương thức thanh toán"}
            />
            <Select
              allowClear
              placeholder={"Chọn phương thức thanh toán"}
              style={{ minWidth: "150%", marginTop: 8 }}
              onChange={onChangeSelect}
            >
              {listBank.map((item: any, index: number) => {
                return (
                  <Option value={index}>{`Phương thức ${index + 1}`}</Option>
                );
              })}
            </Select>
          </Col>
          <Col style={{ marginTop: 15 }}>
            <label
              style={{ fontWeight: "bolder", color: "GrayText" }}
              children={"Tên tài khoản ngân hàng"}
            />
            <Input
              value={state.bank_name || undefined}
              style={{ width: "150%", marginTop: 8 }}
              placeholder="Nhập tên tài khoản ngân hàng"
              onChange={(input) => {
                setState({
                  ...state,
                  bank_name: input.target.value,
                });
              }}
            />
          </Col>
          <Col style={{ marginTop: 15 }}>
            <label
              style={{ fontWeight: "bolder", color: "GrayText" }}
              children={"Số tài khoản ngân hàng"}
            />
            <Input
              value={state.bank_number || undefined}
              style={{ width: "150%", marginTop: 8 }}
              placeholder="Nhập số tài khoản ngân hàng"
              onChange={(input) => {
                setState({
                  ...state,
                  bank_number: input.target.value,
                });
              }}
            />
          </Col>
          <Col style={{ marginTop: 15 }}>
            <label
              style={{ fontWeight: "bolder", color: "GrayText" }}
              children={"Tên chủ tài khoản"}
            />
            <Input
              value={state.full_name || undefined}
              style={{ width: "150%", marginTop: 8 }}
              placeholder="Nhập tên chủ tài khoản"
              onChange={(input) => {
                setState({ ...state, full_name: input.target.value });
              }}
            />
          </Col>
          <Col style={{ marginTop: 15 }}>
            <label
              style={{ fontWeight: "bolder", color: "GrayText" }}
              children={"Số điện thoại chủ tài khoản"}
            />
            <Input
              value={state.phone || undefined}
              style={{ width: "150%", marginTop: 8 }}
              placeholder="Nhập số điện thoại chủ tài khoản"
              onChange={(input) => {
                setState({ ...state, phone: input.target.value });
              }}
            />
          </Col>
          <Row style={{ justifyContent: "space-between" }}>
            <div style={{ marginTop: 15 }}>
              <h4 style={{ marginBottom: 10 }}>Ảnh QR code ngân hàng</h4>
              <Upload
                name="icon_url"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={(info) => handleChange(info, "QR")}
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
            <div style={{ marginTop: 15, marginRight: 20 }}>
              <h4 style={{ marginBottom: 10 }}>Ảnh đại diện ngân hàng</h4>
              <Upload
                name="icon_url_logo"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={(info) => handleChange(info, "LOGO")}
              >
                {uploadLogo.imageUrl ? (
                  <img
                    crossOrigin="anonymous"
                    src={uploadLogo.imageUrl}
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
          </Row>
          <Col style={{ marginTop: 5 }}>
            <div>
              <div>
                <label
                  style={{
                    fontWeight: "bolder",
                    color: "GrayText",
                    marginRight: 20,
                  }}
                  children={"Trạng thái phương thức thanh toán"}
                />
              </div>
              <div>
                <Checkbox
                  style={{ marginTop: 15 }}
                  checked={state.is_active == IS_ACTIVE.ACTIVE}
                  onChange={() => {
                    setState({
                      ...state,
                      is_active:
                        state.is_active == IS_ACTIVE.ACTIVE
                          ? IS_ACTIVE.UN_ACTIVE
                          : IS_ACTIVE.ACTIVE,
                    });
                  }}
                >
                  Hoạt động
                </Checkbox>
              </div>
            </div>
          </Col>
          <Row
            style={{
              width: "150%",
              marginTop: 20,
              justifyContent: "center",
            }}
          >
            <Button
              onClick={handleUpdatBank}
              style={{
                fontWeight: 800,
                borderRadius: "3px",
              }}
              type="primary"
              htmlType="submit"
              children={"Cập nhật"}
            />
          </Row>
        </Col>
      </div>
    </Spin>
  );
};

export default InfoBankScreen;
