import { useContext, useEffect, useState } from "react";
import { CiCircleQuestion } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import { OrderContext } from "src/contexts/order.context";
import { TUser } from "src/types/user.types";
import { formatCurrency } from "src/utils/formatNumber";
import "./checkout.css";
import { TExtendedPurchases } from "src/types/purchase.type";
import Voucher from "src/assets/img/voucher.png";
import Coin from "src/assets/img/coin.png";
import { Helmet } from "react-helmet-async";
import "../../components/old/GlobalStyles/GlobalStyles.css"
const Checkout = () => {
  const defaultUser: TUser = {
    _id: "2",
    roles: ["User"],
    email: "email@gmail.com",
    name: "Alex",
    date_of_birth: "1999-02-22",
    address: "Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
    avatar: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
    code: "+84",
    phone: "123456789",
    createdAt: "2022-02-22T07:00:00.000Z",
    updatedAt: "2022-02-22T07:00:00.000Z",
  };

   const { order } = useContext(OrderContext);
  const [user, setUser] = useState<TUser>(defaultUser);
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user);
    } else {
      setUser(defaultUser);
    }
  }, []);
   useEffect(() => {
    console.log("Order:", order);
  }, [order]);

  const shippingFee = 32000;
  const CaculateDateShip = () => {
    const date = new Date();
    const day = date.getDate();
    const dayReceive = day + 3;
    const dayReceive2 = day + 5;
    return ` ${dayReceive} Tháng ${date.getMonth() + 1} - ${dayReceive2} Tháng ${date.getMonth() + 1}`;
  };

  // Function to handle payment method selection
  const paymentMethod = (e: React.MouseEvent<HTMLLIElement>) => {
    const paymentItems = document.querySelectorAll("li");
    paymentItems.forEach((item) => {
      item.classList.remove("bg-main", "text-white");
    });
    e.currentTarget.classList.add("bg-main", "text-white");
  };

  const Item = ({ item }: { item: TExtendedPurchases }) => {
    return (
      <div
        key={item._id}
        className="w-ful mb-6 rounded bg-white text-[15px]"
      >
        <p className="flex px-3 py-2 space-x-4 lg:px-8 lg:py-4">
          <span className="mr-3 uppercase">{item.product.category.name}</span>
          <span className="cursor-pointer text-[#26aa99]">
            <svg
              viewBox="0 0 16 16"
              className="inline-block mr-1 shopee-svg-icon FpgzUK"
              width="16"
              height="16"
            >
              <g
                fillRule="evenodd"
                fill="#26aa99"
              >
                <path d="M15 4a1 1 0 01.993.883L16 5v9.932a.5.5 0 01-.82.385l-2.061-1.718-8.199.001a1 1 0 01-.98-.8l-.016-.117-.108-1.284 8.058.001a2 2 0 001.976-1.692l.018-.155L14.293 4H15zm-2.48-4a1 1 0 011 1l-.003.077-.646 8.4a1 1 0 01-.997.923l-8.994-.001-2.06 1.718a.5.5 0 01-.233.108l-.087.007a.5.5 0 01-.492-.41L0 11.732V1a1 1 0 011-1h11.52zM3.646 4.246a.5.5 0 000 .708c.305.304.694.526 1.146.682A4.936 4.936 0 006.4 5.9c.464 0 1.02-.062 1.608-.264.452-.156.841-.378 1.146-.682a.5.5 0 10-.708-.708c-.185.186-.445.335-.764.444a4.004 4.004 0 01-2.564 0c-.319-.11-.579-.258-.764-.444a.5.5 0 00-.708 0z" />
              </g>
            </svg>
            Chat ngay
          </span>
        </p>
        <div className="grid grid-cols-12 p-2 py-8 lg:p-8 lg:py-10">
          <div className="flex items-center col-span-4 lg:col-span-7 gap-x-3">
            <div className="flex lg:flex-row lg:gap-0 gap-2 flex-col lg:max-w-[40rem] max-w-[12rem] space-x-2 text-left">
              <img
                alt={item.product.name}
                src={item.product.image}
                className="object-cover w-24 h-24 sm:h-36 sm:w-36"
              />
              <div>
                <p className="mb-5 lg:text-[15px] lg:p-2 text-[14px] lg:line-clamp-5 line-clamp-2">{item.product.name}</p>
                <span className="p-2 text-base font-thin border border-main text-main">Đổi ý miễn phí 15 ngày</span>
              </div>
            </div>
          </div>

          <span className="col-span-3 lg:ml-0 ml-6 my-auto lg:col-span-2 lg:block lg:text-[15px] text-[13px]">₫{formatCurrency(item.product.price)}</span>
          <span className="m-auto   lg:text-[15px] text-[13px]">{item.buy_count}</span>
          <span className="col-span-4  lg:col-span-2 lg:pr-10 pr-4 pr my-auto text-right lg:text-[15px] text-[13px]">
            ₫{formatCurrency(item.buy_count * item.product.price)}
          </span>
        </div>
        <div className="grid px-4 py-2 border-dotted lg:px-8 lg:py-4 lg:grid-cols-2 border-y">
          <span></span>
          <div className="flex justify-between">
            <div className="flex items-center text-[16px]">
              <img
                src={Voucher}
                alt=""
              />
              <span>Shopee Voucher</span>
            </div>
            <button className="mr-7 cursor-pointer whitespace-nowrap border-0 bg-none p-0 text-[14px]  text-blue-600">
              Chọn Voucher
            </button>
          </div>
        </div>
        <div className="grid grid-cols-12 border-dotted border-y">
          <div className="flex items-start col-span-12 p-1 py-4 lg:p-3 lg:py-10 lg:col-span-5">
            <label
              htmlFor="note"
              className="ml-8 mt-4 w-[100px]"
            >
              Lời nhắn
            </label>
            <input
              id="note"
              className="w-full p-3 mr-10 text-xl border border-gray-300 rounded"
              type="text"
              placeholder="Lưu ý cho Người bán..."
              value=""
            />
          </div>
          <div className="col-span-12 border-l border-dotted lg:col-span-7">
            <div className="flex flex-col p-6 mr-2 border-b border-dotted lg:mr-10 lg:flex-row lg:p-10">
              <span className="w-[16rem]">Đơn vị vận chuyển:</span>
              <div>
                <p className="flex justify-between mt-4 mb-3 lg:mt-0">
                  <span>Nhanh</span>
                  <span className="text-blue-600">Thay đổi</span>
                  <span className="">₫{formatCurrency(shippingFee)}</span>
                </p>
                <p className="mb-2 mt-4 text-[13px] text-[#26aa99]">
                  <img
                    src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/checkout/41fe56ab756fc3082a08.svg"
                    alt=""
                    className="inline-block w-10"
                  />
                  Đảm bảo nhận hàng từ {CaculateDateShip()}
                </p>
                <p className="flex text-[11px] text-[#00000066]">
                  Nhận Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn sau ngày 28 Tháng 6 2024.
                  <CiCircleQuestion className="text-[14px]" />
                </p>
              </div>
            </div>
            <p className="flex items-center w-full p-4 space-x-3 lg:p-6 lg:p-10">
              Được đồng kiểm
              <CiCircleQuestion className="ml-2 text-[20px]" />
            </p>
          </div>
        </div>
        <p className="flex items-center justify-between px-6 py-6 lg:py-10 lg:px-0 lg:pr-12 lg:justify-end">
          <span className="mr-20 text-[#9e9e9e]">Tổng tiền({item.buy_count} sản phẩm):</span>
          <span className="text-[20px] text-main">
            ₫{formatCurrency(item.buy_count * item.product.price + shippingFee)}
          </span>
        </p>
      </div>
    );
  };

  if (order.length === 0) {
    return (
      <div>
        <Helmet>
          <title>Thanh toán</title>
          <meta
            name="checkout"
            content={`Trang thanh toán của Shopee At Home`}
          />
        </Helmet>
        <div className="flex items-center justify-center text-4xl text-center">Giỏ hàng trống</div>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Thanh toán</title>
        <meta
          name="checkout"
          content={`Trang thanh toán của Shopee At Home`}
        />
      </Helmet>
      <div className="mt-1 bg-white rounded">
        <p className="letter"></p>
        <div className="lg:p-10 p-5 text-[16px]">
          <p className="flex items-center space-x-1 text-3xl mb-7 text-main">
            <FaLocationDot />
            Địa Chỉ Nhận Hàng
          </p>
          <div className="flex gap-2 lg:gap-0">
            <div className="lg:w-[290px] w-[170px]  lg:font-semibold ">
              <p>
                <strong>
                  {user.name}({user.code})
                </strong>
              </p>
              <p>
                <strong>{user.phone}</strong>
              </p>
            </div>
            <p className="lg:flex-1 lg:w-full w-[170px]">{user.address}</p>
            <span className="p-1 mx-10 text-base border h-fit border-main text-main"> Mặc Định</span>
            <span className="pr-2 text-blue-500 lg:pr-10">Thay đổi</span>
          </div>
        </div>
      </div>
      <div className="lg:mt-5 lg:ml-0 ml-1   lg:mr-0 mr-2 mt-0 grid lg:grid-cols-12 grid-cols-8 bg-white lg:p-8 p-2 lg:text-[16px] text-[15px]">
        <div className="col-span-3 lg:col-span-7">Sản phẩm</div>
        <div className="col-span-1 lg:w-full w-[90px] lg:col-span-2">Đơn giá</div>
        <div className="col-span-2 ml-10 lg:col-span-1">Số lượng</div>
        <div className="col-span-2 text-right lg:w-full w-[90px] lg:pr-10 lg:col-span-2">Thành tiền</div>
      </div>
      {order.map((item: TExtendedPurchases) => (
        <Item
          key={item._id}
          item={item}
        />
      ))}

      <div className="mt-[-16px] bg-white rounded lg:mt-5">
        <div className="flex justify-between p-4 py-4 border-b lg:p-8 lg:py-10">
          <div className="flex items-center text-[16px]">
            <img
              src={Voucher}
              alt=""
            />
            <span>Shopee Voucher</span>
          </div>
          <button className="mr-7 cursor-pointer whitespace-nowrap border-0 bg-none p-0 text-[14px]  text-blue-600">
            Chọn Voucher
          </button>
        </div>
        <div className="flex items-center justify-between p-4 py-6 lg:p-8 lg:py-10">
          <div className="flex items-center text-[16px]">
            <img
              src={Coin}
              alt=""
            />
            <span>Shopee Xu</span>
            <span className="ml-10 text-gray-400">Không thể sử dụng</span>
          </div>
          <div>
            <input
              disabled={true}
              type="checkbox"
              className="w-6 h-6 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
      <div className="mt-5 rounded bg-white text-[16px]">
        <div className="flex flex-col p-8 lg:flex-row">
          <h1 className="mr-4 text-[18px]">Phương thức thanh toán</h1>
          <ul className="flex flex-col gap-4 mt-6 lg:space-x-5 lg:gap-0 lg:flex-row lg:mt-0">
            <li className="cursor-not-allowed border border-gray-400 px-5 py-2 text-[15px] text-gray-400">
              Số dư TK Shoppe
            </li>
            <li className="cursor-not-allowed border border-gray-400 px-5 py-2 text-[15px] text-gray-400">Ví Shoppe</li>
            <li className="cursor-not-allowed border border-gray-400 px-5 py-2 text-[15px] text-gray-400">
              Google Pay
            </li>
            <li className="cursor-not-allowed border border-gray-400 px-5 py-2 text-[15px] text-gray-400">
              Thẻ Tín Dụng/Ghi Nợ
            </li>
            <li className="border border-main px-5 py-2 text-[15px] text-main">Thanh toán khi nhận hàng</li>
          </ul>
        </div>
        <div className="flex justify-end p-2 pr-6 lg:p-8 lg:pr-14">
          <ul className="space-y-7">
            <li className="grid items-center grid-cols-2">
              <span className="col-span-1 mr-8 text-gray-400">Tổng tiền hàng</span>
              <span className="text-right">
                ₫{formatCurrency(order.reduce((acc, item) => acc + item.buy_count * item.product.price, 0))}
              </span>
            </li>
            <li className="grid items-center grid-cols-2">
              <span className="col-span-1 mr-8 text-gray-400">Phí vận chuyển</span>
              <span className="text-right">₫{formatCurrency(order.length * shippingFee)}</span>
            </li>
            <li className="grid items-center grid-cols-2">
              <span className="col-span-1 mr-8 text-gray-400">Tổng thanh toán</span>
              <span className="text-3xl text-right lg:text-4xl text-main">
                ₫
                {formatCurrency(
                  order.reduce((acc, item) => acc + item.buy_count * item.product.price, 0) +
                    order.length * shippingFee,
                )}
              </span>
            </li>
          </ul>
        </div>
        <p className="flex flex-col items-center gap-6 px-6 py-4 mt-4 border-t lg:py-8 lg:gap-0 lg:mx-10 lg:flex-row lg:justify-between lg:mt-0">
          <span className="px-6 lg:px-0">
            Nhấn &ldquo;Đặt hàng&ldquo; đồng nghĩa với việc bạn đồng ý tuân theo{" "}
            <span className="text-blue-600">Điều khoản Shopee</span>
          </span>
          <button className="py-4 text-white bg-main px-36">Đặt hàng</button>
        </p>
      </div>
    </div>
  );
};

export default Checkout;
