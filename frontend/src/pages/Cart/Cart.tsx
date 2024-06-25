import { produce } from "immer";

import { AiOutlineExclamationCircle } from "react-icons/ai";
import { VscTriangleDown } from "react-icons/vsc";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { BsExclamationCircle } from "react-icons/bs";
import React, { useContext, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmptyCartIcon from "src/assets/img/empty-cart.png";
import Voucher from "src/assets/img/voucher.png";
import Button from "src/components/Button";
import { path } from "src/constants/path.enum";
import { CartContext } from "src/contexts/cart.context";
import { TPurchase, TVoucher } from "src/types/purchase.type";
import { formatCurrency } from "src/utils/formatNumber";
import { CiCircleQuestion } from "react-icons/ci";
import { FormSubmit } from "src/helpers";
import { OrderContext } from "src/contexts/order.context";
type Quantity = Record<string, { quantity: number | string }>;
interface CartProps {
  pricesAll: string;
  priceDiscount: string;
  finalPrice: string;
}

const voucherMock: TVoucher[] = [
  {
    _id: "1",
    type: "SHOP",
    code: "SHOPEE",
    discount: 300000,
    discount_type: "FIXED",
    expire: "2021-09-07T07:54:15.000Z",
    minium_price: 0,
    createdAt: "2021-09-07T07:54:15.000Z",
    updatedAt: "2021-09-07T07:54:15.000Z",
  },
  {
    _id: "2",
    type: "USER",
    code: "USER",
    discount: 500000,
    discount_type: "FIXED",
    expire: "2021-09-07T07:54:15.000Z",
    minium_price: 1000000,
    createdAt: "2021-09-07T07:54:15.000Z",
    updatedAt: "2021-09-07T07:54:15.000Z",
  },
  {
    _id: "3",
    type: "SHOP",
    code: "SHOPEE",
    discount: 300000,
    discount_type: "FIXED",
    expire: "2021-09-07T07:54:15.000Z",
    minium_price: 0,
    createdAt: "2021-09-07T07:54:15.000Z",
    updatedAt: "2021-09-07T07:54:15.000Z",
  },
  {
    _id: "4",
    type: "USER",
    code: "USER",
    discount: 500000,
    discount_type: "FIXED",
    expire: "2021-09-07T07:54:15.000Z",
    minium_price: 1000000,
    createdAt: "2021-09-07T07:54:15.000Z",
    updatedAt: "2021-09-07T07:54:15.000Z",
  },
  {
    _id: "5",
    type: "SHOP",
    code: "SHOPEE",
    discount: 300000,
    discount_type: "FIXED",
    expire: "2021-09-07T07:54:15.000Z",
    minium_price: 0,
    createdAt: "2021-09-07T07:54:15.000Z",
    updatedAt: "2021-09-07T07:54:15.000Z",
  },
  {
    _id: "6",
    type: "USER",
    code: "USER",
    discount: 500000,
    discount_type: "FIXED",
    expire: "2021-09-07T07:54:15.000Z",
    minium_price: 1000000,
    createdAt: "2021-09-07T07:54:15.000Z",
    updatedAt: "2021-09-07T07:54:15.000Z",
  },
  {
    _id: "7",
    type: "SHOP",
    code: "SHOPEE",
    discount: 300000,
    discount_type: "FIXED",
    expire: "2021-09-07T07:54:15.000Z",
    minium_price: 0,
    createdAt: "2021-09-07T07:54:15.000Z",
    updatedAt: "2021-09-07T07:54:15.000Z",
  },
  {
    _id: "8",
    type: "USER",
    code: "USER",
    discount: 500000,
    discount_type: "FIXED",
    expire: "2021-09-07T07:54:15.000Z",
    minium_price: 1000000,
    createdAt: "2021-09-07T07:54:15.000Z",
    updatedAt: "2021-09-07T07:54:15.000Z",
  },
  {
    _id: "9",
    type: "SHOP",
    code: "SHOPEE",
    discount: 300000,
    discount_type: "FIXED",
    expire: "2021-09-07T07:54:15.000Z",
    minium_price: 0,
    createdAt: "2021-09-07T07:54:15.000Z",
    updatedAt: "2021-09-07T07:54:15.000Z",
  },
  {
    _id: "10",
    type: "USER",
    code: "USER",
    discount: 500000,
    discount_type: "FIXED",
    expire: "2021-09-07T07:54:15.000Z",
    minium_price: 1000000,
    createdAt: "2021-09-07T07:54:15.000Z",
    updatedAt: "2021-09-07T07:54:15.000Z",
  },
];

const Cart = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { extendedPurchases, setExtendedPurchases } = useContext(CartContext);
  // Đại diện cho những purchase được checked
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases]);
  const checkedPurchasesCount = checkedPurchases.length;
  const totalCheckedPurchasesPrice = useMemo(
    () => checkedPurchases.reduce((prev, current) => prev + current.product.price * current.buy_count, 0),
    [checkedPurchases],
  );
  const totalSavedPrice = useMemo(
    () =>
      checkedPurchases.reduce(
        (prev, current) => prev + (current.price_before_discount - current.product.price) * current.buy_count,
        0,
      ),
    [checkedPurchases],
  );

  const totalPriceBeforeDiscount = useMemo(
    () => checkedPurchases.reduce((prev, current) => prev + current.price_before_discount * current.buy_count, 0),
    [checkedPurchases],
  );
  const [quantities, setQuantities] = useState<Quantity>({});

  const handleSelectProduct = (productIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[productIndex].checked = e.target.checked;
      }),
    );
  };

  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases]);

  const handleSelectAllProducts = () => {
    setExtendedPurchases(
      produce((draft) => {
        draft.forEach((purchase) => {
          purchase.checked = !isAllChecked;
        });
      }),
    );
  };

  const handleChangeQuantity = (increment: number, id: string, item: TPurchase) => {
    const newQuantity = (parseInt(quantities[id]?.quantity as string) || item.buy_count) + increment;
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: {
        quantity: newQuantity,
      },
    }));

    setExtendedPurchases(
      produce((draft) => {
        const index = draft.findIndex((purchase) => purchase._id === id);
        if (index !== -1) {
          // Ensure the purchase is checked before updating
          draft[index].buy_count = newQuantity;
        }
      }),
    );
  };
  const [isModalEmptyVisible, setIsModalEmptyVisible] = useState(false);
  const [isModalDeleteCartVisible, setIsModalDeleteCartVisible] = useState(false);
  const [isModalDetailVisible, setIsModalDetailVisible] = useState(false);
  const [isModalPurchaseEmptyVisible, setIsModalPurchaseEmptyVisible] = useState(false);
  const [isModalVoucherVisible, setIsModalVoucherVisible] = useState(false);

  const handleDeleteMultiplePurchases = () => {
    if (checkedPurchases.length === 0) {
      setIsModalEmptyVisible(true);
      setTimeout(() => {
        setIsModalEmptyVisible(false);
      }, 2000); // Close modal after 2 seconds
    } else {
      setIsModalDeleteCartVisible(true);
    }
  };

  const EmptySelectModal = () => {
    return (
      <div className="fixed inset-0 z-20 flex items-center justify-center ">
        <div className="p-10 text-white bg-black rounded-lg bg-opacity-70">
          <p className="flex justify-center text-6xl ">
            <BsExclamationCircle />
          </p>
          <h1 className="text-2xl">Vui lòng chọn sản phẩm</h1>
        </div>
      </div>
    );
  };
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

  const DetailPurchase = (cart: CartProps) => {
    const { pricesAll, priceDiscount, finalPrice } = cart;
    return (
      <div className="absolute  bottom-[120%] right-full lg:w-[60rem] w-[20rem]  rounded border bg-white p-5 lg:text-2xl text-xl shadow-lg">
        <h1 className="border-b border-gray-300 py-7">Chi tiết khuyến mãi</h1>
        <div className="flex justify-between py-6 border-b border-gray-300">
          <span>Tổng tiền hàng</span>
          <span>₫{pricesAll}</span>
        </div>
        <div className="flex justify-between py-6 border-b border-gray-300">
          <span>Giảm giá sản phẩm</span>
          <span>₫{priceDiscount}</span>
        </div>

        <div className="flex justify-between my-2 mt-4">
          <span>Tiết kiệm</span>
          <span className="text-main">-₫{priceDiscount}</span>
        </div>
        <div className="flex justify-between">
          <span>Tổng số tiền</span>
          <span>₫{finalPrice}</span>
        </div>
        <p className="text-right text-gray-500">Số tiền cuối cùng thanh toán</p>
        <VscTriangleDown className="absolute text-4xl text-white shadow-lg -bottom-6 right-1/4" />
      </div>
    );
  };

  const ModalRemoveCart = () => {
    return (
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40">
        <div className="w-[500px] rounded-lg bg-white px-[40px] pb-[24px] pt-[44px] text-black">
          <h1 className="text-3xl">Bạn có xóa bỏ {checkedPurchasesCount} sản phẩm?</h1>
          <div className="flex justify-end mt-12">
            <button
              onClick={() => setIsModalDeleteCartVisible(false)}
              className="px-10 py-4 mr-2 text-3xl text-white rounded bg-main"
            >
              Trở lại
            </button>
            <button
              onClick={() => {
                // delete to server
              }}
              className="px-10 py-4 text-3xl bg-white mx-7 "
            >
              Có
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ModalPurchaseEmpty = () => {
    return (
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40">
        <div className="w-[530px] rounded-lg bg-white px-[30px] pb-[24px] pt-[44px] text-black">
          <h1 className="text-3xl mb-60">Bạn vẫn chưa chọn sản phẩm nào để mua.</h1>

          <button
            className="w-full py-4 text-2xl text-white bg-main"
            onClick={() => setIsModalPurchaseEmptyVisible(false)}
          >
            OK
          </button>
        </div>
      </div>
    );
  };
  const [selectedVoucher, setSelectedVoucher] = useState<TVoucher | null>(null);
  const listRef = useRef(null);

  const ModalVoucher = () => {
    return (
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40">
        <div className="lg:max-h-[640px] w-[316px]  lg:w-[616px] rounded-lg bg-white  text-black">
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
                className="text-2xl w-60"
              >
                Mã Voucher
              </label>
              <input
                id="voucher"
                type="text"
                placeholder="Mã Shoppe Voucher"
                className="w-full p-4 border border-gray-300"
              />
              <button className="w-60 border p-4 text-xl text-[#ccc] ">Áp dụng</button>
            </form>
            <p className="text-[13px] text-[#bbb] mb-2">Mã Miễn Phí Vận Chuyển</p>
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
              {voucherMock.map((voucher) => (
                <li
                  key={voucher._id}
                  className={`border-b  border-gray-300 p-4 shadow-md`}
                >
                  <div className="relative flex items-center cursor-not-allowed">
                    <div className="absolute top-0 left-0 w-full h-full bg-gray-100 bg-opacity-50"></div>
                    <div className="w-40 h-40 bg-green-600">
                      <img
                        src="https://down-vn.img.susercontent.com/file/sg-11134004-22120-4cskiffs0olvc3"
                        alt=""
                        className="object-cover w-full h-full"
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
                      checked={selectedVoucher?._id === voucher._id}
                      onChange={(e) => {
                        e.preventDefault(); // Prevent the default action
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
            <button
              onClick={() => setIsModalVoucherVisible(false)}
              className="mr-2 rounded  border-2 px-12 py-3 text-xl text-[#b6b6b6] "
            >
              Trở lại
            </button>
            <button
              onClick={() => {
                // delete to server
              }}
              className="px-20 py-3 text-xl text-white border rounded mx-7 bg-main"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };
  const { order, setOrder } = useContext(OrderContext);

  const handlePurchase = () => {
    if (checkedPurchasesCount === 0) {
      setIsModalPurchaseEmptyVisible(true);
      return;
    }

    setOrder(checkedPurchases);

    if (order) {
      navigate(path.checkout);
    }
  };

  return (
    <div className="">
      <Helmet>
        <title>Giỏ hàng</title>
        <meta
          name="description"
          content={`Trang giỏ hàng của Shopee At Home`}
        />
      </Helmet>

      <div className="">
        {isModalEmptyVisible && <EmptySelectModal />}
        {isModalDeleteCartVisible && <ModalRemoveCart />}
        {isModalPurchaseEmptyVisible && <ModalPurchaseEmpty />}
        {isModalVoucherVisible && <ModalVoucher />}
        {extendedPurchases.length > 0 ? (
          <>
            <div className="flex items-center p-3 px-6 mb-4 space-x-3 bg-white border border-yellow-300 rounded-sm shadow">
              <img
                src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/cart/d9e992985b18d96aab90.png"
                alt=""
                width={30}
              />
              <span className=" text-[14px]">
                Nhấn vào mục Mã giảm giá ở cuối trang để hưởng miễn phí vận chuyển bạn nhé!
              </span>
            </div>
            <div className="hidden grid-cols-12 px-16 py-5 text-2xl text-gray-500 capitalize bg-white rounded-sm shadow lg:grid">
              <div className="col-span-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center flex-shrink-0 pr-3">
                    <input
                      id="selectAllProducts"
                      type="checkbox"
                      className="w-6 h-6 accent-primary"
                      checked={isAllChecked}
                      onChange={handleSelectAllProducts}
                    />
                    <label
                      htmlFor="selectAllProducts"
                      className="ml-2 text-2xl text-black cursor-pointer"
                    >
                      Sản phẩm
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-span-6">
                <div className="grid grid-cols-5 text-center">
                  <div className="col-span-2">Đơn giá</div>
                  <div className="col-span-1">Số lượng</div>
                  <div className="col-span-1">Số tiền</div>
                  <div className="col-span-1">Thao tác</div>
                </div>
              </div>
            </div>
            {extendedPurchases.length > 0 && (
              <div className="my-3 rounded-sm shadow ">
                {extendedPurchases.map((purchase, index) => (
                  <div
                    key={purchase._id}
                    className="mb-5 text-2xl text-center bg-white rounded-sm first:mt-0"
                  >
                    <div className="flex items-center justify-between px-16 py-5 border-b">
                      <h5 className="flex space-x-2 text-3xl font-bold">
                        <span>{purchase.product.category.name}</span>
                        <svg
                          viewBox="0 0 16 16"
                          className="w-6"
                        >
                          <g
                            fillRule="evenodd"
                            fill="#f94f2f"
                          >
                            <path d="M15 4a1 1 0 01.993.883L16 5v9.932a.5.5 0 01-.82.385l-2.061-1.718-8.199.001a1 1 0 01-.98-.8l-.016-.117-.108-1.284 8.058.001a2 2 0 001.976-1.692l.018-.155L14.293 4H15zm-2.48-4a1 1 0 011 1l-.003.077-.646 8.4a1 1 0 01-.997.923l-8.994-.001-2.06 1.718a.5.5 0 01-.233.108l-.087.007a.5.5 0 01-.492-.41L0 11.732V1a1 1 0 011-1h11.52zM3.646 4.246a.5.5 0 000 .708c.305.304.694.526 1.146.682A4.936 4.936 0 006.4 5.9c.464 0 1.02-.062 1.608-.264.452-.156.841-.378 1.146-.682a.5.5 0 10-.708-.708c-.185.186-.445.335-.764.444a4.004 4.004 0 01-2.564 0c-.319-.11-.579-.258-.764-.444a.5.5 0 00-.708 0z" />
                          </g>
                        </svg>
                      </h5>
                      <p className="mr-8 text-xl font-bold text-orange-600">Trạng thái</p>
                    </div>
                    <div className="grid px-6 py-6 mt-3 lg:px-16 lg:py-10 lg:grid-cols-12">
                      <div className="flex items-center lg:col-span-6 gap-x-3">
                        <input
                          type="checkbox"
                          className="w-6 h-6 accent-primary"
                          checked={purchase.checked}
                          onChange={handleSelectProduct(index)}
                        />

                        <div className="flex lg:max-w-[40rem]  space-x-2 text-left items-center">
                          <img
                            alt={purchase.product.name}
                            src={purchase.product.image}
                            className="object-cover w-24 mb-8 lg:mb-0 lg:h-36 lg:w-36 "
                          />
                          <div className="mb-6 lg:mb-0">
                            <p className="mb-2 ml-4 text-xl lg:ml-0 lg:mb-4 lg:text-2xl ">{purchase.product.name}</p>
                            <span className="p-2 ml-4 text-base font-thin border lg:ml-0 border-main text-main">
                              Đổi ý miễn phí 15 ngày
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-6 lg:col-span-6">
                        <div className="grid items-center grid-cols-1 col-span-1 grid-rows-1 gap-y-4 lg:grid-cols-5 lg:grid-rows-1 ">
                          <div className="flex items-center justify-start col-span-2 ml-10 lg:ml-0 gap-x-3 lg:flex">
                            <span className="text-gray-300 line-through">
                              ₫{formatCurrency(purchase.product.price_before_discount)}
                            </span>
                            <span className="hidden lg:block">₫{formatCurrency(purchase.product.price)}</span>
                            <span className="block text-primary lg:hidden">
                              ₫{formatCurrency(purchase.product.price)}
                            </span>
                          </div>

                          <div className="ld:mr-0 mr-[180px] lg:flex  ">
                            <button
                              type="button"
                              className="inline-flex items-center justify-center p-1 border border-gray-300 rounded shrink-0"
                              onClick={() => {
                                handleChangeQuantity(-1, purchase.product._id, purchase);
                              }}
                            >
                              <FaMinus />
                            </button>
                            <input
                              className="w-10 mx-1 font-medium text-center text-gray-900 bg-transparent border shrink-0 focus:outline-none focus:ring-0"
                              value={quantities[purchase.product._id]?.quantity || purchase.buy_count}
                              onChange={(e) => {
                                if (e.target.value !== "" && isNaN(parseInt(e.target.value))) {
                                  toast.error("Please enter a number");
                                  return;
                                }
                                const newQuantity = e.target.value ? parseInt(e.target.value) : "";
                                setQuantities((prevQuantities) => ({
                                  ...prevQuantities,
                                  [purchase.product._id]: {
                                    quantity: newQuantity,
                                  },
                                }));
                              }}
                            />
                            <button
                              type="button"
                              className="inline-flex items-center justify-center p-1 border border-gray-300 rounded shrink-0"
                              onClick={() => {
                                handleChangeQuantity(1, purchase.product._id, purchase);
                              }}
                            >
                              <FaPlus />
                            </button>
                          </div>
                          <div className="col-span-1 lg:block">
                            <span className="text-primary">
                              ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                            </span>
                          </div>
                          <div className="col-span-1 mr-6 mr-[220px] lg:ml-0 lg:block">
                            <button className="text-black transition-all bg-none hover:text-primary">Xóa</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 px-6 py-6 mb-4 space-x-3 bg-white border border-t rounded-sm shadow lg:px-16 lg:py-8">
                      <img
                        src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/cart/d9e992985b18d96aab90.png"
                        alt=""
                        width={30}
                      />
                      <span className=" lg:text-[14px] text-[12px] text-left">
                        Giảm ₫300.000 phí vận chuyển đơn tối thiểu ₫0; Giảm ₫500.000 phí vận chuyển đơn tối thiểu
                        ₫1.000.000
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="sticky bottom-0 z-10 p-5 pt-0 mt-8 text-3xl bg-white border border-gray-100 rounded-sm shadow-lg lg:flex-row lg:items-center">
              <div className="grid grid-cols-1 py-4 border-b border-gray-300 lg:grid-cols-2">
                <span></span>
                <div className="flex justify-between">
                  <div className="flex items-center text-[16px]">
                    <img
                      src={Voucher}
                      alt=""
                    />
                    <span className="ml-2 lg:text-[14px]  ">Shopee Voucher</span>
                  </div>
                  <button
                    onClick={() => setIsModalVoucherVisible(true)}
                    className="mr-7 cursor-pointer whitespace-nowrap border-0 bg-none p-0 text-[14px]  text-blue-600"
                  >
                    Chọn hoặc nhập mã
                  </button>
                </div>
              </div>
              <div className="flex pt-4">
                <div className="flex items-center ">
                  <div className="flex items-center justify-center flex-shrink-0 pr-3">
                    <input
                      type="checkbox"
                      id="selectAllProducts"
                      className="w-6 h-6 accent-primary"
                      checked={isAllChecked}
                      onChange={handleSelectAllProducts}
                    />
                  </div>
                  <label
                    htmlFor="selectAllProducts"
                    className="p-3 pl-0 mx-3 border-none text-[13px] cursor-pointer lg:text-[16px] bg-none"
                  >
                    Chọn tất cả{" "}
                  </label>
                  <button
                    onClick={handleDeleteMultiplePurchases}
                    className="lg:text-[16px] text-[13px] p-3 mx-3 border-none bg-none"
                  >
                    Xóa
                  </button>
                </div>

                <div className="flex flex-col mt-5 lg:ml-auto lg:mt-0 lg:flex-row lg:items-center">
                  <div
                    className="flex"
                    onMouseEnter={() => setIsModalDetailVisible(true)}
                    onMouseLeave={() => setIsModalDetailVisible(false)}
                  >
                    <span className="text-[13px] lg:text-[16px]">Tổng thanh toán
                      <br />({checkedPurchasesCount} sản phẩm):</span>

                    <div className="flex flex-col items-start justify-center text-2xl lg:justify-end">
                      <div className="flex justify-start gap-4 ml-4 w-ful text-primary">
                        <span className="text-2xl lg:text-3xl">₫{formatCurrency(totalCheckedPurchasesPrice)}</span>
                        {checkedPurchasesCount > 0 && (
                          <span className="relative flex items-center text-2xl text-gray-500 cursor-pointer">
                            {isModalDetailVisible ? <IoIosArrowDown /> : <IoIosArrowUp />}
                            {isModalDetailVisible && (
                              <DetailPurchase
                                pricesAll={formatCurrency(totalPriceBeforeDiscount)}
                                priceDiscount={formatCurrency(totalSavedPrice)}
                                finalPrice={formatCurrency(totalCheckedPurchasesPrice)}
                              />
                            )}
                          </span>
                        )}
                      </div>
                      {checkedPurchasesCount > 0 && (
                        <div className="mt-1 ml-1">
                          <span className="text-gray-500 lg:text-[16px] text-[12px]">Tiết kiệm</span>
                          <span className="ml-6 text-left text-primary">₫{formatCurrency(totalSavedPrice)}k</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handlePurchase}
                    // isLoading={buyProductsMutation.isLoading}
                    className="mt-5 flex  w-80 items-center justify-center bg-main py-3 text-[14px] uppercase text-white hover:bg-orange-600 lg:ml-4 lg:mt-0"
                  >
                    Mua hàng
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="mx-auto flex w-full max-w-[180px] flex-col items-center justify-center">
            <img
              src={EmptyCartIcon}
              alt="Empty"
              className="w-20 h-20 sm:h-40 sm:w-40"
            />
            <span className="my-2 text-[14px]">Giỏ hàng còn trống</span>
            <Link
              to={path.home}
              className="w-full bg-primary px-2 py-3 text-center text-[16px] uppercase text-white"
            >
              Mua ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
