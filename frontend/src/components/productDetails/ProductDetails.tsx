import { Swiper, SwiperSlide } from "swiper/react";
import "./ProductDetails.css";
// import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import { FaCartArrowDown, FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import productApi from "src/apis/product.api";
import purchaseAPI, { AddCart } from "src/apis/purchase.api";
import { TProduct } from "src/types/product.type";
import { TExtendedPurchases } from "src/types/purchase.type";
import { TUser } from "src/types/user.types";
import { formatCurrency } from "src/utils/formatNumber";
import reviews, { Review } from "./DataReview";
import LoadingSmall from "../Loading/LoadingSmall";
import { AuthContextInterface, CartContext } from "src/contexts/cart.context";
import ProductList from "src/pages/ProductList";
// import reviews from "./DataReview.js";
const ProductDetails = () => {
  const [currentImageState, setCurrentImageState] = useState<HTMLImageElement | null>(null);
  const [product, setProduct] = useState<TProduct>();
  const { id } = useParams();
  const [user, setUser] = useState<TUser>();
  const { setExtendedPurchases } = useContext(CartContext) as AuthContextInterface;

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
  const [loadingAddCart, setLoadingAddCart] = useState(false);
  const handleAddToCart = async () => {
    setLoadingAddCart(true);
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
      const cart = await purchaseAPI.getCart(user?.id || "");
      if (cart.status === 200) {
        setExtendedPurchases(cart.data.cart_items ?? []);
      }
    }
    setLoadingAddCart(false);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const data: TExtendedPurchases = {
      product: {
        ...product,
        price: product.sale_price > 0 ? product.price * ((100 - product.sale_price) / 100) : product.price,
      },
      buy_count: quantity,
      price: product.sale_price > 0 ? product.price * ((100 - product.sale_price) / 100) : product.price,
      checked: false,
      disabled: false,
      price_before_discount: product.sale_price > 0 ? product.price : 0,
      id: product.id,
      createdAt: "",
      status: "WAITING",
      updatedAt: "",
    };

    navigate("/checkout", { state: [data] });
  };
  const ReviewComponent = () => {
    const getRandomReviews = (array: Review[], count: number) => {
      const shuffled = array.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };
    const randomReviews = getRandomReviews(reviews, 5);

    return (
      <div>
        {randomReviews.map((item) => (
          <div
            key={item.id}
            className="mb-4 rounded-lg bg-white p-4 shadow-md"
          >
            <div className="flex items-center">
              <img
                className="h-16 w-16 rounded-full"
                src={item.avatar}
                alt="User Avatar"
              />
              <div className="ml-4 text-xl">
                <div className="mb-1 font-bold">{item.username}</div>
                <div className="text-gray-600">{`${item.date} `}</div>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xl text-red-500">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </span>
            </div>
            <p className="mt-2 text-xl">{item.comment}</p>
          </div>
        ))}
      </div>
    );
  };

  const [currentImage, setCurrentImage] = useState(product && product?.image ? product?.image : "");

  const handleImageClick = (image: string) => {
    setCurrentImage(image);
  };

  return (
    <div className=" bg-gray-200   py-6 ">
      {loadingAddCart && <LoadingSmall />}
      <div className="bg-white p-1 shadow lg:p-10">
        <div className="container">
          <div className="lg:grid lg:grid-cols-12 lg:gap-4">
            <div className="block lg:col-span-5">
              <Swiper
                spaceBetween={10}
                grabCursor={true}
                preventInteractionOnTransition={true}
                className="transition-all duration-200 hover:shadow-bottom-spread active:pointer-events-none"
              >
                <SwiperSlide key={currentImage}>
                  <div
                    className="relative w-full overflow-hidden pt-[100%]"
                    onMouseMove={handleZoom}
                    onMouseLeave={handleRemoveZoom}
                  >
                    <img
                      src={currentImage || product?.image}
                      alt={product?.name}
                      onMouseMove={handleZoom}
                      onMouseLeave={handleRemoveZoom}
                      onMouseEnter={handleEnterZoomMode}
                      aria-hidden={true}
                      className="absolute left-0 top-0 h-full w-full cursor-zoom-in bg-white object-cover"
                    />
                  </div>
                </SwiperSlide>
              </Swiper>
              <Swiper
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
              >
                {product?.detailImage.map((image, index) => (
                  <SwiperSlide key={index}>
                    <button
                      className="relative w-full pt-[100%]"
                      onClick={() => handleImageClick(image)}
                    >
                      <img
                        src={image}
                        alt={product?.name}
                        className="absolute left-0 top-0 h-full w-full cursor-pointer bg-white object-cover"
                      />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="mt-8 block p-8 lg:col-span-7 lg:mt-5 lg:p-0">
              <h1 className="text-[18px] font-medium uppercase lg:text-[20px]">{product?.name}</h1>
              <div className="mt-4 flex items-center">
                <div className="flex items-center">
                  <span className="mr-1 border-b text-[14px] font-medium text-[rgb(238,77,45)] lg:text-[16px]">
                    {product?.product_feeback.star} Sao
                  </span>
                </div>
                <div className="mx-4 h-6 w-[2px] bg-gray-300"></div>
                <div>
                  <span className="text-[16px] font-medium">54</span>
                  <span className="ml-1 text-[14px] font-medium text-gray-500"> Đánh giá</span>
                </div>
                <div className="mx-4 h-6 w-[2px] bg-gray-300"></div>
                <div>
                  <span className="text-[16px] font-medium">{product?.product_feeback.sold}</span>
                  <span className="ml-1 text-[14px] font-medium text-gray-500">Đã bán</span>
                </div>
              </div>
              <div className="mt-4 flex items-center bg-gray-50 p-5">
                <div className="text-[24px] font-medium text-[rgb(238,77,45)] lg:text-[32px]">
                  {formatCurrency(
                    (product?.sale_price as number) > 0
                      ? (product?.price as number) * ((100 - (product?.sale_price as number)) / 100)
                      : (product?.price as number),
                  )}
                </div>
                <div className="ml-4">
                  <span className="text-[13px] font-medium text-gray-500 line-through lg:text-[14px]">
                    {formatCurrency(product?.price || 0)}đ
                  </span>
                </div>
              </div>
              <div className="mt-4 hidden lg:block">
                <div className="mt-6 flex items-center ">
                  <div className="mr-5 max-w-[120px] text-[14px] capitalize text-gray-500 lg:text-[15px]">
                    Chính Sách Trả Hàng
                  </div>

                  <div className="mt-0 flex items-center ">
                    <div className="ml-4 flex gap-2 text-[14px] text-gray-500 lg:text-[15px]">
                      <img
                        src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/b69402e4275f823f7d47.svg"
                        alt=""
                        width={20}
                      />
                      Trả hàng 15 ngày
                    </div>
                    <div className="ml-4 flex gap-2 text-[13px] text-gray-400 lg:text-[14px]">
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
                  <div className="mr-5 max-w-[120px] text-[14px] capitalize text-gray-500 lg:text-[15px]">
                    Vận Chuyển
                  </div>
                  <div className="mt-0 flex items-center ">
                    <div className="ml-4 flex gap-2 text-[14px] text-gray-500 lg:text-[15px]">
                      <img
                        src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/d9e992985b18d96aab90.png"
                        alt=""
                        width={20}
                      />
                      Miễn phí vận chuyển
                    </div>
                  </div>
                </div>
                {/* <div className="flex items-center mt-6 ">
                <div className="mr-5 max-w-[120px] text-[15px] capitalize text-gray-500">Màu Sắc</div>
                <div className="flex items-center mt-0 ">
                  <div className="ml-4 flex gap-2 text-[15px] text-gray-500">
                    <div className="flex gap-3">
                      <p className="border-[2px] border-[#adadad] p-2 text-black">Đen</p>
                      <p className="border-[2px] border-[#adadad] p-2 text-black">Trắng</p>
                    </div>
                  </div>
                </div>
              </div> */}
                <div className="mt-6 flex items-center ">
                  <div className="mr-5 text-[14px] capitalize text-gray-500 lg:text-[15px]">Số lượng</div>
                  <div className="text-2xl lg:text-3xl">
                    <div className=" ml-2 mr-8 flex lg:ml-16  lg:mr-[180px]  ">
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
                  <div className="ml-0 text-[14px] text-gray-500 lg:text-[15px]">
                    {/* {product?.sale_price} sản phẩm có sẵn */}
                    13 sản phẩm có sẵn
                  </div>
                </div>
              </div>
              <div className="mt-10  sm:flex sm:items-center sm:gap-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex h-[40px] w-full  items-center justify-center rounded-sm border border-[rgb(238,77,45)] bg-[rgb(252,222,216)] px-5 capitalize text-[rgb(238,77,45)] shadow-sm hover:bg-[rgb(255,160,142)] sm:w-auto"
                >
                  <FaCartArrowDown className="mr-4 text-xl" />
                  <p className="text-[14px] lg:text-[16px]">Thêm vào giỏ hàng</p>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="mt-5 flex h-[40px] w-full min-w-[5rem] items-center justify-center rounded-sm bg-[rgb(238,77,45)] px-5 capitalize text-white shadow-sm outline-none hover:bg-[rgb(255,117,89)] sm:mt-0 sm:w-auto"
                >
                  <p className="text-[14px] lg:text-[16px]">Mua ngay</p>
                </button>
              </div>
            </div>
            <div className="mt-[-10px] flex flex-col gap-y-3 p-0 lg:col-span-12 lg:mt-6 lg:flex-row lg:gap-0 lg:bg-gray-100">
              <div className="mr-16 flex items-center">
                <img
                  src="https://down-vn.img.susercontent.com/file/vn-11134216-7r98o-lsuyr1h6x1nd7b_tn"
                  alt="Shop Logo"
                  className="h-36 w-36 rounded-full"
                />
                <div className="ml-4 ">
                  <div className="text-xl font-bold">The Garden Official</div>
                  <div className="mb-4 text-xl text-gray-500">Online 5 Phút Trước</div>
                  <div className="ml-auto flex items-center gap-4">
                    <button className="rounded bg-red-500 px-6 py-3 text-white hover:bg-red-600">Chat Ngay</button>
                    <button className="hover: rounded  bg-gray-200 px-6 py-3">Xem Shop</button>
                  </div>
                </div>
              </div>
              <div className="text-medium ml-10 mt-1 grid w-[230px] grid-cols-1 gap-x-10  gap-y-4 text-[13px] text-[#999999] lg:mt-4 lg:w-full lg:grid-cols-3 lg:grid-rows-2 lg:gap-y-0 lg:text-xl ">
                <div className="flex justify-between">
                  Đánh Giá <span className=" ml-10 text-[#D2295C]  ">13k</span>
                </div>
                <div className="flex justify-between">
                  Tỉ lệ phản hồi <span className=" ml-10  text-[#D2295C] ">99%</span>
                </div>
                <div className=" hidden justify-between lg:flex  ">
                  Tham Gia <span className=" ml-4 text-[#D2295C] ">6 tháng trước</span>
                </div>
                <div className="flex justify-between">
                  Sản Phẩm <span className="ml-10 text-[#D2295C] ">15</span>
                </div>
                <div className="hidden justify-between lg:flex">
                  Thời gian phản hồi <span className="ml-10 text-right text-[#D2295C] ">trong vài giờ</span>
                </div>
                <div className="hidden justify-between lg:flex">
                  Người theo dõi <span className="ml-10 text-[#D2295C] ">12,3k</span>
                </div>
              </div>
            </div>
            <div className="col-span-12 mt-4 ">
              <div className="p-3 lg:bg-gray-100">
                <h2 className="mb-0 text-2xl font-semibold">Mô tả sản phẩm</h2>
                <div
                  className="mb-2 text-2xl"
                  dangerouslySetInnerHTML={{ __html: product?.description || "" }}
                ></div>
              </div>
            </div>

            <div className="col-span-12 mt-4">
              <div className="p-1 lg:bg-gray-100">
                <div className="flex-coljustify-between mb-8 flex gap-6 lg:flex-row lg:gap-20">
                  <div className="w-[445px] lg:w-[300px]">
                    <h2 className="mb-2 text-2xl font-semibold">Đánh giá sản phẩm</h2>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold text-red-500">4.7 trên 5</span>
                    </div>
                    <div className="mt-2 flex items-center">
                      <span className="text-2xl text-red-500">★ ★ ★ ★ ★</span>
                    </div>
                  </div>
                  <div className="mt-0 hidden lg:block">
                    <button className="mb-4 mr-4 bg-gray-200 px-6 py-4 text-xl">Tất Cả</button>
                    <button className="mb-4 mr-4 bg-gray-200 px-6 py-4 text-xl">5 Sao (94)</button>
                    <button className="mb-4 mr-4 bg-gray-200 px-6 py-4 text-xl">4 Sao (0)</button>
                    <button className="mb-4 mr-4 bg-gray-200 px-6 py-4 text-xl">3 Sao (1)</button>
                    <button className="mb-4 mr-4 bg-gray-200 px-6 py-4 text-xl">2 Sao (0)</button>
                    <button className="mb-4 mr-4 bg-gray-200 px-6 py-4 text-xl">1 Sao (0)</button>
                    <button className="mb-4 mr-4 bg-gray-200 px-6 py-4 text-xl">Có Bình Luận (63)</button>
                    <button className="mb-4 mr-4 bg-gray-200 px-6 py-4 text-xl">Có Hình Ảnh / Video (25)</button>
                  </div>
                </div>
                <ReviewComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className="mt-2 w-full bg-gray-100 px-1 pt-4 text-3xl uppercase">Gợi ý cho bạn</h1>

        <ProductList />
      </div>
    </div>
  );
};

export default ProductDetails;
