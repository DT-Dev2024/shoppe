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
import { RcFile } from "antd/lib/upload";
import React, { useEffect, useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import R from "../../component/assets";
import { COLUMNS_VIP, UNIT, getBase64 } from "../../config/constants";
import { ADMIN_ROUTER_PATH } from "../../config/router";
import reactotron from "../../ReactotronConfig";
import axiosInstance, { ApiClient, URL_IMAGE } from "../../service/ApiService";
import {
  requestAddPayment,
  requestAddProductToVip,
  requestAddVip,
  requestDeleteVip,
  requestGetListCategory,
  requestGetListLevel,
  requestGetListProduct,
  requestGetPayment,
  requestUpdateInfoVip,
  requestUploadImage,
} from "../../service/network/Api";
import DateUtil from "../../util/DateUtil";
import { formatPrice, showToast } from "../../util/funcUtils";
// import { uploadImageToServer } from "../../util/uploadImageToServer";
import { Header } from "../dashboard/component/Header";
import ButtonBottomModal from "../product/component/ButtonBottomModal";
import path from "path";
import { FormItem } from "../../component/FormItem";
import { uploadImageToCloud } from "../../util/uploadImageToServer";
import { set } from "firebase/database";
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
  const [qrMomo, setQrMomo] = useState<string>("");
  const [qrBank, setQrBank] = useState<string>("");
  const [upload, setUpload] = useState<any>({
    loading: false,
    imageUrl: "",
  });
  const [uploadBank, setUploadBank] = useState<any>({
    loading: false,
    imageUrl: "",
  })
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

  const getData = async () => {
    setIsLoading(true); ;

    try {
      const res = await requestGetPayment();
      setQrMomo(res.data[0].MOMO)
      setQrBank(res.data[0].BANK)
      reactotron.logImportant!("LIST_VIP", res);
      if (res) {
        
      }
    } catch (error) {}
  };
  const uploadButton = (
    <div>
      {upload.loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  

  

  

  
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

  const handleChangeBank = (info: any) => {
    reactotron.logImportant!("info", info);
    if (info.file.status === "uploading") {
      setUploadBank({
        imageUrl: "",
        loading: true,
      });
      return;
    }

    if (info.file.status === "done" || info.file.status === "error") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        return setUploadBank({
          imageUrl: imageUrl,
          loading: false,
        });
      });
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

  

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // getListProduct(page);
  }, [page]);
  const handleOnFinish = async (values: any)  =>{
    const apiKey = "00ec1251d5a79a3c69c0dfe013e86412";
    const imageMoMo = values.MOMO.fileList[0].originFileObj;
    const name = values.MOMO.fileList[0].name;
    const resMomo = await uploadImageToCloud(apiKey, imageMoMo, name);

    const imageBank = values.BANK.fileList[0].originFileObj;
    const nameBank = values.BANK.fileList[0].name;
    const resBank = await uploadImageToCloud(apiKey, imageBank, nameBank);
    const res = await requestAddPayment({
      MOMO : resMomo,
      BANK : resBank,
      PAY_OFFLINE : "string",
      status : true
    })

    if (res) {
      getData();
      showToast("Thê ngân hàng thành công");
    } else{
      showToast("Thêm thất bại! Vui lòng kiểm tra lại và thửu lại")  
    }
  }

  return (
    <div style={{ marginTop: 10 }}>
      <PageHeader
        title="Thông tin ngân hàng"
        style={{ backgroundColor: "white", margin: "5px 10px 10px" }}
        extra={[
          <Header
            placeholderDrop={"Sắp xếp"}
            // showButton={true}
            
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
      <Form
        onFinish={(values: any) => {
          handleOnFinish(values);
        }}
      >
        <Form.Item 
        label="Ảnh momo"
        name="MOMO"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn ảnh momo!",
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

        <Form.Item 
        label="Ảnh ngân hàng"
        name="BANK"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn ngân hàng!",
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
              onChange={handleChangeBank}
            >
              {uploadBank.imageUrl ? (
                <img
                  crossOrigin="anonymous"
                  src={uploadBank.imageUrl}
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
        <Button type="primary" htmlType="submit">
          Cập nhật
        </Button>
      </Form>
      </div>
      <div
        style={{
          backgroundColor: "white",
          margin: "0px 10px 0px",
          padding: "15px 20px",
          display: "flex",
          textAlign: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="momo">
        <h1>Hình ảnh QR MOMO</h1>
        <img
          style={{ width: 350, height: 350 }}
        src={qrMomo} alt="" />
        </div>
        <div className="bank">
        <h1>Hình ảnh QR ngân hàng</h1>
        <img
          style={{ width: 350, height: 350 }}
        src={qrBank} alt="" />
        </div>
      </div>
    </div>
  );
};

export default VipScreen;
