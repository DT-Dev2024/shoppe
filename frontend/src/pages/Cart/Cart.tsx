import { produce } from "immer";

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { BsExclamationCircle } from "react-icons/bs";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { VscTriangleDown } from "react-icons/vsc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmptyCartIcon from "src/assets/img/empty-cart.png";
import Voucher from "src/assets/img/voucher.png";
import Button from "src/components/Button";
import { path } from "src/constants/path.enum";
import { CartContext } from "src/contexts/cart.context";
import { TPurchase, TVoucher } from "src/types/purchase.type";
import { formatCurrency } from "src/utils/formatNumber";

import _ from "lodash";
import { CiCircleQuestion } from "react-icons/ci";
import purchaseAPI, { UpdateItem } from "src/apis/purchase.api";
import { getAllVouchers } from "src/apis/voucher";
import LoadingSmall from "src/components/Loading/LoadingSmall";
import { OrderContext } from "src/contexts/order.context";
import { TUser } from "src/types/user.types";
type Quantity = Record<string, { quantity: number | string }>;

interface CartProps {
  pricesAll: string;
  priceDiscount: string;
  finalPrice: string;
}

const Cart = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [vouchers, setVouchers] = useState<TVoucher[]>([]);
  const [user, setUser] = useState<TUser>();

  useEffect(() => {
    // setVouchers(voucherMock);

    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser: TUser = JSON.parse(user);
      setUser(parsedUser);
    }
    const vouchers = async () => {
      try {
        const response = await getAllVouchers();
        setVouchers(response.data);
      } catch (error) {
        toast.error("Có lỗi xảy ra khi lấy danh sách voucher");
      }
    };
    vouchers();
  }, []);
  const [quantities, setQuantities] = useState<Quantity>({});

  const { extendedPurchases, setExtendedPurchases } = useContext(CartContext);
  useEffect(() => {
    if (extendedPurchases) {
      // setTotal(parseFloat(data.getCart.total));
      extendedPurchases.forEach((item) => {
        setQuantities((prevQuantities) => ({
          ...prevQuantities,
          [item.id]: {
            quantity: item.buy_count,
          },
        }));
      });
    }
  }, [extendedPurchases]);
  // Đại diện cho những purchase được checked
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases]);

  const checkedPurchasesCount = checkedPurchases.length;
  const totalCheckedPurchasesPrice = useMemo(
    () =>
      checkedPurchases.reduce((prev, current) => {
        const price =
          current.product.sale_price > 0
            ? current.product.price * ((100 - current.product.sale_price) / 100)
            : current.product.price;
        const quantity = parseInt(quantities[current.id]?.quantity as string);

        return prev + price * (quantity > current.buy_count ? current.buy_count : quantity);
      }, 0),
    [checkedPurchases],
  );
  const totalSavedPrice = useMemo(
    () =>
      checkedPurchases.reduce((prev, current) => {
        const price_before_discount = current.product.sale_price >= 0 ? current.product.price : 0;
        const price =
          current.product.sale_price > 0
            ? current.product.price * ((100 - current.product.sale_price) / 100)
            : current.product.price;
        const quantity = parseInt(quantities[current.id]?.quantity as string);
        return prev + (price_before_discount - price) * (quantity > current.buy_count ? current.buy_count : quantity);
      }, 0),
    [checkedPurchases],
  );

  const totalPriceBeforeDiscount = useMemo(
    () =>
      checkedPurchases.reduce((prev, current) => {
        const price_before_discount = current.product.sale_price >= 0 ? current.product.price : 0;
        const quantity = parseInt(quantities[current.id]?.quantity as string);

        return prev + price_before_discount * (quantity > current.buy_count ? current.buy_count : quantity);
      }, 0),
    [checkedPurchases],
  );

  const [loading, setLoading] = useState(false);
  const debouncedUpdateQuantity = useCallback(
    _.debounce(async (productId: string, buy_count: number, purchaseId: string, userId: string) => {
      setLoading(true);
      const data: UpdateItem = {
        userId,
        cartItem: {
          productId,
          buy_count,
        },
      };

      const rs = await purchaseAPI.updateCart(data);

      if (rs.status === 200) {
        setExtendedPurchases(
          produce((draft) => {
            const index = draft.findIndex((purchase) => purchase.id === purchaseId);
            if (index !== -1) {
              draft[index].buy_count = buy_count;
            }
          }),
        );
      }
      setLoading(false);
    }, 1000),
    [],
  );

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
    if (user) debouncedUpdateQuantity(item.product.id, newQuantity, id, user.id);
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
        <div className="rounded-lg bg-black bg-opacity-70 p-10 text-white">
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
      <div className="absolute  bottom-[120%] right-full w-[20rem] rounded  border bg-white p-5 text-xl shadow-lg lg:w-[60rem] lg:text-2xl">
        <h1 className="border-b border-gray-300 py-7">Chi tiết khuyến mãi</h1>
        <div className="flex justify-between border-b border-gray-300 py-6">
          <span>Tổng tiền hàng</span>
          <span>₫{pricesAll}</span>
        </div>
        <div className="flex justify-between border-b border-gray-300 py-6">
          <span>Giảm giá sản phẩm</span>
          <span>₫{priceDiscount}</span>
        </div>

        <div className="my-2 mt-4 flex justify-between">
          <span>Tiết kiệm</span>
          <span className="text-main">-₫{priceDiscount}</span>
        </div>
        <div className="flex justify-between">
          <span>Tổng số tiền</span>
          <span>₫{finalPrice}</span>
        </div>
        <p className="text-right text-gray-500">Số tiền cuối cùng thanh toán</p>
        <VscTriangleDown className="absolute -bottom-6 right-1/4 text-4xl text-white shadow-lg" />
      </div>
    );
  };
  const deleteCartIems = async (id?: string) => {
    if (user) {
      setLoading(true);
      let data;
      if (!id) {
        data = {
          userId: user.id,
          productIds: checkedPurchases.map((purchase) => purchase.product.id),
        };
      } else {
        data = {
          userId: user.id,
          productIds: [id],
        };
      }
      const response = await purchaseAPI.deleteCart(data.userId, data.productIds);
      if (response.status === 200) {
        const newPurchases = extendedPurchases.filter((purchase) => !data.productIds.includes(purchase.product.id));
        setExtendedPurchases(newPurchases);
        setIsModalDeleteCartVisible(false);
      }
      setLoading(false);
    }
  };

  const ModalRemoveCart = () => {
    return (
      <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-40">
        <div className="w-[500px] rounded-lg bg-white px-[40px] pb-[24px] pt-[44px] text-black">
          <h1 className="text-3xl">Bạn có xóa bỏ {checkedPurchasesCount} sản phẩm?</h1>
          <div className="mt-12 flex justify-end">
            <button
              onClick={() => setIsModalDeleteCartVisible(false)}
              className="mr-2 rounded bg-main px-10 py-4 text-3xl text-white"
            >
              Trở lại
            </button>
            <button
              onClick={() => deleteCartIems()}
              className="mx-7 bg-white px-10 py-4 text-3xl "
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
          <h1 className="mb-60 text-3xl">Bạn vẫn chưa chọn sản phẩm nào để mua.</h1>

          <button
            className="w-full bg-main py-4 text-2xl text-white"
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
              {vouchers.map((voucher) => (
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
            <button
              onClick={() => setIsModalVoucherVisible(false)}
              className="mr-2 rounded  border-2 px-12 py-3 text-xl text-[#b6b6b6] "
            >
              Trở lại
            </button>
            <button
              onClick={() => setIsModalVoucherVisible(false)}
              className="mx-7 rounded border bg-main px-20 py-3 text-xl text-white"
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

    if (order) {
      const data = checkedPurchases.map((purchase) => {
        const quantity = quantities[purchase.product.id]?.quantity || purchase.buy_count;
        const price =
          purchase.product.sale_price > 0
            ? purchase.product.price * ((100 - purchase.product.sale_price) / 100)
            : purchase.product.price;
        const price_before_discount = purchase.product.sale_price > 0 ? purchase.product.price : 0;
        return {
          ...purchase,
          buy_count: parseInt(quantity as string),
          product: {
            ...purchase.product,
            price: price,
          },
        };
      });
      navigate(path.checkout, {
        state: data,
      });
      setExtendedPurchases(
        produce((draft) => {
          draft.forEach((purchase) => {
            purchase.checked = false;
          });
        }),
      );
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
        {loading && <LoadingSmall />}
        {isModalEmptyVisible && <EmptySelectModal />}
        {isModalDeleteCartVisible && <ModalRemoveCart />}
        {isModalPurchaseEmptyVisible && <ModalPurchaseEmpty />}
        {isModalVoucherVisible && <ModalVoucher />}
        {extendedPurchases.length > 0 ? (
          <>
            <div className="mb-4 flex hidden items-center space-x-3 rounded-sm border border-yellow-300 bg-white p-3 px-6 shadow lg:block">
              <img
                src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/cart/d9e992985b18d96aab90.png"
                alt=""
                width={30}
              />
              <span className=" text-[14px]">
                Nhấn vào mục Mã giảm giá ở cuối trang để hưởng miễn phí vận chuyển bạn nhé!
              </span>
            </div>
            <div className="hidden grid-cols-12 rounded-sm bg-white px-16 py-5 text-2xl capitalize text-gray-500 shadow lg:grid">
              <div className="col-span-6">
                <div className="flex items-center">
                  <div className="flex flex-shrink-0 items-center justify-center pr-2">
                    <input
                      id="selectAllProducts"
                      type="checkbox"
                      className="h-6 w-6 accent-primary"
                      checked={isAllChecked}
                      onChange={handleSelectAllProducts}
                    />
                    <label
                      htmlFor="selectAllProducts"
                      className="ml-2 cursor-pointer text-2xl text-black"
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
                {extendedPurchases.map((purchase, index) => {
                  const price =
                    purchase.product.sale_price > 0
                      ? purchase.product.price * ((100 - purchase.product.sale_price) / 100)
                      : purchase.product.price;
                  const price_before_discount = purchase.product.sale_price > 0 ? purchase.product.price : 0;
                  return (
                    <div
                      key={purchase.id}
                      className="mb-5 rounded-sm bg-white text-center text-2xl first:mt-0"
                    >
                      <div className="flex items-center justify-between border-b px-16 py-5">
                        <h5 className="flex space-x-2 text-3xl font-bold">
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
                      <div className="mt-3 grid px-6 py-6 lg:grid-cols-12 lg:px-16 lg:py-10">
                        <div className="col-span-6 flex items-center gap-x-3">
                          <input
                            type="checkbox"
                            className="h-6 w-6 accent-primary"
                            checked={purchase.checked}
                            onChange={handleSelectProduct(index)}
                          />

                          <div className="flex items-center  space-x-2 text-left lg:max-w-[40rem]">
                            <img
                              alt={purchase.product.name}
                              src={purchase.product.image}
                              className="mb-8 w-28 object-cover lg:mb-0 lg:h-36 lg:w-36 "
                            />
                            <div className="mb-6 lg:mb-0">
                              <p className="mb-2 ml-4 line-clamp-2 text-xl lg:mb-4 lg:ml-0 lg:text-2xl ">
                                {purchase.product.name}
                              </p>
                              <span className="ml-4 border border-main p-2 text-base font-thin text-main lg:ml-0">
                                Đổi ý miễn phí 15 ngày
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-6 mt-[-10px] lg:col-span-6 lg:mt-0">
                          <div className=" grid grid-cols-2 items-center gap-y-4 lg:grid-cols-5 lg:grid-rows-1 ">
                            <div className=" col-span-2 ml-40 flex items-center  justify-start gap-x-3 lg:col-span-2 lg:ml-10 lg:flex">
                              {price_before_discount > 0 && (
                                <span className="text-[14px]  text-gray-300 line-through lg:text-[15px]">
                                  ₫{formatCurrency(price_before_discount)}
                                </span>
                              )}

                              <span className="text-[14px] text-primary lg:text-[15px]">₫{formatCurrency(price)}</span>
                              <span className=" hidden text-primary">₫{formatCurrency(purchase.product.price)}</span>
                            </div>

                            <div className=" ml-40 flex lg:ml-6 lg:mr-[180px] ">
                              <button
                                type="button"
                                className="inline-flex shrink-0 items-center justify-center rounded border border-gray-300 p-1"
                                onClick={() => {
                                  handleChangeQuantity(-1, purchase.id, purchase);
                                }}
                              >
                                <FaMinus />
                              </button>
                              <input
                                className="mx-1 w-10 shrink-0 border bg-transparent text-center font-medium text-gray-900 focus:outline-none focus:ring-0"
                                value={quantities[purchase.id]?.quantity || purchase.buy_count}
                                onChange={(e) => {
                                  if (e.target.value !== "" && isNaN(parseInt(e.target.value))) {
                                    toast.error("Please enter a number");
                                    return;
                                  }
                                  const newQuantity = e.target.value ? parseInt(e.target.value) : "";
                                  setQuantities((prevQuantities) => ({
                                    ...prevQuantities,
                                    [purchase.id]: {
                                      quantity: newQuantity,
                                    },
                                  }));
                                }}
                              />
                              <button
                                type="button"
                                className="inline-flex shrink-0 items-center justify-center rounded border border-gray-300 p-1"
                                onClick={() => {
                                  handleChangeQuantity(1, purchase.id, purchase);
                                }}
                              >
                                <FaPlus />
                              </button>
                            </div>
                            <div className="hidden lg:block">
                              <span className="text-[14px] text-primary lg:text-[15px]">
                                ₫
                                {formatCurrency(
                                  price * (parseInt(quantities[purchase.id]?.quantity as string) || purchase.buy_count),
                                )}
                              </span>
                            </div>
                            <div className=" mr-0 hidden text-[14px] lg:ml-6  lg:block lg:text-[15px]">
                              <button
                                onClick={() => deleteCartIems(purchase.product.id)}
                                className="bg-none text-black transition-all hover:text-primary"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-4 flex items-center space-x-3 rounded-sm border border-t bg-white p-3 px-6 py-6 shadow lg:px-16 lg:py-8">
                        <img
                          src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/cart/d9e992985b18d96aab90.png"
                          alt=""
                          width={30}
                        />
                        <span className=" text-left text-[12px] lg:text-[14px]">
                          Giảm ₫300.000 phí vận chuyển đơn tối thiểu ₫0; Giảm ₫500.000 phí vận chuyển đơn tối thiểu
                          ₫1.000.000
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="sticky bottom-0 z-10 mt-8 rounded-sm border border-gray-100 bg-white p-5 pt-0 text-3xl shadow-lg lg:flex-row lg:items-center">
              <div className="grid grid-cols-1 border-b border-gray-300 py-4 lg:grid-cols-2">
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
              <div className="flex gap-[20px] pt-4 lg:gap-0">
                <div className="flex items-center ">
                  <div className="flex flex-shrink-0 items-center justify-center pr-3">
                    <input
                      type="checkbox"
                      id="selectAllProducts"
                      className="h-6 w-6 accent-primary"
                      checked={isAllChecked}
                      onChange={handleSelectAllProducts}
                    />
                  </div>
                  <label
                    htmlFor="selectAllProducts"
                    className="mx-2 cursor-pointer border-none bg-none p-0 pl-0 text-[13px] lg:text-[16px]"
                  >
                    Chọn tất cả{" "}
                  </label>
                  <button
                    onClick={handleDeleteMultiplePurchases}
                    className="mx-3 border-none bg-none p-0 text-[13px] lg:text-[16px]"
                  >
                    Xóa
                  </button>
                </div>

                <div className="mt-5 flex flex-col lg:ml-auto lg:mt-0 lg:flex-row lg:items-center">
                  <div
                    className="flex"
                    onMouseEnter={() => setIsModalDetailVisible(true)}
                    onMouseLeave={() => setIsModalDetailVisible(false)}
                  >
                    <span className="text-[13px] lg:text-[16px]">
                      Tổng thanh toán
                      <br />({checkedPurchasesCount} sản phẩm):
                    </span>

                    <div className="flex flex-col items-start justify-center text-2xl lg:justify-end">
                      <div className="w-ful ml-4 flex justify-start gap-4 text-primary">
                        <span className="text-2xl lg:text-3xl">₫{formatCurrency(totalCheckedPurchasesPrice)}</span>
                        {checkedPurchasesCount > 0 && (
                          <span className="relative flex cursor-pointer items-center text-2xl text-gray-500">
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
                        <div className="ml-1 mt-1">
                          <span className="text-[12px] text-gray-500 lg:text-[16px]">Tiết kiệm</span>
                          <span className="ml-6 text-left text-primary">₫{formatCurrency(totalSavedPrice)}</span>
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
              className="h-20 w-20 sm:h-40 sm:w-40"
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
