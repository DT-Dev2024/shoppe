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
import { TVoucher } from "src/types/purchase.type";
enum StatusOrder {
  ALL = "Tất cả",
  WAITING = "Chờ thanh toán",
  DELIVERING = "Vận chuyển",
  WAIT_RECEIVED = "Chờ giao hàng",
  DELIVERED = "Hoàn thành",
  CANCELED = "Đã hủy",
  RETURN = "Trả hàng/Hoàn tiền",
}
enum PaymentMethod {
  MOMO = "Momo",
  BANK = "Chuyển khoản ngân hàng",
  PAY_OFFLINE = "Thanh toán tiền mặt khi nhận hàng",
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
    totalPrice: 0,
    voucherPrice: 0,
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
        let totalPrice = (orderDetai?.buy_count || 1) * price;
        let voucherPrice = 0;
        if (response.data.voucher) {
          const voucher = response.data.voucher as TVoucher;
          console.log(voucher);
          if (voucher.discount_type === "PERCENTAGE") {
            const discount = totalPrice * (voucher.discount / 100);
            voucherPrice = discount;
            totalPrice -= discount;
            console.log(voucherPrice);
          } else {
            totalPrice -= voucher.discount;
            voucherPrice = voucher.discount;
          }
        }

        setPrice({
          price_before_discount,
          price,
          totalPrice,
          voucherPrice,
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
          <div className="mb-0 ">
            <button className="text-xl text-gray-500">
              <a href="/">TRỞ LẠI</a>
            </button>
          </div>
          <div className="mb- flex flex-col items-end  justify-items-end gap-1 lg:flex-row  lg:items-center lg:gap-8 ">
            <h1 className="text-lg font-semibold lg:text-xl">MÃ ĐƠN HÀNG </h1>
            <p className="text-[13px] lg:text-xl">{orderDetai?.orderId.toUpperCase()}</p>
            <span
              className={`text-[13px] font-semibold uppercase ${
                orderDetai?.status === "DELIVERED"
                  ? "text-main"
                  : orderDetai?.status === "CANCELED" || orderDetai?.status === "RETURN"
                  ? "text-red-500"
                  : "text-black"
              }`}
            >
              <p className="">{StatusOrder[orderDetai?.status as keyof typeof StatusOrder]}</p>
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
              <p className="text-xl text-gray-700">
                {addressStatus[0]?.created_at ? formatTimeDateReview(addressStatus[0]?.created_at) : "Đang dự kiến"}
              </p>
              <span
                className={`text-[13px] font-semibold  ${
                  orderDetai?.status === "DELIVERED"
                    ? "text-main"
                    : orderDetai?.status === "CANCELED" || orderDetai?.status === "RETURN"
                    ? "text-red-500"
                    : "text-black"
                }`}
              >
                <p className="">{StatusOrder[orderDetai?.status as keyof typeof StatusOrder]}</p>
              </span>
              {/* <p className="text-xl font-semibold text-green-600">Đã giao</p> */}
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

          <div className="relative hidden w-1/2 pl-6  lg:block ">
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
          <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center">
              <img
                src="https://down-vn.img.susercontent.com/file/vn-11134216-7r98o-lsuyr1h6x1nd7b_tn"
                alt=""
                className="h-16 w-16 rounded-full lg:h-24 lg:w-24"
              />
              <p className="text-2xl font-semibold">The Garden Official</p>
            </div>
            <button className="mr-2 hidden rounded bg-red-500 px-3 py-2 text-xl text-white lg:block">Yêu thích</button>

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
          <div className="mb-4 max-w-[450px] bg-white p-4 py-4">
            <div className="mb-4 flex justify-between gap-36">
              <p className="text-[16px] text-gray-500 lg:text-2xl">Tổng tiền hàng</p>
              <p className="text-[15px] text-gray-700 lg:text-2xl">
                ₫{formatCurrency((orderDetai?.buy_count || 1) * price.price)}
              </p>
            </div>
            <div className="mb-4 flex justify-between gap-36">
              <p className="text-[16px] text-gray-500 lg:text-2xl">Phí vận chuyển</p>
              <p className="text-[15px] text-gray-700 lg:text-2xl">₫{formatCurrency(32000)}</p>
            </div>
            <div className="mb-4 flex justify-between gap-36">
              <p className="text-[16px] text-gray-500 lg:text-2xl">Giảm giá phí vận chuyển</p>
              <p className="text-[15px] text-gray-700 lg:text-2xl">-₫{formatCurrency(32000)}</p>
            </div>
            {orderDetai?.voucher && (
              <div className="mb-4 flex justify-between gap-36">
                <p className="text-[16px] text-gray-500 lg:text-2xl">Voucher shoppe</p>
                <p className="text-[15px] text-gray-700 lg:text-2xl">₫{formatCurrency(price.voucherPrice)}</p>
              </div>
            )}
            <div className="mb-4 flex justify-between gap-36">
              <p className="text-[16px] text-gray-500 lg:text-2xl">Thành tiền</p>
              <p className="text-[15px] text-main lg:text-2xl">₫{formatCurrency(price.totalPrice)}</p>
            </div>
            <div className="mb-4 flex justify-between gap-36">
              <p className="text-[16px] text-gray-500 lg:text-2xl">Phương thức thanh toán</p>
              <p className="text-right text-[15px] text-gray-700 lg:text-2xl">
                {PaymentMethod[orderDetai?.payment_method as keyof typeof PaymentMethod]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryDetails;
