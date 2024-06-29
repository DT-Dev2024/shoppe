import { Swiper, SwiperSlide } from "swiper/react";
import "./ProductDetails.css";
// import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { FaCartArrowDown, FaMinus, FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import productApi from "src/apis/product.api";
import { TProduct } from "src/types/product.type";
import { formatCurrency } from "src/utils/formatNumber";
import purchaseAPI, { AddCart } from "src/apis/purchase.api";
import { TUser } from "src/types/user.types";
import { TExtendedPurchases } from "src/types/purchase.type";
import reviews from "./DataReview.js"
const ProductDetails = () => {
  const [currentImageState, setCurrentImageState] = useState<HTMLImageElement | null>(null);
  const [product, setProduct] = useState<TProduct>();
  const { id } = useParams();
  const [user, setUser] = useState<TUser>();
  console.log(reviews);
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
 const ReviewComponent = () => {
  const getRandomReviews = (array, count) => {
  const shuffled = array.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
  const randomReviews = getRandomReviews(reviews, 5);

  return (
    <div>
      {randomReviews.map((item) => (
        <div key={item.id} className="p-4 mb-4 bg-white rounded-lg shadow-md">
          <div className="flex items-center">
            <img
              className="w-16 h-16 rounded-full"
              src={item.avatar}
              alt="User Avatar"
            />
            <div className="ml-4 text-xl">
              <div className="mb-1 font-bold">{item.username}</div>
              <div className="text-gray-600">{`${item.date} `}</div>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xl text-red-500">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</span>
          </div>
          <p className="mt-2 text-xl">{item.comment}</p>
        </div>
      ))}
    </div>
  );
};



  return (
    <div className="py-6 pt-12   bg-gray-200 mt-[11rem]">
      <div className="p-10 bg-white shadow">
        <div className="container">
          <div className="lg:grid lg:grid-cols-12 lg:gap-4">

            <div className="block lg:col-span-5">
              <Swiper
                // thumbs={{ swiper: thumbSwiper && !thumbSwiper.destroyed ? thumbSwiper : null }}
                spaceBetween={10}
                grabCursor={true}
                preventInteractionOnTransition={true}
                // modules={[Thumbs]}
                className="transition-all duration-200 hover:shadow-bottom-spread active:pointer-events-none"
              >
                <SwiperSlide>
                  <div
                    className="relative w-full overflow-hidden pt-[100%]"
                    onMouseMove={handleZoom}
                    onMouseLeave={handleRemoveZoom}
                  >
                    <img
                      src={product?.image}
                      alt={product?.name}
                      onMouseEnter={handleEnterZoomMode}
                      aria-hidden={true}
                      className="absolute top-0 left-0 object-cover w-full h-full bg-white cursor-zoom-in"
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
                <SwiperSlide>
                  <div className="relative w-full pt-[100%]">
                    <img
                      src="https://api-ecom.duthanhduoc.com/images/bbea6d3e-e5b1-494f-ab16-02eece816d50.jpg"
                      alt="details điện thoại di động"
                      className="absolute top-0 left-0 object-cover w-full h-full bg-white cursor-pointer"
                    />
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
            <div className="block mt-5 lg:col-span-7">
              <h1 className="text-[24px] font-medium uppercase">{product?.name}</h1>
              <div className="flex items-center mt-4">
                <div className="flex items-center">
                  <span className="mr-1 border-b text-[16px] font-medium text-[rgb(238,77,45)]">
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
              <div className="flex items-center p-5 mt-4 bg-gray-50">
                <div className="text-[32px] font-medium text-[rgb(238,77,45)]">
                  {formatCurrency(
                    product?.sale_price > 0
                      ? product?.product_types[0].price * ((100 - product?.sale_price) / 100)
                      : product?.product_types[0].price,
                  )}

                </div>
                <div className="ml-4">
                  <span className="text-[14px] font-medium text-gray-500 line-through">
                     {formatCurrency(product?.product_types[0].price || 0)}đ
                  </span>
                </div>
              </div>
              <div className="mt-4">

                <div className="flex items-center mt-6 ">
                <div className="mr-5 max-w-[120px] text-[15px] capitalize text-gray-500">Chính Sách Trả Hàng</div>

                <div className="flex items-center mt-0 ">
                  <div className="ml-4 flex gap-2 text-[15px] text-gray-500">
                    <img
                      src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/b69402e4275f823f7d47.svg"
                      alt=""
                      width={20}
                    />
                    Trả hàng 15 ngày
                  </div>
                  <div className="ml-4 flex gap-2 text-[14px] text-gray-400">
                    Đổi ý miễn phí
                    <img
                      src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/be6f27f93268c0f88ded.svg"
                      alt=""
                      width={14}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-6 ">
                <div className="mr-5 max-w-[120px] text-[15px] capitalize text-gray-500">Vận Chuyển</div>
                <div className="flex items-center mt-0 ">
                  <div className="ml-4 flex gap-2 text-[15px] text-gray-500">
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
              <div className="flex items-center mt-6 ">
                <div className="mr-5 text-[15px] capitalize text-gray-500">Số lượng</div>
                <div className="text-3xl">
                  <div className=" ml-16 flex lg:ml-0  lg:mr-[180px]  ">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-1 border border-gray-300 rounded shrink-0"
                      onClick={() => {
                        setQuantity((prevQuantity) => prevQuantity - 1);
                      }}
                    >
                      <FaMinus />
                    </button>
                    <span className="w-10 mx-1 font-medium text-center text-gray-900 bg-transparent border shrink-0 focus:outline-none focus:ring-0">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-1 border border-gray-300 rounded shrink-0"
                      onClick={() => {
                        setQuantity((prevQuantity) => prevQuantity + 1);
                      }}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                {/* <p className="text-2xl font-medium">20</p> */}
                <div className="ml-0 text-[15px] text-gray-500">
                  {/* {product?.sale_price} sản phẩm có sẵn */}
                  13 sản phẩm có sẵn
                </div>
              </div>
              </div>
              <div className="mt-10 sm:flex sm:items-center sm:gap-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex h-[40px] w-full items-center justify-center rounded-sm border border-[rgb(238,77,45)] bg-[rgb(252,222,216)] px-5 capitalize text-[rgb(238,77,45)] shadow-sm hover:bg-[rgb(255,160,142)] sm:w-auto"
                >
                  <FaCartArrowDown className="mr-4 text-xl" />
                  <p className="text-[16px]">Thêm vào giỏ hàng</p>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="mt-5 flex h-[40px] w-full min-w-[5rem] items-center justify-center rounded-sm bg-[rgb(238,77,45)] px-5 capitalize text-white shadow-sm outline-none hover:bg-[rgb(255,117,89)] sm:mt-0 sm:w-auto"
                >
                  <p className="text-[16px]">Mua ngay</p>
                </button>
              </div>
            </div>
             <div className="flex p-6 mt-6 bg-gray-100 lg:col-span-12">
              <div className="flex items-center mr-16">
                <img src="https://down-vn.img.susercontent.com/file/vn-11134216-7r98o-lsuyr1h6x1nd7b_tn" alt="Shop Logo" className="rounded-full w-36 h-36" />
                <div className="ml-4 ">
                  <div className="text-xl font-bold">The Garden Official</div>
                  <div className="mb-4 text-xl text-gray-500">Online 5 Phút Trước</div>
                   <div className="flex items-center gap-4 ml-auto">
                  <button className="px-6 py-3 text-white bg-red-500 rounded hover:bg-red-600">Chat Ngay</button>
                  <button className="px-6 py-3 bg-gray-100 bg-gray-200 rounded hover:">Xem Shop</button>
                </div>
                </div>

              </div>
              <div className="grid grid-cols-3 grid-rows-2 gap-x-2 mt-4 ml-10 text-medium lg:text-xl text-[#999999] ">
                <div>
                  Đánh Giá <span className=" ml-10 text-[#D2295C]  ">13k</span>
                </div>
                <div>
                  Tỉ lệ phản hồi <span className=" ml-10  text-[#D2295C] ">99%</span>
                </div>
                <div>
                  Tham Gia <span className=" ml-4 text-[#D2295C] ">6 tháng trước</span>
                </div>
                <div>
                   Sản Phẩm <span className="ml-10 text-[#D2295C] ">15</span>
                </div>
                 <div>
                   Thời gian phản hồi <span className="ml-10 text-[#D2295C] ">trong vài giờ</span>
                </div>
                <div>
                  Người theo dõi <span className="ml-10 text-[#D2295C] ">12,3k</span>
                </div>

              </div>
            </div>
            <div className="col-span-12 mt-4 ">
              <div className="p-4 bg-gray-100">
                <h2 className="mb-0 text-2xl font-semibold">Mô tả sản phẩm</h2>
                <p className="mb-2 text-2xl ">{product?.description}</p>
              </div>
            </div>
            <div className="col-span-12 mt-4">
              <div className="p-4 bg-gray-100">
                <h2 className="mb-2 text-2xl font-semibold">Thông số kỹ thuật</h2>
                {/* <p>{product?.specifications}</p> */}
                <p className="mb-2 text-2xl ">ssss</p>

              </div>
            </div>
            <div className="col-span-12 mt-4">
              <div className="p-4 bg-gray-100">
                 <h2 className="mb-2 text-2xl font-semibold">Hướng dẫn sử dụng</h2>
                {/* <p>{product?.usage_instructions}</p> */}
                <p className="mb-2 text-2xl ">sss</p>

              </div>
            </div>
            <div className="col-span-12 mt-4">
              <div className="p-4 bg-gray-100">
                <h2 className="mb-2 text-2xl font-semibold">Bảo hành</h2>
               <p className="mb-2 text-2xl ">sss</p>

              </div>
            </div>
            <div className="col-span-12 mt-4">
    <div className="p-4 bg-gray-100">
        <div className="flex justify-between gap-20">
         <div className="w-[300px]">
           <h2 className="mb-2 text-2xl font-semibold">Đánh giá sản phẩm</h2>
        <div className="flex items-center">
            <span className="text-3xl font-bold text-red-500">5.0 trên 5</span>
        </div>
        <div className="flex items-center mt-2">
            <span className="text-2xl text-red-500">★ ★ ★ ★ ★</span>
        </div>
         </div>
        <div className="mt-0">
             <button className="px-6 py-4 mb-4 mr-4 text-xl bg-gray-200">Tất Cả</button>
            <button className="px-6 py-4 mb-4 mr-4 text-xl bg-gray-200">5 Sao (94)</button>
            <button className="px-6 py-4 mb-4 mr-4 text-xl bg-gray-200">4 Sao (0)</button>
            <button className="px-6 py-4 mb-4 mr-4 text-xl bg-gray-200">3 Sao (1)</button>
            <button className="px-6 py-4 mb-4 mr-4 text-xl bg-gray-200">2 Sao (0)</button>
            <button className="px-6 py-4 mb-4 mr-4 text-xl bg-gray-200">1 Sao (0)</button>
             <button className="px-6 py-4 mb-4 mr-4 text-xl bg-gray-200">Có Bình Luận (63)</button>
            <button className="px-6 py-4 mb-4 mr-4 text-xl bg-gray-200">Có Hình Ảnh / Video (25)</button>
        </div>

        </div>
       <ReviewComponent></ReviewComponent>

    </div>
</div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
