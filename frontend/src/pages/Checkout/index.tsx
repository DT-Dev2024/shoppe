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
        <p className="flex space-x-4 px-8 py-10">
          <span className="mr-3 uppercase">{item.product.category.name}</span>
          <span className="cursor-pointer text-[#26aa99]">
            <svg
              viewBox="0 0 16 16"
              className="shopee-svg-icon FpgzUK mr-1 inline-block"
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
        <div className="grid grid-cols-12 p-8 py-10 ">
          <div className="col-span-7 flex items-center  gap-x-3">
            <div className="flex max-w-[40rem] space-x-2 text-left">
              <img
                alt={item.product.name}
                src={item.product.image}
                className="h-14 w-14 object-cover sm:h-20 sm:w-20"
              />
              <div>
                <p>{item.product.name}</p>
                <span className="border border-main p-2 text-base font-thin text-main">Đổi ý miễn phí 15 ngày</span>
              </div>
            </div>
          </div>

          <span className="col-span-2 my-auto hidden lg:block">₫{formatCurrency(item.product.price)}</span>
          <span className="m-auto">{item.buy_count}</span>
          <span className="col-span-2 my-auto pr-10 text-right">
            ₫{formatCurrency(item.buy_count * item.product.price)}
          </span>
        </div>
        <div className="grid grid-cols-2  border-y border-dotted px-8 py-4">
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
        <div className="grid grid-cols-12 border-y border-dotted">
          <div className="col-span-5 flex items-start p-3 py-10">
            <label
              htmlFor="note"
              className="ml-8 mt-4 w-[100px]"
            >
              Lời nhắn
            </label>
            <input
              id="note"
              className="mr-10 w-full rounded border border-gray-300 p-3 text-xl"
              type="text"
              placeholder="Lưu ý cho Người bán..."
              value=""
            />
          </div>
          <div className="col-span-7 border-l border-dotted">
            <div className="mr-10 flex border-b border-dotted p-10">
              <span className="w-[16rem]">Đơn vị vận chuyển:</span>
              <div>
                <p className="mb-3 flex justify-between">
                  <span>Nhanh</span>
                  <span className="text-blue-600">Thay đổi</span>
                  <span className="">₫{formatCurrency(shippingFee)}</span>
                </p>
                <p className="mb-2 text-[13px] text-[#26aa99]">
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
            <p className="flex w-full items-center space-x-3 p-10">
              Được đồng kiểm
              <CiCircleQuestion className="ml-2 text-[20px]" />
            </p>
          </div>
        </div>
        <p className="flex items-center justify-end py-8 pr-12">
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
        <div className="flex items-center justify-center text-center text-4xl">Giỏ hàng trống</div>
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
      <div className="rounded bg-white">
        <p className="letter"></p>
        <div className="p-10 text-[16px]">
          <p className="mb-7 flex items-center space-x-1 text-3xl text-main">
            <FaLocationDot />
            Địa Chỉ Nhận Hàng
          </p>
          <div className="flex">
            <div className="w-[290px] font-semibold">
              <p>
                <strong>
                  {user.name}({user.code})
                </strong>
              </p>
              <p>
                <strong>{user.phone}</strong>
              </p>
            </div>
            <p className="flex-1">{user.address}</p>
            <span className="mx-10 h-fit border border-main p-1 text-base text-main"> Mặc Định</span>
            <span className="pr-10 text-blue-500">Thay đổi</span>
          </div>
        </div>
      </div>
      <div className="mt-5  grid grid-cols-12 bg-white p-8 text-[16px]">
        <div className="col-span-7">Sản phẩm</div>
        <div className="col-span-2">Đơn giá</div>
        <div className="col-span-1">Số lượng</div>
        <div className="col-span-2 pr-10 text-right">Thành tiền</div>
      </div>
      {order.map((item: TExtendedPurchases) => (
        <Item
          key={item._id}
          item={item}
        />
      ))}
      <div className="mt-5 rounded bg-white">
        <div className="flex justify-between border-b p-8 py-10">
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
        <div className="flex justify-between p-8 py-10">
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
              className="h-6 w-6 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
      <div className="mt-5 rounded bg-white text-[16px]">
        <div className="flex p-8">
          <h1 className="mr-4 text-[18px]">Phương thức thanh toán</h1>
          <ul className="flex space-x-5">
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
        <div className="flex justify-end p-8 pr-14">
          <ul className="space-y-7">
            <li className="grid grid-cols-2 items-center">
              <span className="col-span-1 mr-8 text-gray-400">Tổng tiền hàng</span>
              <span className="text-right">
                ₫{formatCurrency(order.reduce((acc, item) => acc + item.buy_count * item.product.price, 0))}
              </span>
            </li>
            <li className="grid grid-cols-2 items-center">
              <span className="col-span-1 mr-8 text-gray-400">Phí vận chuyển</span>
              <span className="text-right">₫{formatCurrency(order.length * shippingFee)}</span>
            </li>
            <li className="grid grid-cols-2 items-center">
              <span className="col-span-1 mr-8 text-gray-400">Tổng thanh toán</span>
              <span className="text-right text-5xl text-main">
                ₫
                {formatCurrency(
                  order.reduce((acc, item) => acc + item.buy_count * item.product.price, 0) +
                    order.length * shippingFee,
                )}
              </span>
            </li>
          </ul>
        </div>
        <p className="mx-10 flex items-center justify-between border-t py-8">
          <span>
            Nhấn &ldquo;Đặt hàng&ldquo; đồng nghĩa với việc bạn đồng ý tuân theo{" "}
            <span className="text-blue-600">Điều khoản Shopee</span>
          </span>
          <button className="bg-main px-36 py-4 text-white">Đặt hàng</button>
        </p>
      </div>
    </div>
  );
};

export default Checkout;
