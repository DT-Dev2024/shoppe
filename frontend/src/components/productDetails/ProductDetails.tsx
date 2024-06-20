import { Swiper, SwiperSlide } from "swiper/react";
import "./ProductDetails.css";
// import { Helmet } from "react-helmet-async";
import { useState } from "react";
import QuantityController from "./QuantityControllerProps/QuantityControllerProps";
import { FaCartArrowDown } from "react-icons/fa";

const ProductDetails = () => {
  const [currentImageState, setCurrentImageState] =
    useState<HTMLImageElement | null>(null);

  const handleEnterZoomMode = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
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
    <div className="py-6 bg-gray-200">
      <div className="p-4 bg-white shadow">
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
                      className="absolute top-0 left-0 object-cover w-full h-full bg-white cursor-zoom-in"
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
                      className="absolute top-0 left-0 object-cover w-full h-full bg-white cursor-pointer"
                    />
                  </div>
                </SwiperSlide>
                {/* );
                })} */}
              </Swiper>
            </div>
            <div className="block mt-5 lg:col-span-7">
              {/* <h1 className="text-xl font-medium uppercase">{product.name}</h1> */}
              <h1 className="text-5xl font-medium uppercase">
                Điện thoại di động thông minh mới nhất
              </h1>
              <div className="flex items-center mt-8">
                <div className="flex items-center">
                  {/* <span className="mr-1 border-b border-b-primary text-primary">{product.rating}</span> */}
                  <span className="mr-1 text-3xl font-medium border-b text-[rgb(238,77,45)]">
                    5 Sao
                  </span>
                  {/* <ProductRating
                    rating={product.rating}
                    activeClassName="fill-primary text-primary h-4 w-4"
                    nonActiveClassName="fill-gray-300 text-gray-300 h-4 w-4"
                  /> */}
                </div>
                <div className="mx-4 h-6 w-[2px] bg-gray-300"></div>
                <div>
                  {/* <span>{formatNumberToSocialStyle(product.sold)}</span> */}
                  <span className="text-3xl font-medium">20 </span>
                  <span className="ml-1 text-2xl font-medium text-gray-500">
                    Đã bán
                  </span>
                </div>
              </div>
              <div className="flex items-center px-5 py-4 mt-4 mt-8 mb-4 gap-x-6 bg-gray-50">
                <div className="text-4xl text-gray-500 line-through">
                  {/* ₫{formatCurrency(product.price_before_discount)}
                   */}
                  150.000đ
                </div>
                <div className="text-[50px] font-medium font-light sm:text-5xl text-[rgb(238,77,45)]">
                  {/* ₫{formatCurrency(product.price)} */}
                  200.000đ
                </div>
                <div className="rounded-sm bg-[rgb(238,77,45)] px-3 py-[10px] text-xl font-semibold uppercase text-white">
                  {/* {calculateSalePercent(
                    product.price_before_discount,
                    product.price
                  )}{" "} */}
                  giảm 30%
                </div>
              </div>
              <div className="flex items-center mt-8 ">
                <div className="mr-5 text-3xl text-gray-500 capitalize">
                  Số lượng
                </div>
                <div className="text-3xl">
                  <QuantityController />
                </div>
                {/* <p className="text-2xl font-medium">20</p> */}
                <div className="ml-6 text-2xl text-gray-500">
                  {/* {product.quantity} sản phẩm có sẵn */}
                  50 sản phẩm có sẵn
                </div>
              </div>
              <div className="mt-16 sm:flex sm:items-center sm:gap-x-4">
                <button
                  // onClick={handleAddToCart}
                  className="flex items-center justify-center w-full h-[60px] px-5 capitalize border rounded-sm shadow-sm border-[rgb(238,77,45)] bg-[rgb(252,222,216)] text-[rgb(238,77,45)] hover:bg-[rgb(255,160,142)] sm:w-auto"
                >
                  <FaCartArrowDown className="mr-4 text-4xl" />
                  <p className="text-2xl">Thêm vào giỏ hàng</p>
                </button>
                <button
                  // onClick={handleBuyNow}
                  className="mt-5 flex h-[60px] w-full min-w-[5rem] items-center justify-center rounded-sm bg-[rgb(238,77,45)] px-5 capitalize text-white shadow-sm outline-none hover:bg-[rgb(255,117,89)] sm:mt-0 sm:w-auto"
                >
                  <p className="text-2xl">Mua ngay</p>
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
