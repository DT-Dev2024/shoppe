import { Swiper, SwiperSlide } from "swiper/react";
import "./ProductDetails.css";
// import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { FaCartArrowDown } from "react-icons/fa";
import QuantityController from "./QuantityControllerProps/QuantityControllerProps";

const ProductDetails = () => {
  const [currentImageState, setCurrentImageState] = useState<HTMLImageElement | null>(null);

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

  return (
    <div className="mt-40 bg-gray-200 py-6">
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
              <h1 className="text-[24px] font-medium uppercase">Điện thoại di động thông minh mới nhất</h1>
              <div className="mt-4 flex items-center">
                <div className="flex items-center">
                  {/* <span className="mr-1 border-b border-b-primary text-primary">{product.rating}</span> */}
                  <span className="mr-1 border-b text-[16px] font-medium text-[rgb(238,77,45)]">5 Sao</span>
                  {/* <ProductRating
                    rating={product.rating}
                    activeClassName="fill-primary text-primary h-4 w-4"
                    nonActiveClassName="fill-gray-300 text-gray-300 h-4 w-4"
                  /> */}
                </div>
                <div className="mx-4 h-6 w-[2px] bg-gray-300"></div>
                <div>
                  <span className="text-[16px] font-medium">{Math.floor(Math.random() * 10) + 1}</span>
                  <span className="ml-1 text-[14px] font-medium text-gray-500"> Đánh giá</span>
                </div>
                <div className="mx-4 h-6 w-[2px] bg-gray-300"></div>
                <div>
                  {/* <span>{formatNumberToSocialStyle(product.sold)}</span> */}
                  <span className="text-[16px] font-medium">{Math.floor(Math.random() * 10) + 1}</span>
                  <span className="ml-1 text-[14px] font-medium text-gray-500">Đã bán</span>
                </div>
              </div>
              <div className="mb-2 mt-4 flex items-center gap-x-6 bg-gray-50 px-5 py-2">
                <div className="text-[18px] text-gray-500 line-through">
                  {/* ₫{formatCurrency(product.price_before_discount)}
                   */}
                  150.000đ
                </div>
                <div className="text-xl font-light text-[rgb(238,77,45)] sm:text-xl">
                  {/* ₫{formatCurrency(product.price)} */}
                  200.000đ
                </div>
                <div className="rounded-sm bg-[rgb(238,77,45)] px-1 py-1 text-[14px] font-semibold uppercase text-white">
                  {/* {calculateSalePercent(
                    product.price_before_discount,
                    product.price
                  )}{" "} */}
                  giảm 30%
                </div>
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
                  <QuantityController />
                </div>
                {/* <p className="text-2xl font-medium">20</p> */}
                <div className="ml-6 text-[15px] text-gray-500">
                  {/* {product.quantity} sản phẩm có sẵn */}
                  {Math.floor(Math.random() * 1000) + 1} sản phẩm có sẵn
                </div>
              </div>
              <div className="mt-6 sm:flex sm:items-center sm:gap-x-4">
                <button
                  // onClick={handleAddToCart}
                  className="flex h-[60px] w-full items-center justify-center rounded-sm border border-[rgb(238,77,45)] bg-[rgb(252,222,216)] px-5 capitalize text-[rgb(238,77,45)] shadow-sm hover:bg-[rgb(255,160,142)] sm:w-auto"
                >
                  <FaCartArrowDown className="mr-4 text-xl" />
                  <p className="text-[16px]">Thêm vào giỏ hàng</p>
                </button>
                <button
                  // onClick={handleBuyNow}
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
