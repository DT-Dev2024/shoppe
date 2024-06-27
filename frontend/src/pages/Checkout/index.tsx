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
import { InputChange } from "src/helpers";

interface Address {
  id: string;
  name: string;
  phone: string;
  code: string;
  address: string;
  default: boolean;
}

const Checkout = () => {
  const addess: Address[] = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      phone: "0123456789",
      code: "+84",
      address: "Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
      default: true,
    },
    {
      id: "2",
      name: "Nguyễn Văn B",
      phone: "0123456789",
      code: "+84",
      address: "Số 2, Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
      default: false,
    },
    {
      id: "3",
      name: "Nguyễn Văn C",
      phone: "0123456789",
      code: "+84",
      address: "Số 3, Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
      default: false,
    },
    {
      id: "4",
      name: "Nguyễn Văn D",
      phone: "0123456789",
      code: "+84",
      address: "Số 4, Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
      default: false,
    },
  ];

  const [addresses, setAddresses] = useState<Address[]>(addess);
  const [user, setUser] = useState<Address>(addresses.find((item) => item.default) || addresses[0]);
  const { order } = useContext(OrderContext); // Assuming you're using this somewhere
  const [addressEdit, setAddressEdit] = useState<Address | undefined>(user);
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
  const handleAddressChange = (selectedId: string) => {
    const updatedAddresses = addresses.map((item) => ({
      ...item,
      default: item.id === selectedId,
    }));
    console.log(updatedAddresses);

    setAddresses(updatedAddresses);
    setUser(updatedAddresses.find((item) => item.id === selectedId) || addresses[0]);
  };

  const [note, setNote] = useState("");
  const [isShowFormAddress, setIsShowFormAddress] = useState(false);
  const [isShowEditFormAddress, setIsShowEditFormAddress] = useState(false);
  const handleChangeInput = (e: InputChange) => {
    const { value, name } = e.target;
    if (!addressEdit) return;
    setAddressEdit({ ...addressEdit, [name]: value });
  };
  const Item = ({ item }: { item: TExtendedPurchases }) => {
    return (
      <div
        key={item._id}
        className="w-ful mb-6 rounded bg-white text-[15px]"
      >
        <p className="flex space-x-4 px-3 py-2 lg:px-8 lg:py-4">
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
        <div className="grid grid-cols-12 p-2 py-8 lg:p-8 lg:py-10">
          <div className="col-span-4 flex items-center gap-x-3 lg:col-span-7">
            <div className="flex max-w-[12rem] flex-col gap-2 space-x-2 text-left lg:max-w-[40rem] lg:flex-row lg:gap-0">
              <img
                alt={item.product.name}
                src={item.product.image}
                className="h-24 w-24 object-cover sm:h-36 sm:w-36"
              />
              <div>
                <p className="mb-5 line-clamp-2 text-[14px] lg:line-clamp-5 lg:p-2 lg:text-[15px]">
                  {item.product.name}
                </p>
                <span className="border border-main p-2 text-base font-thin text-main">Đổi ý miễn phí 15 ngày</span>
              </div>
            </div>
          </div>

          <span className="col-span-3 my-auto ml-6 text-[13px] lg:col-span-2 lg:ml-0 lg:block lg:text-[15px]">
            ₫{formatCurrency(item.product.price)}
          </span>
          <span className="m-auto   text-[13px] lg:text-[15px]">{item.buy_count}</span>
          <span className="pr  col-span-4 my-auto pr-4 text-right text-[13px] lg:col-span-2 lg:pr-10 lg:text-[15px]">
            ₫{formatCurrency(item.buy_count * item.product.price)}
          </span>
        </div>
        <div className="grid border-y border-dotted px-4 py-2 lg:grid-cols-2 lg:px-8 lg:py-4">
          <span></span>
          <div className="flex justify-between">
            <div className="flex items-center text-[14px] lg:text-[16px]">
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
          <div className="col-span-12 flex items-start p-1 py-4 lg:col-span-5 lg:p-3 lg:py-10">
            <label
              htmlFor="note"
              className="ml-8 mt-4 w-[100px] text-[14px] lg:text-[16px]"
            >
              Lời nhắn
            </label>
            <input
              id="note"
              className="mr-10 w-full rounded border border-gray-300 p-3 text-[14px] text-xl lg:text-[16px]"
              type="text"
              placeholder="Lưu ý cho Người bán..."
              value=""
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <div className="col-span-12 border-l border-dotted lg:col-span-7">
            <div className="mr-2 flex flex-col border-b border-dotted p-6 lg:mr-10 lg:flex-row lg:p-10">
              <span className="w-[16rem] text-[14px] lg:text-[16px]">Đơn vị vận chuyển:</span>
              <div>
                <p className="mb-3 mt-4 flex justify-between text-[14px] lg:mt-0 lg:text-[16px]">
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
            <p className="flex w-full items-center space-x-3 p-4 text-[14px] lg:p-10 lg:p-6 lg:text-[16px]">
              Được đồng kiểm
              <CiCircleQuestion className="ml-2 text-[20px]" />
            </p>
          </div>
        </div>
        <p className="flex items-center justify-between px-4 py-6 text-[14px] lg:justify-end lg:px-0 lg:py-10 lg:pr-12 lg:text-[16px]">
          <span className="mr-20 text-[#9e9e9e]">Tổng tiền({item.buy_count} sản phẩm):</span>
          <span className="text-[17px] text-main lg:text-[20px]">
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

  const FormAddress = () => {
    return (
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40">
        <div className="max-h-[600px] w-[500px] rounded-lg bg-white shadow-lg">
          <h1 className="h-24 border-b py-9 pl-8 text-[16px]">Địa Chỉ Của Tôi</h1>
          <div
            className="
                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-4
                grid
                max-h-[512px]
                grid-cols-1 gap-4 overflow-y-auto
              "
          >
            {addresses.map((item) => (
              <div
                key={item.id}
                className="mx-8 mt-3 flex cursor-pointer items-start space-x-2 border-b border-gray-400 py-5"
              >
                <input
                  id={`default-radio-${item.id}`}
                  type="radio"
                  value={item.id}
                  checked={item.default}
                  onChange={() => handleAddressChange(item.id)}
                  name="default-radio-group"
                  className="h-5 w-5 bg-gray-100 text-main focus:ring-transparent "
                />
                <div className="flex-1">
                  <p className="mb-2 flex items-center">
                    <span className="border-r text-[16px]">{item.name.toUpperCase()}</span>
                    <span className="mx-4 inline-block h-9 w-[1px] bg-[#0000008a] leading-9"></span>

                    <span className="text-[15px] text-[#0000008a]">
                      ({item.code}) {item.phone}
                    </span>
                  </p>
                  <p className="mb-2 text-[15px] text-[#0000008a]">{item.address}</p>
                  {item.default && <span className=" h-fit border border-main p-1 text-base text-main">Mặc định</span>}
                </div>
                <button
                  onClick={() => {
                    setIsShowEditFormAddress(true);
                    setIsShowFormAddress(false);
                    setAddressEdit(item);
                  }}
                  className="px-6 py-4 text-[15px] text-blue-500"
                >
                  Cập nhật
                </button>
              </div>
            ))}
          </div>

          <div className="flex h-[64px] items-center justify-end border-t">
            <button
              className="mr-2 rounded  border border-main px-12 py-3 text-xl text-main "
              onClick={() => {
                setIsShowFormAddress(false);
              }}
            >
              Hủy
            </button>
            <button
              onClick={() => {
                // delete to server
                setIsShowFormAddress(false);
                console.log("Xác nhận", user);
              }}
              className="mx-7 rounded border bg-main px-20 py-3 text-xl text-white"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EditFormAddress = () => {
    return (
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40">
        <div className="max-h-[600px] w-[500px] rounded-lg bg-white p-8 shadow-lg">
          <h1 className="h-20 text-[18px]">Cập nhật địa chỉ</h1>
          <form className="">
            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="group relative z-0 mb-8 w-full">
                <input
                  type="text"
                  id="name"
                  className="peer block w-full border bg-transparent px-0 py-2.5 pl-4 text-[18px] text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                  placeholder=" "
                  required
                  value={addressEdit?.name}
                  name="name"
                  onChange={handleChangeInput}
                />
                <label
                  htmlFor="name"
                  className="absolute top-3 ml-4 origin-[0] -translate-y-6 scale-75 transform text-[14px] text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-12 peer-focus:scale-75 peer-focus:rounded-lg peer-focus:bg-white peer-focus:p-3 peer-focus:text-[16px] "
                >
                  Họ và tên
                </label>
              </div>

              <div className="group relative z-0 mb-8 w-full">
                <input
                  type="text"
                  id="phone"
                  className="peer block w-full border bg-transparent px-0 py-2.5 pl-4 text-[18px] text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                  placeholder=" "
                  required
                  value={addressEdit?.phone}
                  name="phone"
                  onChange={handleChangeInput}
                />
                <label
                  htmlFor="phone"
                  className="absolute top-3 ml-4 origin-[0] -translate-y-6 scale-75 transform text-[14px] text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-12 peer-focus:scale-75 peer-focus:rounded-lg peer-focus:bg-white peer-focus:p-3 peer-focus:text-[16px] "
                >
                  Số điện thoại
                </label>
              </div>
            </div>
            <div className="group relative z-0 mb-6 w-full">
              <input
                type="text"
                id="address"
                className="peer block w-full border bg-transparent px-0 py-2.5 pl-4 text-[18px] text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 "
                placeholder=" "
                required
                value={addressEdit?.address}
                name="address"
                onChange={handleChangeInput}
              />
              <label
                htmlFor="address"
                className="absolute top-3 ml-4 origin-[0] -translate-y-6 scale-75 transform text-[14px] text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-12 peer-focus:scale-75 peer-focus:rounded-lg peer-focus:bg-white peer-focus:p-3 peer-focus:text-[16px] "
              >
                Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã
              </label>
            </div>
          </form>

          <div className="flex h-[64px] items-center justify-end border-t">
            <button
              className="mr-2 rounded  border border-main px-12 py-3 text-xl text-main "
              onClick={() => {
                setIsShowFormAddress(true);
                setIsShowEditFormAddress(false);
                setAddressEdit(undefined);
              }}
            >
              Trở lại
            </button>
            <button
              onClick={() => {
                // delete to server
                setIsShowEditFormAddress(false);
                setIsShowFormAddress(true);
                setAddresses(addresses.map((item) => (item.id === addressEdit?.id ? addressEdit : item)));
              }}
              className="mx-7 rounded border bg-main px-20 py-3 text-xl text-white"
            >
              Hoàn thành
            </button>
          </div>
        </div>
      </div>
    );
  };

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
        {isShowFormAddress && <FormAddress />}
        {addressEdit && isShowEditFormAddress && !isShowFormAddress && <EditFormAddress />}
        <p className="letter"></p>
        <div className="p-5 text-[16px] lg:p-10">
          <p className="mb-7 flex items-center space-x-1 text-2xl text-main lg:text-3xl">
            <FaLocationDot />
            Địa Chỉ Nhận Hàng
          </p>
          <div className="flex items-center gap-2 lg:gap-0">
            <div className="w-[170px] lg:w-[290px]  lg:font-semibold ">
              <p>
                <strong className="text-[14px] lg:text-[16px]">
                  {user.name}({user.code})
                </strong>
              </p>
              <p>
                <strong className="text-[14px] lg:text-[16px]">{user.phone}</strong>
              </p>
            </div>
            <p className="w-[170px] text-[14px] lg:w-full lg:flex-1 lg:text-[16px] ">{user.address}</p>
            <span className="mx-10 h-fit border border-main p-1 text-base text-main "> Mặc Định</span>
            <span className="pr-2 text-[14px] text-blue-500 lg:pr-10 lg:text-[16px]">Thay đổi</span>
          </div>
        </div>
      </div>
      <div className="ml-1 mr-2 mt-0   grid grid-cols-8 bg-white p-2 text-[15px] lg:ml-0 lg:mr-0 lg:mt-5 lg:grid-cols-12 lg:p-8 lg:text-[16px]">
        <div className="col-span-3 lg:col-span-7">Sản phẩm</div>
        <div className="col-span-1 w-[90px] lg:col-span-2 lg:w-full">Đơn giá</div>
        <div className="col-span-2 ml-10 lg:col-span-1">Số lượng</div>
        <div className="col-span-2 w-[90px] text-right lg:col-span-2 lg:w-full lg:pr-10">Thành tiền</div>
      </div>
      {order.map((item: TExtendedPurchases) => (
        <Item
          key={item._id}
          item={item}
        />
      ))}

      <div className="mt-[-16px] rounded bg-white lg:mt-5">
        <div className="flex justify-between border-b p-4 py-4 lg:p-8 lg:py-10">
          <div className="flex items-center text-[14px] lg:text-[16px]   ">
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
          <div className="flex items-center text-[14px] lg:text-[16px]">
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
        <div className="flex flex-col p-8 lg:flex-row">
          <h1 className="mr-4 text-[15px] lg:text-[18px]">Phương thức thanh toán</h1>
          <ul className="mt-6 flex flex-col gap-4 lg:mt-0 lg:flex-row lg:gap-0 lg:space-x-5 ">
            <li className="cursor-not-allowed border border-gray-400 px-5 py-2 text-[14px] text-gray-400 lg:text-[15px]">
              Số dư TK Shoppe
            </li>
            <li className="cursor-not-allowed border border-gray-400 px-5 py-2 text-[14px] text-gray-400 lg:text-[15px]">
              Ví Shoppe
            </li>
            <li className="cursor-not-allowed border border-gray-400 px-5 py-2 text-[14px] text-gray-400 lg:text-[15px]">
              Google Pay
            </li>
            <li className="cursor-not-allowed border border-gray-400 px-5 py-2 text-[14px] text-gray-400 lg:text-[15px]">
              Thẻ Tín Dụng/Ghi Nợ
            </li>
            <li className="border border-main px-5 py-2 text-[14px] text-main lg:text-[15px]">
              Thanh toán khi nhận hàng
            </li>
          </ul>
        </div>
        <div className="flex justify-end p-2 pr-6 lg:p-8 lg:pr-14">
          <ul className="space-y-7">
            <li className="grid grid-cols-2 items-center text-[15px]">
              <span className="col-span-1 mr-8 text-gray-400">Tổng tiền hàng</span>
              <span className="text-right">
                ₫{formatCurrency(order.reduce((acc, item) => acc + item.buy_count * item.product.price, 0))}
              </span>
            </li>
            <li className="grid grid-cols-2 items-center text-[15px]">
              <span className="col-span-1 mr-8 text-gray-400">Phí vận chuyển</span>
              <span className="text-right">₫{formatCurrency(order.length * shippingFee)}</span>
            </li>
            <li className="grid grid-cols-2 items-center text-[15px]">
              <span className="col-span-1 mr-8 text-gray-400">Tổng thanh toán</span>
              <span className="text-right text-3xl text-main lg:text-4xl">
                ₫
                {formatCurrency(
                  order.reduce((acc, item) => acc + item.buy_count * item.product.price, 0) +
                    order.length * shippingFee,
                )}
              </span>
            </li>
          </ul>
        </div>
        <p className="mt-4 flex flex-col items-center gap-6 border-t px-6 py-4 lg:mx-10 lg:mt-0 lg:flex-row lg:justify-between lg:gap-0 lg:py-8">
          <span className="px-6 text-[14px] lg:px-0 lg:text-[16px]">
            Nhấn &ldquo;Đặt hàng&ldquo; đồng nghĩa với việc bạn đồng ý tuân theo{" "}
            <span className="text-blue-600">Điều khoản Shopee</span>
          </span>
          <button className="bg-main px-36 py-4 text-[14px] text-white lg:text-[16px]">Đặt hàng</button>
        </p>
      </div>
    </div>
  );
};

export default Checkout;
