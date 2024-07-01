import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { CiCircleQuestion } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import purchaseAPI from "src/apis/purchase.api";
import Coin from "src/assets/img/coin.png";
import Voucher from "src/assets/img/voucher.png";
import { OrderContext } from "src/contexts/order.context";
import { InputChange } from "src/helpers";
import { TCheckout, TExtendedPurchases, TVoucher } from "src/types/purchase.type";
import { TAddress, TUser, ValidationResult } from "src/types/user.types";
import { formatCurrency } from "src/utils/formatNumber";
import "./checkout.css";
import userApi from "src/apis/user.api";
import { FaPlus } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { getAllVouchers } from "src/apis/voucher";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import LoadingSmall from "src/components/Loading/LoadingSmall";
import { validateAddressFields } from "src/utils/validate";

let payments = {
  MOMO: "",
  BANK: "",
  PAY_OFFLINE: "Thanh toán tiền mặt khi nhận hàng",
};

enum PaymentMethod {
  MOMO = "Momo",
  BANK = "Chuyển khoản ngân hàng",
  PAY_OFFLINE = "Thanh toán tiền mặt khi nhận hàng",
}

const Checkout = () => {
  const [addresses, setAddresses] = useState<TAddress[]>();
  const [address, setAddress] = useState<TAddress>();
  const [user, setUser] = useState<TUser>();
  const initialAddress: TAddress = {
    id: "",
    name: "",
    phone: "",
    address: "",
    default: false,
  };

  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const [checkoutOrder, setCheckoutOrder] = useState<TExtendedPurchases[]>([]);

  useEffect(() => {
    // Fetch addresses from the server
    // setAddresses(response.data);

    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser: TUser = JSON.parse(user);
      setUser(parsedUser);
      setAddresses(parsedUser.address);
      setAddress(parsedUser.address.find((item) => item.default));
    }
    if (location.state) {
      setCheckoutOrder(location.state);
    }

    const getPayment = async () => {
      const response = await purchaseAPI.getPayment();
      const payment = response.data[0];
      payments = {
        MOMO: payment.MOMO,
        BANK: payment.BANK,
        PAY_OFFLINE: "Thanh toán tiền mặt khi nhận hàng",
      };
    };
    getPayment();
  }, []);
  const [addressEdit, setAddressEdit] = useState<TAddress>(initialAddress);
  const CaculateDateShip = () => {
    const date = new Date();
    const day = date.getDate();
    const dayReceive = day + 3;
    const dayReceive2 = day + 5;
    return ` ${dayReceive} Tháng ${date.getMonth() + 1} - ${dayReceive2} Tháng ${date.getMonth() + 1}`;
  };
  const CaculateDateShipTK = () => {
    const date = new Date();
    const day = date.getDate();
    const dayReceive = day + 4;
    const dayReceive2 = day + 6;
    return ` ${dayReceive} Tháng ${date.getMonth() + 1} - ${dayReceive2} Tháng ${date.getMonth() + 1}`;
  };
  const CaculateDateShipHT = () => {
    const date = new Date();
    const day = date.getDate();
    const dayReceive = day + 1;
    const dayReceive2 = day + 3;
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
    const updatedAddresses = addresses?.map((item) => ({
      ...item,
      default: item.id === selectedId ? true : false,
    }));

    setAddresses(updatedAddresses);
    setAddress(updatedAddresses?.find((item) => item.default));
  };

  const [note, setNote] = useState("");
  const [isShowFormAddress, setIsShowFormAddress] = useState(false);
  const [isShowEditFormAddress, setIsShowEditFormAddress] = useState(false);
  const [modalAddAddress, setModalAddAddress] = useState(false);
  const [isShowFormShipping, setIsShowFormShipping] = useState(false);
  const [modalChangeShipping, setModalChangeShipping] = useState(false);

  const handleChangeInput = (e: InputChange) => {
    const { value, name } = e.target;
    if (!addressEdit) return;
    setAddressEdit({ ...addressEdit, [name]: value });
  };

  const listRef = useRef(null);
  const transformAndCheckExpiry = (utcDateString: string) => {
    const expiryDate = new Date(utcDateString);
    const currentDate = new Date();

    const formattedDate = `${expiryDate.getDate().toString().padStart(2, "0")}.${(expiryDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${expiryDate.getFullYear()}`;

    const isToday = expiryDate.toDateString() === currentDate.toDateString();
    const isPast = expiryDate < currentDate;

    if (isToday) {
      const hoursUntilExpiry = Math.round((expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60));
      if (hoursUntilExpiry > 0) {
        return `Sắp hết hạn. Còn ${hoursUntilExpiry} giờ.`;
      } else {
        return `Đã hết hạn. Hãy chọn mã khác.`;
      }
    } else if (isPast) {
      return `HSD: ${formattedDate}`;
    }
  };
  const [vouchers, setVouchers] = useState<TVoucher[]>([]);
  useEffect(() => {
    // setVouchers(voucherMock);
    const vouchers = async () => {
      try {
        const response = await getAllVouchers();
        setVouchers(response.data);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };
    vouchers();
  }, []);
  const [selectedVoucher, setSelectedVoucher] = useState<TVoucher | null>(null);
  const { priceDiscount, totalPrice } = useMemo(() => {
    const checkoutPrice = checkoutOrder.reduce(
      (acc: any, item: TExtendedPurchases) => acc + item.buy_count * item.product.price,

      0,
    );
    if (selectedVoucher) {
      if (selectedVoucher.discount_type === "FIXED") {
        // checkoutPrice - selectedVoucher.discount
        return {
          priceDiscount: selectedVoucher.discount,
          totalPrice: checkoutPrice - selectedVoucher.discount,
        };
      } else {
        if (!selectedVoucher) return checkoutPrice;
        // return checkoutPrice - (checkoutPrice * selectedVoucher.discount) / 100;
        return {
          priceDiscount: (checkoutPrice * selectedVoucher.discount) / 100,
          totalPrice: checkoutPrice - (checkoutPrice * selectedVoucher.discount) / 100,
        };
      }
    } else {
      return {
        priceDiscount: 0,
        totalPrice: checkoutPrice,
      };
    }
  }, [selectedVoucher, checkoutOrder]);

  const [isModalVoucherVisible, setIsModalVoucherVisible] = useState(false);

  const ModalVoucher = () => {
    const fixedVouchers = [
      {
        id: 1,
        discount: 50000,
        minium_price: 200000,
        expire: "2024-07-31",
        discount_type: "FIXED",
      },
      {
        id: 2,
        discount: 100000,
        minium_price: 300000,
        expire: "2024-08-15",
        discount_type: "FIXED",
      },
      {
        id: 3,
        discount: 150000,
        minium_price: 500000,
        discount_type: "FIXED",

        expire: "2024-09-01",
      },
    ];

    return (
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40">
        <div className="w-[316px] rounded-lg  bg-white text-black lg:max-h-[640px]  lg:w-[616px]">
          <div className="p-3 lg:p-10 lg:pb-4">
            <div className="flex justify-between">
              <h1 className="text-2xl">Chọn Shopee Voucher</h1>
              <p className="flex items-center text-xl text-gray-500">
                Hỗ trợ
                <CiCircleQuestion />
              </p>
            </div>
            <form
              action=""
              className="mb-6 mt-5  flex items-center gap-3 bg-[#f8f8f8] p-4 text-xl"
            >
              <label
                htmlFor="voucher"
                className="w-60 text-2xl"
              >
                Mã Voucher
              </label>
              <input
                id="voucher"
                type="text"
                placeholder="Mã Shoppe Voucher"
                className="w-full border border-gray-300 p-4"
              />
              <button className="w-60 border p-4 text-xl text-[#ccc] ">Áp dụng</button>
            </form>
            <p className="mb-2 text-[13px] text-[#bbb]">Mã Miễn Phí Vận Chuyển</p>
            <p className="text-[13px] text-[#bbb]">Có thể chọn 1 Voucher</p>

            <ul
              ref={listRef}
              className="
                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-4
                grid
                max-h-[330px]
                grid-cols-1 gap-4 overflow-y-auto
              "
            >
              {fixedVouchers.map((voucher) => (
                <li
                  key={voucher.id}
                  className={`border-b  border-gray-300 p-4 shadow-md`}
                >
                  <div className="relative flex items-center">
                    <div className="h-40 w-40 bg-green-600">
                      <img
                        src="https://down-vn.img.susercontent.com/file/sg-11134004-22120-4cskiffs0olvc3"
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 pl-3">
                      <p className="text-xl">
                        Giảm giá tối đa{" "}
                        {voucher.discount_type === "FIXED"
                          ? `₫${formatCurrency(voucher.discount)}`
                          : `${voucher.discount}%`}
                      </p>
                      <p className="mb-1 text-xl">Đơn tối thiểu ₫{formatCurrency(voucher.minium_price)}</p>
                      <p className="text-xl">{transformAndCheckExpiry(voucher.expire)}</p>
                    </div>
                    <input
                      type="radio"
                      name="selectedVoucher"
                      // checked={selectedVoucher?.id === voucher.id}
                      // onChange={(e) => {
                      //   e.preventDefault();
                      //   setSelectedVoucher(voucher);
                      // }}
                      className="ml-4"
                    />
                  </div>
                  <p className="mt-4 flex items-center text-[13px] text-main">
                    <AiOutlineExclamationCircle className="mr-1 " />
                    Vui lòng mua hàng trên ứng dụng Shopee để sử dụng ưu đãi.
                  </p>
                </li>
              ))}
              {vouchers.map((voucher) => (
                <li
                  key={voucher.id}
                  className={`border-b  border-gray-300 p-4 shadow-md`}
                >
                  <div className="relative flex items-center">
                    <div className="h-40 w-40 bg-green-600">
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIK3WiSbFDsXqBwIU38vgexE-GhDcXSGiVXQ&s"
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 pl-3">
                      <p className="text-xl">Giảm giá tối đa ₫{formatCurrency(voucher.discount)}</p>
                      <p className="mb-1 text-xl">Đơn tối thiểu ₫{formatCurrency(voucher.minium_price)}</p>
                      <p className="text-xl">{transformAndCheckExpiry(voucher.expire)}</p>
                    </div>
                    <input
                      type="radio"
                      name="selectedVoucher"
                      checked={selectedVoucher?.id === voucher.id}
                      onChange={(e) => {
                        e.preventDefault(); // Prevent the default action
                        setSelectedVoucher(voucher);
                      }}
                      className="ml-4"
                    />
                  </div>
                  <p className="mt-4 flex items-center text-[13px] text-main">
                    <AiOutlineExclamationCircle className="mr-1 " />
                    Vui lòng mua hàng trên ứng dụng Shopee để sử dụng ưu đãi.
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex h-[64px] items-center justify-end border-t">
            {selectedVoucher && (
              <button
                onClick={() => {
                  setSelectedVoucher(null);
                  setIsModalVoucherVisible(false);
                }}
                className="mr-2 rounded  border-2 px-8 py-3 text-xl text-[#b6b6b6] lg:px-12 "
              >
                Hủy chọn
              </button>
            )}
            <button
              onClick={() => setIsModalVoucherVisible(false)}
              className="mr-2 rounded  border-2 px-8 py-3 text-xl text-[#b6b6b6] lg:px-12 "
            >
              Trở lại
            </button>
            <button
              onClick={() => setIsModalVoucherVisible(false)}
              className="mx-7 rounded border bg-main px-10 py-3 text-xl text-white lg:px-20"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Item = ({ item }: { item: TExtendedPurchases }) => {
    return (
      <div
        key={item.id}
        className="w-ful mb-6 rounded bg-white text-[15px]"
      >
        <p className="flex space-x-4 px-3 py-2 lg:px-8 lg:py-4">
          <span className="mr-3 uppercase">name</span>
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
                  <span>{selectedShippingType}</span>
                  <button
                    onClick={() => setIsShowFormShipping(true)}
                    className="pr-2 text-[14px] text-blue-500 lg:pr-10 lg:text-[16px]"
                  >
                    Thay đổi
                  </button>
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
            <p className="flex w-full items-center space-x-3 p-4 text-[14px] lg:p-10 lg:text-[16px]">
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

  const FormAddress = () => {
    return (
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40">
        <div className="w-[350px]  rounded-lg bg-white shadow-lg lg:max-h-[600px] lg:w-[500px]">
          <h1 className="h-24 border-b py-9 pl-8 text-[16px]">`Địa Chỉ `Của Tôi</h1>
          <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-4 max-h-[470px] gap-4 overflow-y-auto">
            {addresses?.map((item) => (
              <div
                key={item.id}
                className="mx-8 mt-3 flex cursor-pointer items-start space-x-2 border-b border-gray-400 py-5"
              >
                <input
                  id={`default-radio-${item.id}`}
                  type="radio"
                  value={item.id}
                  checked={item.default}
                  onChange={() => {
                    if (item && item.id) {
                      handleAddressChange(item.id);
                    }
                  }}
                  name="default-radio-group"
                  className="my-auto mr-2 h-5 w-5 bg-gray-100 text-main focus:ring-transparent "
                />
                <div className="flex-1">
                  <p className="mb-2 flex items-center">
                    <span className="border-r  text-[14px] lg:text-[16px]">{item.name.toUpperCase()}</span>
                    <span className="mx-4 inline-block h-9 w-[1px] bg-[#0000008a] leading-9"></span>

                    <span className="text-[13px] text-[#0000008a] lg:text-[15px]">(+84) {item.phone}</span>
                  </p>
                  <p className="mb-2 text-[13px] text-[#0000008a] lg:text-[15px]">{item.address}</p>
                  {item.default && <span className="h-fit border border-main p-1 text-base text-main">Mặc định</span>}
                </div>
                <button
                  onClick={() => {
                    setIsShowEditFormAddress(true);
                    setIsShowFormAddress(false);
                    setAddressEdit(item);
                  }}
                  className="my-auto px-6 py-4 text-[13px] text-blue-500 lg:text-[15px]"
                >
                  Cập nhật
                </button>
              </div>
            ))}

            <button
              className="mx-8 my-6 flex items-center border border-main px-3 py-2 text-[16px] text-main"
              onClick={() => {
                setIsShowEditFormAddress(true);
                setIsShowFormAddress(false);
                setModalAddAddress(true);
              }}
            >
              <FaPlus className="mr-3 text-[14px] text-black" />
              Thêm Địa Chỉ Mới
            </button>
          </div>

          <div className="flex h-[64px] items-center justify-end border-t">
            <button
              className="mr-2 rounded border border-main px-12 py-3 text-xl text-main "
              onClick={() => {
                setIsShowFormAddress(false);
                setIsShowEditFormAddress(false);
              }}
            >
              Hủy
            </button>
            <button
              onClick={async () => {
                const rs = await userApi.updateAddressDefault(address?.id || "");
                if (rs) {
                  setIsShowFormAddress(false);
                  setIsShowEditFormAddress(false);
                  setAddresses(addresses?.map((item) => ({ ...item, default: item.id === address?.id })));
                  localStorage.setItem("user", JSON.stringify({ ...user, address: addresses }));
                }
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
  const [errsFormAddress, setErrsFormAddress] = useState<ValidationResult>({});
  const highlightError = (field: string) => {
    return Object.keys(errsFormAddress).some((error) => error === field) ? "border-red-500" : "";
  };
  const renderSpanError = (field: string) => {
    return Object.keys(errsFormAddress).some((error) => error === field) ? (
      <span className="text-[12px] text-red-500">{errsFormAddress[field]}</span>
    ) : null;
  };

  const [shippingFee, setShippingFee] = useState(32000);
  const [selectedShippingType, setSelectedShippingType] = useState("Nhanh");
  const FormChangeShipping = () => {
    const [selectedOption, setSelectedOption] = useState("Nhanh");
    const shippingOptions = [
      {
        type: "Nhanh",
        fee: 32000,
        deliveryDate: CaculateDateShip(),
        voucherInfo: `Nhận Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn sau  ${CaculateDateShip()}`,
      },
      {
        type: "Hỏa tốc",
        fee: 75000,
        deliveryDate: CaculateDateShipHT(),
        voucherInfo: `Nhận Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn sau  ${CaculateDateShipHT()}`,
      },
      {
        type: "Tiết kiệm",
        fee: 25000,
        deliveryDate: CaculateDateShipTK(),
        voucherInfo: `Nhận Voucher trị giá ₫15.000 nếu đơn hàng được giao đến bạn sau  ${CaculateDateShipTK()}`,
      },
    ];
    return (
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40">
        <div className="w-[350px]  rounded-lg bg-white shadow-lg lg:max-h-[600px] lg:w-[500px]">
          <h1 className="h-24 border-b py-9 pl-8 text-[16px]">Chọn đơn vị vận chuyển</h1>
          <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mt-4 max-h-[470px] gap-4 overflow-y-auto">
            <p className="h-20 border-b py-2 pl-8 text-[13px] text-gray-500 ">
              KÊNH VẬN CHUYỂN LIÊN KẾT VỚI SHOPEE Bạn có thể theo dõi đơn hàng trên ứng dụng Shopee khi chọn một trong
              các đơn vị vận chuyển:
            </p>
            {shippingOptions.map((option) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div
                key={option.type}
                className={`mx-6 mb-3 mt-4 border p-4 px-10 ${
                  selectedOption === option.type ? "border-orange-500" : "border-gray-300"
                } cursor-pointer rounded-lg hover:shadow-md`}
                onClick={() => setSelectedOption(option.type)}
              >
                <div className="mb-3 flex justify-between ">
                  <div className="flex gap-10">
                    <span className="text-[15px] font-medium text-gray-800">{option.type}</span>
                    <span className="text-[15px] text-orange-500">₫{option.fee.toLocaleString()}</span>
                  </div>
                  {selectedOption === option.type && (
                    <div className="mt-2 text-right text-[20px]">
                      <span className="text-orange-500">&#10003;</span>
                    </div>
                  )}
                </div>
                <p className="mt-3 text-[12px] text-green-600">{option.deliveryDate}</p>
                <p className="mt-3 text-[10px] text-gray-500">{option.voucherInfo}</p>
              </div>
            ))}
          </div>

          <div className="flex h-[64px] items-center justify-end border-t">
            <button
              className="mr-2 rounded border border-main px-12 py-3 text-xl text-main "
              onClick={() => {
                setIsShowFormShipping(false);
              }}
            >
              Hủy
            </button>
            <button
              onClick={async () => {
                const selectedShipping = shippingOptions.find((option) => option.type === selectedOption);
                if (!selectedShipping) return;
                setShippingFee(selectedShipping.fee);
                setSelectedShippingType(selectedShipping.type);
                setIsShowFormShipping(false);
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
  const [tabActive, setTabActive] = useState<keyof typeof PaymentMethod | null>("PAY_OFFLINE");
  const [selectedPayment, setSelectedPayment] = useState<{ key: keyof typeof PaymentMethod; value: string } | null>({
    key: "PAY_OFFLINE",
    value: payments.PAY_OFFLINE,
  });
  const handlePaymentSelection = (method: keyof typeof PaymentMethod) => {
    setTabActive(method); // Assuming setTabActive updates the UI to show the active tab
    setSelectedPayment({ key: method, value: payments[method] });
  };

  const handleOrder = async () => {
    setLoading(true);
    if (!address) {
      setLoading(false);
      return;
    }

    if (checkoutOrder) {
      const total =
        checkoutOrder.reduce((acc: any, item: TExtendedPurchases) => acc + item.buy_count * item.product.price, 0) +
        checkoutOrder.length * shippingFee +
        (selectedVoucher?.discount || 0);

      const data: TCheckout = {
        totalPrice: total,
        userId: user?.id || "",
        orderDetails: checkoutOrder.map((item) => ({
          productId: item.product.id,
          buy_count: item.buy_count,
          status: "WAITING",
          price:
            item.product.sale_price > 0
              ? item.product.price * ((100 - item.product.sale_price) / 100)
              : item.product.price,
          price_before_discount: item.product.sale_price > 0 ? item.product.price : 0,
        })),
        voucherId: selectedVoucher?.id || "",
        addressId: address?.id || "",
        paymentMethod: selectedPayment?.key || "PAY_OFFLINE",
      };
      const rs = await purchaseAPI.checkout(data);
      if (rs) {
        setLoading(false);
        window.history.replaceState(null, "");
        window.location.href = "/";
      }
    }
  };

  if (checkoutOrder && checkoutOrder.length === 0) {
    // window.history.replaceState(null, "");
    // window.location.href = "/";
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
          <div className="p-10 text-center">
            <h1 className="text-2xl">Giỏ hàng trống</h1>
            <p className="text-[14px]">Quay lại trang chủ để mua hàng</p>
            <button
              onClick={() => {
                window.history.replaceState(null, "");
                window.location.href = "/";
              }}
              className="mt-5 border border-main px-10 py-3 text-main"
            >
              Trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  } else
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
          {isModalVoucherVisible && <ModalVoucher />}
          {loading && <LoadingSmall />}
          {isShowFormAddress && <FormAddress />}
          {isShowFormShipping && <FormChangeShipping />}
          {(addressEdit || modalAddAddress) && isShowEditFormAddress && !isShowFormAddress && (
            <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40">
              <div className="max-h-[600px] w-[350px]  rounded-lg bg-white p-8 shadow-lg lg:w-[500px]">
                {/* <h1 className="h-20 text-[18px]">Cập nhật địa chỉ</h1> */}
                <h1 className="h-20 text-[18px]">{modalAddAddress ? "Thêm Địa Chỉ Mới" : "Cập Nhật Địa Chỉ"}</h1>
                <form className="">
                  <div className="grid md:grid-cols-2 md:gap-6">
                    <div className="group relative z-0 mb-10 w-full">
                      <input
                        type="text"
                        id="name"
                        className={`peer block w-full border bg-transparent px-0 py-4 pl-4 text-[14px] text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 lg:text-[15px] ${highlightError(
                          "name",
                        )}`}
                        placeholder=" "
                        required
                        value={addressEdit?.name}
                        name="name"
                        onChange={handleChangeInput}
                      />
                      <label
                        htmlFor="name"
                        className="absolute top-3 ml-4 origin-[0] -translate-y-6 scale-75 transform bg-white text-[14px] text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-12 peer-focus:scale-75 peer-focus:rounded-lg peer-focus:bg-white peer-focus:p-3  peer-focus:text-[15px] lg:peer-focus:text-[16px]"
                      >
                        Họ và tên
                      </label>
                      {renderSpanError("name")}
                    </div>

                    <div className="group relative z-0 mb-8 w-full">
                      <input
                        type="text"
                        id="phone"
                        className={`peer block w-full border bg-transparent px-0 py-4 pl-4 text-[14px] text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 lg:text-[15px] ${highlightError(
                          "phone",
                        )}`}
                        placeholder=" "
                        required
                        value={addressEdit?.phone}
                        name="phone"
                        onChange={handleChangeInput}
                      />
                      <label
                        htmlFor="phone"
                        className="absolute top-3 ml-4 origin-[0] -translate-y-6 scale-75 transform bg-white text-[14px] text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-12 peer-focus:scale-75 peer-focus:rounded-lg peer-focus:bg-white peer-focus:p-3  peer-focus:text-[15px] lg:peer-focus:text-[16px] "
                      >
                        Số điện thoại
                      </label>
                      {renderSpanError("phone")}
                    </div>
                  </div>
                  <div className="group relative z-0 mb-6 w-full">
                    <input
                      type="text"
                      id="address"
                      className={`peer block w-full border bg-transparent px-0 py-4 pl-4 text-[14px] text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 lg:text-[15px] ${highlightError(
                        "address",
                      )}`}
                      placeholder=" "
                      required
                      value={addressEdit?.address}
                      name="address"
                      onChange={handleChangeInput}
                    />
                    <label
                      htmlFor="address"
                      className="absolute top-3 ml-4 origin-[0] -translate-y-6 scale-75 transform bg-white text-[14px] text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-12 peer-focus:scale-75 peer-focus:rounded-lg peer-focus:bg-white peer-focus:p-2 peer-focus:text-[15px] lg:peer-focus:p-3 lg:peer-focus:text-[16px]    "
                    >
                      Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã
                    </label>
                    {renderSpanError("address")}
                  </div>
                </form>

                <div className="flex h-[64px] items-center justify-end border-t">
                  <button
                    className="mr-2 rounded border border-main px-10 py-2 text-xl text-main "
                    onClick={() => {
                      setIsShowFormAddress(true);
                      setIsShowEditFormAddress(false);
                      setModalAddAddress(false);
                      setAddressEdit(initialAddress);
                    }}
                  >
                    Trở lại
                  </button>
                  <button
                    onClick={async () => {
                      const validate = validateAddressFields(addressEdit);
                      if (Object.keys(validate).length > 0) {
                        setErrsFormAddress(validate);
                        return;
                      }
                      setErrsFormAddress({});

                      if (modalAddAddress) {
                        const rs = await userApi.updateAddress({
                          ...addressEdit,
                          userId: user?.id,
                        });
                        if (rs) {
                          if (addresses) {
                            setAddresses(rs.data.address);
                          }
                          setModalAddAddress(false);
                          setAddressEdit(initialAddress);
                          localStorage.setItem("user", JSON.stringify(rs.data));
                        }
                      } else {
                        setIsShowEditFormAddress(false);

                        const rs = await userApi.updateAddress({
                          ...addressEdit,
                          userId: user?.id,
                        });
                        if (rs) {
                          setAddresses(addresses?.map((item) => (item.id === addressEdit?.id ? addressEdit : item)));
                          setAddressEdit(initialAddress);
                          localStorage.setItem("user", JSON.stringify(rs.data));
                        }
                      }
                      setIsShowFormAddress(true);
                    }}
                    className="mx-7 rounded border bg-main px-12 py-3 text-xl text-white"
                  >
                    Hoàn thành
                  </button>
                </div>
              </div>
            </div>
          )}
          <p className="letter"></p>
          <div className="p-5 text-[16px] lg:p-10">
            <p className="mb-7 flex items-center space-x-1 text-2xl text-main lg:text-3xl">
              <FaLocationDot />
              Địa Chỉ Nhận Hàng
            </p>
            <div className="flex items-center gap-2 lg:gap-0">
              <div className="w-[170px] lg:w-[290px]  lg:font-semibold ">
                <p>
                  <strong className="text-[14px] lg:text-[16px]">{address?.name}(+84)</strong>
                </p>
                <p>
                  <strong className="text-[14px] lg:text-[16px]">{address?.phone}</strong>
                </p>
              </div>
              <p className="w-[170px] text-[14px] lg:w-full lg:flex-1 lg:text-[16px] ">{address?.address}</p>
              <span className="mx-10 h-fit border border-main p-1 text-base text-main "> Mặc Định</span>
              <button
                onClick={() => setIsShowFormAddress(true)}
                className="pr-2 text-[14px] text-blue-500 lg:pr-10 lg:text-[16px]"
              >
                Thay đổi
              </button>
            </div>
          </div>
        </div>
        <div className="ml-1 mr-2 mt-0   grid grid-cols-8 bg-white p-2 text-[15px] lg:ml-0 lg:mr-0 lg:mt-5 lg:grid-cols-12 lg:p-8 lg:text-[16px]">
          <div className="col-span-3 lg:col-span-7">Sản phẩm</div>
          <div className="col-span-1 w-[90px] lg:col-span-2 lg:w-full">Đơn giá</div>
          <div className="col-span-2 ml-10 lg:col-span-1">Số lượng</div>
          <div className="col-span-2 w-[90px] text-right lg:col-span-2 lg:w-full lg:pr-10">Thành tiền</div>
        </div>
        {checkoutOrder &&
          checkoutOrder.map((item: TExtendedPurchases) => (
            <Item
              key={item.id}
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
            <button
              className="mr-7 cursor-pointer whitespace-nowrap border-0 bg-none p-0 text-[14px]  text-blue-600"
              onClick={() => setIsModalVoucherVisible(true)}
            >
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
                Số dư TK Shoppe ₫0
              </li>
              <li className="cursor-not-allowed border border-gray-400 px-5 py-2 text-[14px] text-gray-400 lg:text-[15px]">
                Ví Shoppe
              </li>

              {Object.keys(PaymentMethod).map((method, index) => {
                const isActive = tabActive === method;
                return (
                  <li
                    key={index}
                    className={`cursor-pointer border px-5 py-2 text-[15px] ${
                      isActive ? "border-main text-main" : "border-gray-400 text-black"
                    }`}
                  >
                    <button onClick={() => handlePaymentSelection(method as keyof typeof PaymentMethod)}>
                      {PaymentMethod[method as keyof typeof PaymentMethod]}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          {selectedPayment && (
            <div className="p-8 pt-16">
              {selectedPayment.value.startsWith("http") ? (
                <div>
                  <p>Quét mã QR để thực hiện chuyển khoản:</p>
                  <img
                    src={selectedPayment.value}
                    alt="Payment Method"
                    width={200}
                  />
                </div>
              ) : (
                <p className="space-x-16 text-[14px]">
                  <span>Thanh toán khi nhận hàng</span>
                  <span>Phí thu hộ: ₫0 VNĐ. Ưu đãi về phí vận chuyển (nếu có) áp dụng cả với phí thu hộ.</span>
                </p>
              )}
            </div>
          )}
          <div className="flex justify-end p-2 pr-6 lg:p-8 lg:pr-14">
            <ul className="space-y-7">
              <li className="grid grid-cols-2 items-center text-[15px]">
                <span className="col-span-1 mr-8 text-gray-400">Tổng tiền hàng</span>
                <span className="text-right">
                  ₫
                  {formatCurrency(
                    checkoutOrder.reduce(
                      (acc: any, item: TExtendedPurchases) => acc + item.buy_count * item.product.price,
                      0,
                    ),
                  )}
                </span>
              </li>
              <li className="grid grid-cols-2 items-center text-[15px]">
                <span className="col-span-1 mr-8 text-gray-400">Tổng tiền phí vận chuyển</span>
                <span className="text-right">₫{formatCurrency(checkoutOrder.length * shippingFee)}</span>
              </li>
              <li className="grid grid-cols-2 items-center text-[15px]">
                <span className="col-span-1 mr-8 text-gray-400">Giảm giá phí vận chuyển</span>
                <span className="text-right">- ₫{formatCurrency(checkoutOrder.length * shippingFee)}</span>
              </li>
              {selectedVoucher && (
                <li className="grid grid-cols-2 items-center text-[15px]">
                  <span className="col-span-1 mr-8 text-gray-400">Tổng cộng voucher giảm giá</span>
                  <span className="text-right">- ₫{formatCurrency(priceDiscount)}</span>
                </li>
              )}
              <li className="grid grid-cols-2 items-center text-[15px]">
                <span className="col-span-1 mr-8 text-gray-400">Tổng thanh toán</span>
                <span className="text-right text-3xl text-main lg:text-4xl">₫{formatCurrency(totalPrice)}</span>
              </li>
            </ul>
          </div>
          <p className="mt-4 flex flex-col items-center gap-6 border-t px-6 py-4 lg:mx-10 lg:mt-0 lg:flex-row lg:justify-between lg:gap-0 lg:py-8">
            <span className="px-6 text-[14px] lg:px-0 lg:text-[16px]">
              Nhấn &ldquo;Đặt hàng&ldquo; đồng nghĩa với việc bạn đồng ý tuân theo{" "}
              <span className="text-blue-600">Điều khoản Shopee</span>
            </span>
            <div className="flex flex-col">
              <button
                onClick={handleOrder}
                className="bg-main px-36 py-4 text-[14px] text-white lg:text-[16px]"
              >
                Đặt hàng
              </button>
              <br />
              {!address && <span className="text-red-500">Vui lòng chọn địa chỉ nhận hàng</span>}
            </div>
          </p>
        </div>
      </div>
    );
};

export default Checkout;
