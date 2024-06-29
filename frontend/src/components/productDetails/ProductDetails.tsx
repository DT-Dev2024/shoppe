import { Swiper, SwiperSlide } from "swiper/react";
import "./ProductDetails.css";
// import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { FaCartArrowDown, FaMinus, FaPlus } from "react-icons/fa";
import QuantityController from "./QuantityControllerProps/QuantityControllerProps";
import { useNavigate, useParams } from "react-router-dom";
import productApi from "src/apis/product.api";
import { TProduct } from "src/types/product.type";
import { formatCurrency } from "src/utils/formatNumber";
import purchaseAPI, { AddCart } from "src/apis/purchase.api";
import { TUser } from "src/types/user.types";
import { TExtendedPurchases } from "src/types/purchase.type";

const ProductDetails = () => {
  const [currentImageState, setCurrentImageState] = useState<HTMLImageElement | null>(null);
  const [product, setProduct] = useState<TProduct>();
  const { id } = useParams();
  const [user, setUser] = useState<TUser>();

  useEffect(() => {
    // fetchProductById(id);
    const getProduct = async () => {
      const response = (await productApi.getProductById(id || "")) as any;

      if (response) setProduct(response as TProduct);
    };

    getProduct();

    const user = localStorage.getItem("user");
    if (user) setUser(JSON.parse(user) as TUser);
  }, [id]);
  const handleEnterZoomMode = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    setCurrentImageState(e.currentTarget);
  };

  const handleRemoveZoom = () => {
    const image = currentImageState as HTMLImageElement;
    setCurrentImageState(null);
    image.removeAttribute("style");
  };

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (currentImageState) {
      const image = currentImageState as HTMLImageElement;
      const { naturalHeight, naturalWidth } = image;
      const offsetX = event.pageX - (rect.x + window.scrollX);
      const offsetY = event.pageY - (rect.y + window.scrollY);

      const top = offsetY * (1 - naturalHeight / rect.height);
      const left = offsetX * (1 - naturalWidth / rect.width);
      image.style.width = naturalWidth + "px";
      image.style.height = naturalHeight + "px";
      image.style.maxWidth = "unset";
      image.style.top = top + "px";
      image.style.left = left + "px";
    }
  };

  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const handleAddToCart = async () => {
    console.log("Add to cart");
    const data: AddCart = {
      userId: user?.id || "",
      cartItems: [
        {
          productId: product?.id || "",
          buy_count: quantity,
        },
      ],
    };
    const rs = await purchaseAPI.addToCart(data);
    if (rs) {
      await purchaseAPI.getCart(user?.id || "");
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    const data: TExtendedPurchases = {
      product: {
        ...product,
        price:
          product.sale_price > 0
            ? product.product_types[0].price * ((100 - product.sale_price) / 100)
            : product.product_types[0].price,
      },
      buy_count: quantity,
      price:
        product.sale_price > 0
          ? product.product_types[0].price * ((100 - product.sale_price) / 100)
          : product.product_types[0].price,
      checked: false,
      disabled: false,
      price_before_discount: product.sale_price > 0 ? product.product_types[0].price : 0,
      id: product.id,
      createdAt: "",
      status: "WAITING",
      updatedAt: "",
    };

    navigate("/checkout", { state: [data] });
  };
  const productQuantity = Math.floor(Math.random() * 1000) + 1;
  const reviews = Math.floor(Math.random() * 1000) + 1;
  return (
    <div className="mt-40 bg-gray-200 py-6 pt-12">
      <div className="bg-white p-4 shadow">
        <div className="container">
          <div className="lg:grid lg:grid-cols-12 lg:gap-9">
            <div className="block lg:col-span-5">
              <Swiper
                // thumbs={{ swiper: thumbSwiper && !thumbSwiper.destroyed ? thumbSwiper : null }}
                spaceBetween={10}
                grabCursor={true}
                preventInteractionOnTransition={true}
                // modules={[Thumbs]}
                className="transition-all duration-200 hover:shadow-bottom-spread active:pointer-events-none"
              >
                {/* {product.images.map((image) => {
                  return ( */}
                <SwiperSlide>
                  <div
                    className="relative w-full overflow-hidden pt-[100%]"
                    onMouseMove={handleZoom}
                    onMouseLeave={handleRemoveZoom}
                  >
                    <img
                      src="https://api-ecom.duthanhduoc.com/images/bbea6d3e-e5b1-494f-ab16-02eece816d50.jpg"
                      alt="Điện thoại di động"
                      onMouseEnter={handleEnterZoomMode}
                      aria-hidden={true}
                      className="absolute left-0 top-0 h-full w-full cursor-zoom-in bg-white object-cover"
                    />
                  </div>
                </SwiperSlide>
                {/* );
                })} */}
              </Swiper>
              <Swiper
                // onSwiper={setThumbSwiper}
                className="mt-4"
                grabCursor={true}
                breakpoints={{
                  320: {
                    slidesPerView: 3,
                    spaceBetween: 10,
                    freeMode: true,
                  },
                  1024: {
                    slidesPerView: 5,
                    spaceBetween: 10,
                  },
                }}
                // navigation={true}
                // modules={[Navigation, Thumbs, FreeMode]}
              >
                {/* {product.images.map((image) => {
                  return ( */}
                <SwiperSlide>
                  <div className="relative w-full pt-[100%]">
                    <img
                      src="https://api-ecom.duthanhduoc.com/images/bbea6d3e-e5b1-494f-ab16-02eece816d50.jpg"
                      alt="details điện thoại di động"
                      className="absolute left-0 top-0 h-full w-full cursor-pointer bg-white object-cover"
                    />
                  </div>
                </SwiperSlide>
                {/* );
                })} */}
              </Swiper>
            </div>
            <div className="mt-5 block lg:col-span-7">
              {/* <h1 className="text-xl font-medium uppercase">{product.name}</h1> */}
              <h1 className="text-[24px] font-medium uppercase">{product?.name}</h1>
              <div className="mt-4 flex items-center">
                <div className="flex items-center">
                  {/* <span className="mr-1 border-b border-b-primary text-primary">{product.rating}</span> */}
                  <span className="mr-1 border-b text-[16px] font-medium text-[rgb(238,77,45)]">
                    {product?.product_feeback.star} Sao
                  </span>
                  {/* <ProductRating
                    rating={product.rating}
                    activeClassName="fill-primary text-primary h-4 w-4"
                    nonActiveClassName="fill-gray-300 text-gray-300 h-4 w-4"
                  /> */}
                </div>
                <div className="mx-4 h-6 w-[2px] bg-gray-300"></div>
                <div>
                  <span className="text-[16px] font-medium">{reviews}</span>
                  <span className="ml-1 text-[14px] font-medium text-gray-500"> Đánh giá</span>
                </div>
                <div className="mx-4 h-6 w-[2px] bg-gray-300"></div>
                <div>
                  {/* <span>{formatNumberToSocialStyle(product.sold)}</span> */}
                  <span className="text-[16px] font-medium">{product?.product_feeback.sold}</span>
                  <span className="ml-1 text-[14px] font-medium text-gray-500">Đã bán</span>
                </div>
              </div>
              <div className="mb-2 mt-4 flex items-center gap-x-6 bg-gray-50 px-5 py-2">
                {product && product?.sale_price > 0 ? (
                  <div className="text-xl font-light text-[rgb(238,77,45)] sm:text-xl">
                    ₫{formatCurrency(product?.product_types[0].price * ((100 - product.sale_price) / 100) || 0)}
                  </div>
                ) : (
                  <div className="text-[18px] text-gray-500 line-through">
                    ₫{formatCurrency(product?.sale_price || 0)}
                  </div>
                )}

                {product && product?.sale_price > 0 && (
                  <div className="rounded-sm bg-[rgb(238,77,45)] px-1 py-1 text-[14px] font-semibold uppercase text-white">
                    giảm {product?.sale_price}%
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center ">
                <div className="mr-5 max-w-[120px] text-[15px] capitalize text-gray-500">Chính Sách Trả Hàng</div>

                <div className="mt-0 flex items-center ">
                  <div className="ml-4 flex gap-2 text-[15px] text-gray-500">
                    {/* {product.quantity} sản phẩm có sẵn */}
                    <img
                      src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/b69402e4275f823f7d47.svg"
                      alt=""
                      width={20}
                    />
                    Trả hàng 15 ngày
                  </div>
                  <div className="ml-4 flex gap-2 text-[14px] text-gray-400">
                    {/* {product.quantity} sản phẩm có sẵn */}
                    Đổi ý miễn phí
                    <img
                      src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/be6f27f93268c0f88ded.svg"
                      alt=""
                      width={14}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center ">
                <div className="mr-5 max-w-[120px] text-[15px] capitalize text-gray-500">Vận Chuyển</div>
                <div className="mt-0 flex items-center ">
                  <div className="ml-4 flex gap-2 text-[15px] text-gray-500">
                    {/* {product.quantity} sản phẩm có sẵn */}
                    <img
                      src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/d9e992985b18d96aab90.png"
                      alt=""
                      width={20}
                    />
                    Miễn phí vận chuyển
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center ">
                <div className="mr-5 max-w-[120px] text-[15px] capitalize text-gray-500">Màu Sắc</div>
                <div className="mt-0 flex items-center ">
                  <div className="ml-4 flex gap-2 text-[15px] text-gray-500">
                    <div className="flex gap-3">
                      <p className="border-[2px] border-[#adadad] p-2 text-black">Đen</p>
                      <p className="border-[2px] border-[#adadad] p-2 text-black">Trắng</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center ">
                <div className="mr-5 text-[15px] capitalize text-gray-500">Số lượng</div>
                <div className="text-3xl">
                  {/* <QuantityController /> */}
                  <div className=" ml-16 flex lg:ml-0  lg:mr-[180px]  ">
                    <button
                      type="button"
                      className="inline-flex shrink-0 items-center justify-center rounded border border-gray-300 p-1"
                      onClick={() => {
                        setQuantity((prevQuantity) => prevQuantity - 1);
                      }}
                    >
                      <FaMinus />
                    </button>
                    <span className="mx-1 w-10 shrink-0 border bg-transparent text-center font-medium text-gray-900 focus:outline-none focus:ring-0">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="inline-flex shrink-0 items-center justify-center rounded border border-gray-300 p-1"
                      onClick={() => {
                        setQuantity((prevQuantity) => prevQuantity + 1);
                      }}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                {/* <p className="text-2xl font-medium">20</p> */}
                <div className="ml-6 text-[15px] text-gray-500">
                  {/* {product.quantity} sản phẩm có sẵn */}
                  {productQuantity} sản phẩm có sẵn
                </div>
              </div>
              <div className="mt-6 sm:flex sm:items-center sm:gap-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex h-[60px] w-full items-center justify-center rounded-sm border border-[rgb(238,77,45)] bg-[rgb(252,222,216)] px-5 capitalize text-[rgb(238,77,45)] shadow-sm hover:bg-[rgb(255,160,142)] sm:w-auto"
                >
                  <FaCartArrowDown className="mr-4 text-xl" />
                  <p className="text-[16px]">Thêm vào giỏ hàng</p>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="mt-5 flex h-[60px] w-full min-w-[5rem] items-center justify-center rounded-sm bg-[rgb(238,77,45)] px-5 capitalize text-white shadow-sm outline-none hover:bg-[rgb(255,117,89)] sm:mt-0 sm:w-auto"
                >
                  <p className="text-[16px]">Mua ngay</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
