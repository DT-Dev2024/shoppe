import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaTruck } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import purchaseAPI from "src/apis/purchase.api";

import { LoadingPage } from "src/components/Loading/Loading";
import { TOrderHisotry, TOrderHistoryStatus } from "src/types/order.type";
import { formatCurrency } from "src/utils/formatNumber";
import "./orderHistoryDetails.css";
enum StatusOrder {
  ALL = "Tất cả",
  WAITING = "Chờ thanh toán",
  DELIVERING = "Vận chuyển",
  WAIT_RECEIVED = "Chờ giao hàng",
  DELIVERED = "Hoàn thành",
  CANCELED = "Đã hủy",
  RETURN = "Trả hàng/Hoàn tiền",
}

interface AddressDetail {
  address: string;
  created_at: string;
  status: TOrderHistoryStatus;
}

const formatTimeDateReview = (timestamp: string) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}-${month}-${year}`;
};
const OrderHistoryDetails = () => {
  const { id } = useParams();
  const [orderDetai, setOrderDetail] = useState<TOrderHisotry | null>(null);
  const [price, setPrice] = useState({
    price_before_discount: 0,
    price: 0,
  });
  const [addressStatus, setAddressStatus] = useState<AddressDetail[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getDetail = async () => {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.id === undefined) return;
      if (!id) return;
      const response = await purchaseAPI.getOrderDetail(id, user.id);
      if (response) {
        // setOrderDetail(response);
        setOrderDetail(response.data);
        const product = response.data.product;
        const price_before_discount = product.sale_price >= 0 ? product.price : 0;
        const price = product.sale_price > 0 ? product.price * ((100 - product.sale_price) / 100) : product.price;

        setPrice({
          price_before_discount,
          price,
        });
        setAddressStatus(response.data.list_address_status);
        setLoading(false);
      }
    };

    getDetail();
  }, [id]);

  if (loading) return <LoadingPage />;
  return (
    <div>
      <Helmet>
        <title>Chi tiết đơn hàng</title>
        <meta
          name="checkout"
          content={`Trang chi tiết đơn hàng của Shopee At Home`}
        />
      </Helmet>
      <div className="mx-auto max-w-[90%]  bg-gray-100  py-6">
        <div className="flex items-center justify-between rounded-lg bg-white p-6 shadow-md">
          <div className="mb-6 ">
            <button className="text-xl text-gray-500">
              <a href="/">TRỞ LẠI</a>
            </button>
          </div>
          <div className="mb-4 flex flex-col items-center justify-between gap-2  lg:flex-row lg:gap-8 ">
            <h1 className="text-xl font-semibold">MÃ ĐƠN HÀNG: {orderDetai?.orderId.toUpperCase()}</h1>
            <span
              className={`text-[16px] font-semibold uppercase ${
                orderDetai?.status === "DELIVERED"
                  ? "text-main"
                  : orderDetai?.status === "CANCELED" || orderDetai?.status === "RETURN"
                  ? "text-red-500"
                  : "text-black"
              }`}
            >
              {StatusOrder[orderDetai?.status as keyof typeof StatusOrder]}
            </span>
          </div>
        </div>
        <p className="letter mb-4 mt-0  w-[100%] lg:mb-0 "></p>
        <div className="mb-1 block bg-white p-4 lg:hidden">
          <div className="flex gap-4">
            <FaTruck className="text-3xl"></FaTruck>
            <h1 className="text-2xl font-semibold">Thông tin vận chuyển</h1>
          </div>
          <span className="ml-12 text-xl text-gray-500">Standard Express - VN2444522313553U</span>
          <div className="relative mb-4 ml-12 mt-4 flex items-start ">
            <div className="flex-shrink-0">
              <div className="rounded-full bg-green-500 p-2 text-white">
                <i className="fas fa-check"></i>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-xl text-gray-700">10:58 07-07-2024</p>
              <p className="text-xl font-semibold text-green-600">Đã giao</p>
            </div>
          </div>
        </div>
        <div className="mb-1  flex rounded-lg bg-white p-6 shadow-md">
          <div className="w-full pr-6 lg:w-1/2">
            <div className="flex gap-2">
              <FaLocationDot className="text-[20px]"></FaLocationDot>
              <h2 className="mb-4 text-2xl font-semibold lg:text-3xl">Địa Chỉ Nhận Hàng</h2>
            </div>
            <div className="mb-4 ml-10 lg:ml-0">
              <p className="mb-3 text-2xl text-gray-700">{orderDetai?.address.name}</p>
              <p className="mb-1 text-xl text-gray-500">(+84) {orderDetai?.address.phone}</p>
              <p className="text-xl text-gray-500">{orderDetai?.address.address}</p>
            </div>
          </div>

          <div className="relative hidden w-1/2 border-l pl-6 lg:block">
            {addressStatus
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((item, index) => {
                return (
                  <div
                    key={index}
                    className="relative mb-4 flex items-start"
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`relative z-20 rounded-full p-2 ${
                          item.status === orderDetai?.status ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <i className="fas fa-check"></i>
                      </div>
                      {index !== addressStatus.length - 1 && (
                        <div className="absolute bottom-0 left-2 top-4 h-full w-px bg-gray-300"></div>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-xl text-gray-700">
                        {formatTimeDateReview(item.created_at)}
                        {/* {DateUtil.formatTimeDateReview(created_at)} */}
                      </p>
                      <p className="text-[20px] text-lg text-gray-500">{item.address}</p>
                      {item?.status === "DELIVERED" && <p className="text-xl font-semibold text-main">ĐÃ GIAO</p>}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-md">
          <div className="mb-4 flex items-center gap-2">
            <button className="mr-2 rounded bg-red-500 px-3 py-2 text-xl text-white">Yêu thích</button>
            <button
              onClick={() => {
                window.open("https://jivo.chat/glwMlKZ57u", "_blank");
              }}
              className="rounded bg-primary px-3 py-2 text-xl text-white"
            >
              Chat
            </button>
          </div>
          <div className="border-t py-4">
            <div className="flex items-center justify-between">
              <div className="mb-4 flex items-start">
                <img
                  src={orderDetai?.product.image}
                  alt=""
                  className="mr-10 h-[90px] w-[90px]"
                />
                <div className="flex-1">
                  <p className="mb-1 line-clamp-1 max-w-[800px] text-2xl text-gray-700 lg:line-clamp-2">
                    {orderDetai?.product.name}
                  </p>
                  <p className="mb-2 text-xl text-gray-500">x{orderDetai?.buy_count}</p>
                  <div className="flex items-center">
                    <button className="mr-2 rounded border border-green-500 px-3 py-2 text-sm  text-green-800">
                      Trả hàng miễn phí 15 ngày
                    </button>
                  </div>
                </div>
              </div>
              {price.price_before_discount > 0 ? (
                <div className="flex items-center justify-start gap-2">
                  <p className="mr-2 hidden text-2xl text-gray-500 line-through lg:block">
                    ₫{formatCurrency(price.price_before_discount)}
                  </p>
                  <p className=" hidden text-2xl text-primary lg:block">₫{formatCurrency(price.price)}</p>
                </div>
              ) : (
                <div className="flex items-center justify-start gap-2">
                  <p className="mr-2 hidden text-2xl text-gray-500 line-through lg:block">
                    ₫{formatCurrency(price.price)}
                  </p>
                </div>
              )}
            </div>
            {price.price_before_discount > 0 ? (
              <div className="ml-48 mt-2 flex items-center  justify-start gap-2">
                <p className="mr-2 block text-2xl text-gray-500 line-through lg:hidden">
                  ₫{formatCurrency(price.price_before_discount)}
                </p>
                <p className=" block text-2xl text-primary lg:hidden">₫{formatCurrency(price.price)}</p>
              </div>
            ) : (
              <div className="ml-48 mt-2 flex items-center  justify-start gap-2">
                <p className="mr-2 block text-2xl text-gray-500 line-through lg:hidden">
                  ₫{formatCurrency(price.price)}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className=" flex border-spacing-1 justify-end  rounded-lg border bg-white  shadow-md">
          <div className="    mb-4 max-w-[400px] bg-white p-4 py-4">
            <div className="mb-4 flex justify-between gap-36">
              <p className="text-[20px] text-gray-500 lg:text-2xl">Thành tiền</p>
              <p className="text-[20px] text-gray-700 lg:text-3xl">
                ₫{formatCurrency((orderDetai?.buy_count || 1) * price.price)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryDetails;
