import {
  CheckCircleOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  FileSearchOutlined,
  SwapOutlined,
  DisconnectOutlined,
  EditOutlined,
  ApiOutlined,
  RightSquareOutlined,
  UnlockOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Input,
  message,
  Modal,
  PageHeader,
  Popconfirm,
  Row,
  Select,
  Switch,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { createSearchParams, Outlet, useNavigate } from "react-router-dom";
import R from "../../component/assets";
import {
  COLUMNS_CUSTOMER,
  convertVndToDollar,
  IsLimitedOrder,
  UNIT,
  UserBankNames,
} from "../../config/constants";
import { ADMIN_ROUTER_PATH } from "../../config/router";
import reactotron from "../../ReactotronConfig";
import { URL_IMAGE } from "../../service/ApiService";
import {
  requestAdjustmentBalance,
  requestBlockCashOut,
  requestBlockOrder,
  requestChangePasswordCashOutCustomer,
  requestDefrostBalance,
  requestDeleteCus,
  requestDeleteListUser,
  requestFreezeBalance,
  requestGetListCustomer,
  requestGetListLevel,
  requestGetListProduct,
  requestGetListProductVip,
  requestProductMustPurchase,
  requestResetPasswordCustomer,
  requestSetVipCustomer,
  requestUpdateInfoCus,
  requestUpdateLimitOrder,
  requestUpdateLimitOrderAndProductMustPurchase,
} from "../../service/network/Api";
import DateUtil from "../../util/DateUtil";
import { formatPrice, showToast } from "../../util/funcUtils";
import { Header } from "../dashboard/component/Header";
import ButtonBottomModal from "../product/component/ButtonBottomModal";

const { Option } = Select;

const CustomerScreen = () => {
  const [loading, setLoading] = useState(false);
  const [listCustomer, setListCustomer] = useState<any>([]);
  const [visible, setVisible] = useState<any>({
    type: 0,
    show: false,
  });
  const [idCustomer, setIdCustomer] = useState<any>();
  const [item, setItem] = useState<any>();
  const [input, setInput] = useState<any>();
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const LIMIT = 12;
  const navigate = useNavigate();
  const [listVip, setListVip] = useState<any>([]);
  const [loadMore, setLoadMore] = useState<any>(false);
  const [vipId, setVipId] = useState<any>();
  const [search, setSearch] = useState<any>(undefined);
  const [idProduct, setIdProduct] = useState<any>();
  const [listProduct, setListProduct] = useState<any>([]);
  const [numberOrder, setNumberOrder] = useState<any>({
    num: "",
    isLimited_order: IsLimitedOrder.Limited,
  });
  const [infoCus, setInfoCusr] = useState<any>({
    name: "",
    name_address: "",
    phone_address: "",
    address: "",
    bank_full_name: "",
    bank_phone: "",
    bank_number: "",
    bank_name: "",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [userIds, setUserIds] = useState<any>([]);
  const getData = async (vip?: any) => {
    setLoading(true);
    let payload = {
      page: page,
      limit: LIMIT,
      from: undefined,
      to: undefined,
      search: search,
    };
    try {
      const res = await requestGetListCustomer(payload);
      if (res) {
        setLoading(false);
        let data = res.data;
        data.map((item: any) => {
          if (item?.level) {
            vip.map((vipItem: any) => {
              if (item?.level == vipItem.key) {
                item.levelName = vipItem.name;
                return;
              }
            });
            return;
          }
          item.levelName = vip[0].name;
        });
        reactotron.logImportant!("DATA", data);

        // setTimeout(() => {
        setListCustomer(data);
        setTotalPage(res.meta.pagination.total);
        // }, 500);
      }
    } catch (error) { }
  };
  const getListProductVip = async (key: any) => {
    setLoadMore(true);
    try {
      // const res = await requestGetListProductVip(key);
      const res = await requestGetListProduct({ limit: 1000 });
      if (res) {
        setListProduct(res?.data);
      }
    } catch (error) { }
  };

  const handleMoney = async (id: any, type?: any) => {
    let totalMoney;
    if (!input) {
      return message.warning("Vui lòng nhâọ số tiền!");
    }
    if (isNaN(input)) {
      return message.warning("Số tiền vui lòng nhập bằng số!");
    }

    if (type == 1) {
      totalMoney = +input + item.balance;
    }
    if (type == 2) {
      if (+input > +item.balance)
        return message.warning("Số dư của khách hàng hiện không đủ để trừ!");
      totalMoney = item.balance - +input;
    }
    if (type == 5 || type == 6) {
      // if (+input > +item.balance)
      //   return message.warning("Số dư của khách hàng hiện không đủ!");
      if (type == 5 && +input > +item.balance)
        return message.warning(
          "Số tiềng đóng băng phải nhỏ hơn hoặc bằng số dư tài khoản!"
        );
      if (type == 6 && +input > +item.frozen_balance)
        return message.warning(
          "Số tiền mở đóng băng phải nhỏ hơn hoặc bằng số tiền đã đóng băng!"
        );
      totalMoney = +input;
    }
    let payload = {
      userId: id,
      body: {
        amount: totalMoney,
        money: +input,
      },
    };
    reactotron.logImportant!("payload", payload);
    try {
      const res =
        type == 5
          ? await requestFreezeBalance(payload)
          : type == 6
            ? await requestDefrostBalance(payload)
            : await requestAdjustmentBalance(payload);
      if (res) {
        setVisible({
          ...visible,
          type: 0,
          show: false,
        });
        getData(listVip);
        setInput("");
        showToast(
          type == 5
            ? "Đóng băng số dư thành công!"
            : type == 6
              ? "Mở đóng băng số dư thành công"
              : "Cộng tiền thành công!"
        );
      }
    } catch (error) {
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại");
    }
  };

  const handleResetPassword = async (type: number) => {
    if (!input) {
      message.warning("vui lòng nhập mật khẩu mới!");
      return;
    }
    let payload = {
      id: idCustomer,
      body: {
        password: input,
      },
    };
    let payload1 = {
      id: idCustomer,
      body: {
        tfa_password: input,
      },
    };
    try {
      const res =
        type == 3
          ? await requestResetPasswordCustomer(payload)
          : await requestChangePasswordCashOutCustomer(payload1);
      if (res) {
        setVisible({
          ...visible,
          type: 0,
          show: false,
        });
        setInput("");
        showToast("Đặt lại mật khẩu thành công!");
      }
    } catch (error) {
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };
  const handleSetVipCustomer = async () => {
    if (!vipId?.key) {
      message.warning("vui lòng chọn mức vip!");
      return;
    }
    let payload = {
      userId: idCustomer,
      levelKey: vipId?.key,
    };
    try {
      const res = await requestSetVipCustomer(payload);
      if (res) {
        setVisible({
          ...visible,
          type: 0,
          show: false,
        });
        setInput("");
        showToast("Thiết lập mức Vip thành công!");
        getData(listVip);
      }
    } catch (error) {
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };
  const handleSwitchStatus = async (id: any, type: any) => {
    try {
      const res =
        type == 1 ? await requestBlockCashOut(id) : await requestBlockOrder(id);
      if (res) {
        showToast("Cập nhật trạng thái thành công!");
        getData(listVip);
      }
    } catch (error) {
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };
  const getVip = async () => {
    const payload = {
      page: 1,
      limit: 1000,
      from: "",
      to: "",
      name: "",
    };
    try {
      const res = await requestGetListLevel(payload);
      if (res) {
        getData(res.data);
        setListVip(res.data);
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  const handleChooseProduct = async (id: any) => {
    // reactotron.logImportant!("test");
    // return;
    let payload = {
      userId: id,
      productId: idProduct._id,
    };
    try {
      const res = await requestProductMustPurchase(payload);
      if (res) {
        setVisible({
          ...visible,
          type: 0,
          show: false,
        });
        showToast("Thiết lập sản phẩm thành công!");
        getData(listVip);
      }
    } catch (error) {
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  const handleConfigOrder = async (id: any) => {
    // reactotron.logImportant!("test");
    // return;
    let payload = {
      userId: id,
      body: numberOrder,
    };
    try {
      const res = await requestUpdateLimitOrder(payload);
      if (res) {
        setVisible({
          ...visible,
          type: 0,
          show: false,
        });
        showToast("Thiết lập đơn hàng thành công!");
        setNumberOrder({
          ...numberOrder,
          num: "",
        });
        getData(listVip);
      }
    } catch (error) {
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  const handeConfigLimitOrderAndProduct = async (id: string) => {
    const payload = {
      userId: id,
      body: {
        ...numberOrder,
        is_limited_order: IsLimitedOrder.Limited,
        product_id: idProduct._id,
      },
    };
    console.log("payload", payload);
    if (!payload?.body?.num) return showToast("Vui lòng nhập giới hạn đơn.");
    if (!payload?.body?.product_id) return showToast("Vui lòng chọn sản phẩm.");
    try {
      const res = await requestUpdateLimitOrderAndProductMustPurchase(payload);
      if (res) {
        setVisible({
          ...visible,
          type: 0,
          show: false,
        });
        showToast("Thiết lập đơn hàng thành công!");
        setNumberOrder({
          ...numberOrder,
          num: "",
        });
        getData(listVip);
      }
    } catch (error) {
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  const handleDeleteCustomer = async (id: any) => {
    try {
      const res = await requestDeleteCus(id);
      if (res) {
        showToast("Xoá khách hàng thành công!");
        getData(listVip);
      }
    } catch (error) {
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  const handeUpdateInfo = async (id: any) => {
    let payload = {
      userId: id,
      body: {
        name: infoCus?.name || null,
        name_address: infoCus?.name_address || null,
        phone_address: infoCus?.phone_address || null,
        address: infoCus?.address || null,
        bank_full_name: infoCus?.bank_full_name || null,
        bank_phone: infoCus?.bank_phone || null,
        bank_number: infoCus?.bank_number || null,
        bank_name: infoCus?.bank_name || null,
      },
    };
    try {
      const res = await requestUpdateInfoCus(payload);
      console.log("res", res);
      if (res?.code !== 404 && res?.statusCode !== 500) {
        setVisible({
          ...visible,
          type: 0,
          show: false,
        });
        showToast("Cập nhật thông tin khách hàng thành công!");
        setInfoCusr({
          name: "",
          name_address: "",
          phone_address: "",
          address: "",
          bank_full_name: "",
          bank_phone: "",
          bank_number: "",
          bank_name: "",
        });
        getData(listVip);
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  const handleDeleteListUser = async () => {
    console.log("====================================");
    console.log("asadasda");
    console.log("====================================");
    // return;
    try {
      const res = await requestDeleteListUser({ user_ids: userIds });
      if (res) {
        showToast("Xoá khách hàng thành công!");
        getData(listVip);
        setUserIds([]);
        setSelectedRowKeys([]);
      }
    } catch (error) {
      showToast("Đã có lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    let user_ids: any = [];
    newSelectedRowKeys.map((el: any) => {
      return user_ids.push(listCustomer[+el]?._id);
    });
    console.log("user_ids: ", user_ids);
    setUserIds(user_ids);

    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    getVip();
  }, [page]);
  useEffect(() => {
    if (item?.level) {
      getListProductVip(item.level);
      return;
    }
    if (listVip?.length) {
      getListProductVip(listVip[0].key);
      return;
    }
  }, [item]);

  useEffect(() => {
    let timeout: any;
    if (search != undefined) {
      timeout = setTimeout(() => {
        getData(listVip);
      }, 250);
      return;
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [search]);

  const renderConfigOrder = () => {
    return (
      <div>
        <label
          style={{ fontWeight: "bolder", color: "GrayText", marginTop: 10 }}
          children={"Số đơn bị khoá"}
        />
        <Input
          value={numberOrder.num.toString()}
          style={{ marginTop: 5, marginBottom: 10 }}
          placeholder={"Nhập số đơn bị khoá"}
          onChange={(e) => {
            setNumberOrder({
              ...numberOrder,
              num: +e.target.value,
            });
          }}
        />
      </div>
    );
  };

  const renderConfigOrderAndProduct = () => {
    return (
      <div
        style={{
          marginBottom: 30,
          width: "100%",
        }}
      >
        <Col style={{ width: "80%" }}>
          <label
            style={{ fontWeight: "bolder", color: "GrayText", marginTop: 10 }}
            children={"Số đơn bị khoá"}
          />
          <Input
            value={numberOrder.num.toString()}
            style={{ marginTop: 5, marginBottom: 10 }}
            placeholder={"Nhập số đơn bị khoá"}
            onChange={(e) => {
              setNumberOrder({
                ...numberOrder,
                num: +e.target.value,
              });
            }}
          />
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
                <Option value={index} key={item?._id}>
                  {
                    <Col>
                      <h3>
                        [{index + 1}]{item.name}
                      </h3>
                      <h4 style={{ color: "red" }}>
                        {"Giá:" + formatPrice(item.price.toFixed(2)) + UNIT}
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
            value={formatPrice(idProduct?.price.toFixed(2) || 0) + UNIT}
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
    );
  };

  const renderUpdateUserInfo = () => {
    return (
      <div>
        <div>
          <label>{"Tên khách hàng"}</label>
          <Input
            value={infoCus.name}
            style={{ marginTop: 10 }}
            placeholder={"Nhập tên khách hàng"}
            onChange={(e) => {
              setInfoCusr({
                ...infoCus,
                name: e.target.value,
              });
            }}
          />
        </div>
        <div>
          <h3 style={{ marginTop: 5, color: "blueviolet" }}>
            {"Thông tin khách hàng nhận hàng"}
          </h3>
          <div>
            <label>{"Họ tên"}</label>
            <Input
              value={infoCus.name_address}
              style={{ marginTop: 10 }}
              placeholder={"Nhập họ tên"}
              onChange={(e) => {
                setInfoCusr({
                  ...infoCus,
                  name_address: e.target.value,
                });
              }}
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <label>{"Số điện thoại"}</label>
            <Input
              value={infoCus.phone_address}
              style={{ marginTop: 10 }}
              placeholder={"Nhập số điện thoại"}
              onChange={(e) => {
                setInfoCusr({
                  ...infoCus,
                  phone_address: e.target.value,
                });
              }}
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <label>{"Địa chỉ"}</label>
            <Input
              value={infoCus.address}
              style={{ marginTop: 10 }}
              placeholder={"Nhập địa chỉ"}
              onChange={(e) => {
                setInfoCusr({
                  ...infoCus,
                  address: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <h3 style={{ marginTop: 15, color: "blueviolet" }}>
          {"Thông tin thẻ ngân hàng"}
        </h3>
        <div style={{ marginTop: 10 }}>
          <label>{"Tên ngân hàng"}</label>
          <Select
            value={infoCus?.bank_name}
            allowClear
            showSearch
            placeholder={"Chọn tên ngân hàng"}
            style={{ width: "100%", marginTop: 8 }}
            onChange={(value) => {
              setInfoCusr({
                ...infoCus,
                bank_name: value,
              });
            }}
            filterOption={(input, option) =>
              (option!.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {Object.values(UserBankNames).map((bank: any) => {
              return <Option value={bank}>{bank}</Option>;
            })}
          </Select>
        </div>
        <div style={{ marginTop: 10 }}>
          <label>{"Số tài khoản"}</label>
          <Input
            value={infoCus.bank_number}
            style={{ marginTop: 10 }}
            placeholder={"Nhập số tài khoản"}
            onChange={(e) => {
              setInfoCusr({
                ...infoCus,
                bank_number: e.target.value,
              });
            }}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>{"Họ và tên"}</label>
          <Input
            value={infoCus.bank_full_name}
            style={{ marginTop: 10 }}
            placeholder={"Nhập họ và tên"}
            onChange={(e) => {
              setInfoCusr({
                ...infoCus,
                bank_full_name: e.target.value,
              });
            }}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>{"Số điện thoại"}</label>
          <Input
            value={infoCus.bank_phone}
            style={{ marginTop: 10 }}
            placeholder={"Nhập số điện thoại"}
            onChange={(e) => {
              setInfoCusr({
                ...infoCus,
                bank_phone: e.target.value,
              });
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div style={{ marginTop: 10 }}>
      <PageHeader
        title="Khách hàng"
        style={{ backgroundColor: "white", margin: "5px 10px 10px" }}
        extra={[
          <Header
            placeholderSearch={"Nhập tên hoặc số điện thoại"}
            onSearchSubmit={(input: any) => {
              setSearch(input);
            }}
            onStatusSubmit={(statusKey: string) => { }}
            placeholderDrop={"Sắp xếp"}
            dataDropdown={[]}
            showButton={!!selectedRowKeys?.length}
            title={"Xoá"}
            onClick={handleDeleteListUser}
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
          loading={loading}
          dataSource={listCustomer}
          bordered
          rowKey={(_, index) => `${index}`}
          columns={COLUMNS_CUSTOMER}
          rowSelection={rowSelection}
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
                    <div style={{}}>
                      <Col>
                        <Button
                          onClick={() => {
                            navigate({
                              pathname: `${ADMIN_ROUTER_PATH.CUSTOMER_TRANSACTION}`,
                              search: createSearchParams({
                                userId: item._id,
                              }).toString(),
                            });
                          }}
                          type="text"
                          size="large"
                          icon={<SwapOutlined />}
                          style={{
                            color: "tomato",
                          }}
                        >
                          Lịch sử giao dịch
                        </Button>
                        <Button
                          onClick={() => {
                            setIdCustomer(item._id);
                            setItem(item);
                            setVisible({
                              ...visible,
                              type: 5,
                              show: true,
                            });
                            setInput("");
                          }}
                          type="text"
                          size="large"
                          icon={<DisconnectOutlined />}
                          style={{
                            color: "ThreeDShadow",
                          }}
                        >
                          Đóng băng số dư
                        </Button>{" "}
                      </Col>
                    </div>,
                    <div>
                      <Button
                        onClick={() => {
                          navigate({
                            pathname: `${ADMIN_ROUTER_PATH.CUSTOMER_ORDER}`,
                            search: createSearchParams({
                              userId: item._id,
                            }).toString(),
                          });
                        }}
                        type="text"
                        size="large"
                        icon={<FileSearchOutlined />}
                        style={{
                          color: "blueviolet",
                        }}
                      >
                        Lịch sử đơn hàng
                      </Button>
                      <Button
                        onClick={() => {
                          setIdProduct(undefined);
                          setIdCustomer(item._id);
                          setItem(item);
                          setVisible({
                            ...visible,
                            type: 7,
                            show: true,
                          });
                          setInput("");
                        }}
                        type="text"
                        size="large"
                        icon={<RightSquareOutlined />}
                        style={{
                          color: "#42032C",
                        }}
                      >
                        Sản phẩm kế tiếp
                      </Button>
                    </div>,
                    <Col>
                      <Button
                        onClick={() => {
                          setIdCustomer(item._id);
                          setItem(item);
                          setVisible({
                            ...visible,
                            type: 4,
                            show: true,
                          });
                          setInput("");
                        }}
                        type="text"
                        size="large"
                        icon={<EditOutlined color="red" />}
                        style={{
                          color: "green",
                        }}
                      >
                        Thiết lập Vip
                      </Button>
                      <Button
                        onClick={() => {
                          setIdCustomer(item._id);
                          setVisible({
                            ...visible,
                            type: 6,
                            show: true,
                          });
                          setInput("");
                          setItem(item);
                        }}
                        type="text"
                        size="large"
                        icon={<ApiOutlined />}
                        style={{
                          color: "chocolate",
                        }}
                      >
                        Mở đóng băng số dư
                      </Button>
                    </Col>,
                    <Col>
                      <Button
                        onClick={() => {
                          setIdCustomer(item._id);
                          setItem(item);
                          setVisible({
                            ...visible,
                            type: 1,
                            show: true,
                          });
                          setInput("");
                        }}
                        type="text"
                        size="large"
                        icon={<PlusCircleOutlined color="red" />}
                        style={{
                          color: "#1890ff",
                        }}
                      >
                        Cộng tiền
                      </Button>
                      <Button
                        onClick={() => {
                          setIdCustomer(item._id);
                          setVisible({
                            ...visible,
                            type: 8,
                            show: true,
                          });
                          setNumberOrder({
                            ...numberOrder,
                            num: "",
                          });
                        }}
                        type="text"
                        size="large"
                        icon={<UnlockOutlined />}
                        style={{
                          color: "#0F3D3E",
                        }}
                      >
                        Giới hạn đơn hàng
                      </Button>
                    </Col>,

                    <Col>
                      <Button
                        onClick={() => {
                          setVisible({
                            ...visible,
                            type: 2,
                            show: true,
                          });
                          setInput("");
                          setIdCustomer(item._id);
                          setItem(item);
                        }}
                        type="text"
                        size="large"
                        icon={<MinusCircleOutlined color="red" />}
                        style={{
                          color: "red",
                        }}
                      >
                        Trừ tiền
                      </Button>
                      ,
                      <Button
                        onClick={() => {
                          setIdCustomer(item._id);
                          setVisible({
                            ...visible,
                            type: 9,
                            show: true,
                          });
                          setNumberOrder({
                            ...numberOrder,
                            num: "",
                          });
                          setIdProduct(undefined);
                          setItem(item);
                          setInput("");
                        }}
                        type="text"
                        size="large"
                        icon={<UnlockOutlined />}
                        style={{
                          color: "#0F3D3E",
                        }}
                      >
                        {`Giới hạn đơn hàng 
                        & Sản phẩm kế tiếp`}
                      </Button>
                    </Col>,
                    <div>
                      <Col>
                        <div>
                          <Button
                            onClick={() => {
                              setVisible({
                                ...visible,
                                type: 3,
                                show: true,
                              });
                              setInput("");
                              setIdCustomer(item._id);
                              setItem(item);
                            }}
                            type="text"
                            size="large"
                            icon={
                              <img
                                src={R.images.img_reset_password}
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginRight: 10,
                                }}
                              />
                            }
                          >
                            Đặt lại mật khẩu
                          </Button>
                          <Button
                            onClick={() => {
                              setVisible({
                                ...visible,
                                type: 10,
                                show: true,
                              });
                              setInput("");
                              setIdCustomer(item._id);
                              setItem(item);
                            }}
                            type="text"
                            size="large"
                            icon={
                              <img
                                src={R.images.img_reset_password}
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginRight: 10,
                                }}
                              />
                            }
                          >
                            Đổi mật khẩu rút tiền
                          </Button>
                        </div>
                        <Popconfirm
                          title={"Bạn chắc chắn muốn xoá khách hàng này không?"}
                          onConfirm={() => {
                            handleDeleteCustomer(item._id);
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
                        </Popconfirm>
                      </Col>
                    </div>,
                  ]}
                >
                  <div>
                    <Row style={{ alignItems: "center" }}>
                      <h3
                        style={{
                          color: "#007aff",
                          flex: 1,
                        }}
                        children={"Cập nhật thông tin tài khoản"}
                      />
                      <Button
                        onClick={() => {
                          setVisible({
                            ...visible,
                            type: 11,
                            show: true,
                          });
                          setInput("");
                          setIdCustomer(item._id);
                          setItem(item);
                          setInfoCusr({
                            name: item?.name,
                            name_address: item?.order_address.name,
                            phone_address: item?.order_address.phone,
                            address: item?.order_address.address,
                            bank_full_name: item?.bank?.full_name,
                            bank_phone: item?.bank?.phone,
                            bank_number: item?.bank?.bank_number,
                            bank_name: item?.bank?.bank_name,
                          });
                        }}
                        type="text"
                        size="large"
                        icon={<EditOutlined />}
                        style={{
                          color: "blueviolet",
                        }}
                      />
                    </Row>
                    <Row style={{ marginTop: 20 }}>
                      <Col flex={1}>
                        <h4>Mã khách hàng: {item._id}</h4>
                        <h4>Số điện thoại: {item.phone}</h4>
                        <Row>
                          <h4>Khóa rút tiền: </h4>
                          <Switch
                            style={{ marginLeft: 10 }}
                            checkedChildren="Bật"
                            unCheckedChildren="Tắt"
                            checked={!item.is_block_cashout}
                            onChange={() => {
                              handleSwitchStatus(item._id, 1);
                            }}
                          />
                        </Row>{" "}
                        <Row>
                          <h4>Khóa nhận đơn hàng: </h4>
                          <Switch
                            checked={!item.is_block_create_order}
                            style={{ marginLeft: 10 }}
                            checkedChildren="Bật"
                            unCheckedChildren="Tắt"
                            onChange={() => {
                              handleSwitchStatus(item._id, 2);
                            }}
                          />
                        </Row>
                      </Col>
                      <Col flex={1}>
                        <h4>Tên khách hàng: {item.name}</h4>
                        <h4>
                          Số dư:{" "}
                          {(formatPrice(item.balance.toFixed(2)) || 0) + UNIT}
                        </h4>
                        <h4>
                          Số tiền đóng băng:{" "}
                          {(formatPrice(item.frozen_balance.toFixed(2)) || 0) +
                            UNIT}
                        </h4>
                      </Col>
                      <Col flex={1}>
                        <h4>Cấp độ: {item.level}</h4>
                        <h4>
                          Ngày tạo:{" "}
                          {DateUtil.formatTimeDateReview(item.created_at)}
                        </h4>
                        <h4>
                          Mã giới thiệu: {item?.reference_code || item?.phone}
                        </h4>

                        <h4>
                          Người giới thiệu:{" "}
                          {item?.recommender
                            ? `${item?.recommender?.phone} (${item?.recommender?.reference_code})`
                            : ""}
                        </h4>
                      </Col>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      {item?.bank ? (
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              color: "#007aff",
                            }}
                            children={"Thông tin tài khoản ngân hàng"}
                          />
                          <Row style={{ marginTop: 20 }}>
                            <Col flex={1}>
                              <h4>Ngân hàng: {item?.bank?.bank_name}</h4>
                              <h4>Tên tài khoản: {item?.bank?.full_name}</h4>
                              <h4>Số tài khoản: {item?.bank?.bank_number}</h4>
                              <h4>Số điện thoại: {item?.bank?.phone}</h4>
                            </Col>
                          </Row>
                        </div>
                      ) : null}
                      {item?.order_address ? (
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              color: "#007aff",
                            }}
                            children={"Thông tin tài khoản người nhận"}
                          />
                          <Row style={{ marginTop: 20 }}>
                            <Col flex={1}>
                              <h4>Họ tên: {item?.order_address?.name}</h4>
                              <h4>
                                Số điện thoại: {item?.order_address?.phone}
                              </h4>
                              <h4>Địa chỉ: {item?.order_address?.address}</h4>
                            </Col>
                          </Row>
                        </div>
                      ) : null}
                    </Row>
                  </div>
                  {item?.product_must_purchase ? (
                    <div>
                      <h3
                        style={{
                          color: "#007aff",
                        }}
                        children={"Thông tin sản phẩm thiết lập  kế tiếp"}
                      />
                      <Row style={{ marginTop: 20 }}>
                        <Col flex={1}>
                          <h4>Ảnh sản phẩm:</h4>
                          <img
                            crossOrigin="anonymous"
                            alt="product"
                            src={`${URL_IMAGE}/${item?.product_must_purchase?.product?.image}`}
                            style={{
                              width: 150,
                              height: 150,
                              resize: "vertical",
                            }}
                          />
                        </Col>
                        <Col flex={1}>
                          <h4>
                            Số đơn giới hạn còn lại: {item?.limited_order?.num}{" "}
                            đơn
                          </h4>
                          <h4>
                            Giá:{" "}
                            {formatPrice(
                              item.product_must_purchase.product?.price.toFixed(
                                2
                              )
                            ) || 0}{" "}
                            {UNIT}
                          </h4>
                          <h4>
                            Tên sản phẩm:{" "}
                            {item?.product_must_purchase?.product?.name}
                          </h4>
                        </Col>
                        <Col flex={1}>
                          <h4>
                            Ngày tạo:{" "}
                            {DateUtil.formatTimeDateReview(
                              item?.product_must_purchase?.product?.updated_at
                            )}
                          </h4>
                        </Col>
                      </Row>
                    </div>
                  ) : null}
                </Card>
              </div>
            ),
          }}
        />
        <Modal
          onCancel={() => {
            setVisible({
              ...visible,
              type: 0,
              show: false,
            });
            setIdCustomer(undefined);
            setItem(undefined);
          }}
          maskClosable={false}
          footer={null}
          title={
            visible.type == 1
              ? "Cộng tiền cho khách hàng"
              : visible.type == 2
                ? "Trừ tiền của khách hàng"
                : visible.type == 3
                  ? "Đặt lại mật khẩu"
                  : visible.type == 5
                    ? "Đóng băng tài khoản"
                    : visible.type == 6
                      ? "Mở đóng băng tài khoản"
                      : visible.type == 7
                        ? "Chọn sản phẩm"
                        : visible.type == 8
                          ? "Thiết lập đơn"
                          : visible.type === 9
                            ? "Giới hạn đơn hàng và sản phẩm kế tiếp"
                            : visible.type === 10
                              ? "Đổi mật khẩu rút tiền"
                              : "Thiết lập Vip"
          }
          visible={visible.show}
        >
          {visible.type == 7 ? (
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
                      <Option value={index} key={item?._id}>
                        {
                          <Col>
                            <h3>
                              [{index + 1}]{item.name}
                            </h3>
                            <h4 style={{ color: "red" }}>
                              {"Giá:" +
                                formatPrice(item.price.toFixed(2)) +
                                UNIT}
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
                  value={formatPrice(idProduct?.price.toFixed(2) || 0) + UNIT}
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
          ) : visible.type == 8 ? (
            renderConfigOrder()
          ) : visible.type == 9 ? (
            renderConfigOrderAndProduct()
          ) : visible.type == 11 ? (
            renderUpdateUserInfo()
          ) : (
            <div>
              <label>
                {visible.type == 3 || visible.type == 10
                  ? "Mật khẩu mới"
                  : visible.type == 4
                    ? "Mức Vip"
                    : "Số tiền"}
              </label>

              {visible.type !== 4 ? (
                <div>
                  <Input
                    value={input}
                    style={{ marginTop: 10 }}
                    placeholder={
                      visible.type == 3 || visible.type == 10
                        ? "Nhập mật khẩu mới"
                        : "Nhập số tiền"
                    }
                    onChange={(e) => {
                      setInput(e.target.value);
                    }}
                  />
                  {visible.type == 5 || visible.type == 6 ? (
                    <div style={{ marginBottom: 30, marginTop: 10 }}>
                      <h4
                        children={
                          `Số dư hiện tại: ${formatPrice(item.balance.toFixed(2)) || 0
                          }` + UNIT
                        }
                      />
                      <Checkbox
                        checked={item.balance === input}
                        onChange={() => {
                          setInput(item.balance === input ? "" : item.balance);
                        }}
                      >
                        Tất cả số dư
                      </Checkbox>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Select
                  allowClear
                  placeholder={"Chọn mức vip"}
                  style={{ width: "100%", marginTop: 8, marginBottom: 20 }}
                  onChange={(value) => {
                    setVipId(listVip[value]);
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
                  {listVip.map((item: any, index: number) => {
                    return (
                      <Option value={index}>
                        {
                          <Row>
                            <h3>{item.name}</h3>
                          </Row>
                        }
                      </Option>
                    );
                  })}
                </Select>
              )}
            </div>
          )}

          <ButtonBottomModal
            isLoadingButton={false}
            onCancel={() => {
              setVisible({
                ...visible,
                type: 0,
                show: false,
              });
              setIdCustomer(undefined);
              setItem(undefined);
              setInput("");
            }}
            onClickconfirm={() => {
              if (visible.type == 3) {
                handleResetPassword(3);
                return;
              }
              if (visible.type == 10) {
                handleResetPassword(10);
                return;
              }
              if (visible.type == 4) {
                handleSetVipCustomer();
                return;
              }
              if (visible.type == 5) {
                handleMoney(idCustomer, visible.type);
                return;
              }
              if (visible.type == 6) {
                handleMoney(idCustomer, visible.type);
                return;
              }
              if (visible.type == 7) {
                handleChooseProduct(idCustomer);
                return;
              }
              if (visible.type == 8) {
                handleConfigOrder(idCustomer);
                return;
              }
              if (visible.type === 9) {
                handeConfigLimitOrderAndProduct(idCustomer);
                return;
              }
              if (visible.type === 11) {
                handeUpdateInfo(idCustomer);
                return;
              }
              handleMoney(idCustomer, visible.type);
            }}
            text={"Xác nhận"}
          />
        </Modal>
      </div>
      <Outlet />
    </div>
  );
};

export default CustomerScreen;
