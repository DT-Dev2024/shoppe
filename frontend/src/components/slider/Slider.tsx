import "./Slider.css";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
const Slider = () => {
  const dataSlider = [
    {
      id: 1,
      aSrc: "https://shopee.vn/m/VoucherXtra",
      src: "https://cf.shopee.vn/file/vn-50009109-f6c34d719c3e4d33857371458e7a7059_xhdpi",
      desc: "Voucher Giảm Đến 1 Triệu",
    },
    {
      id: 2,
      aSrc: "https://shopee.vn/m/mien-phi-van-chuyen",
      src: "https://cf.shopee.vn/file/vn-50009109-c7a2e1ae720f9704f92f72c9ef1a494a_xhdpi",
      desc: "Miễn Phí Ship - Có Shopee",
    },
    {
      id: 3,
      aSrc: "https://shopee.vn/m/ma-giam-gia",
      src: "https://cf.shopee.vn/file/vn-50009109-8a387d78a7ad954ec489d3ef9abd60b4_xhdpi",
      desc: "Mã Giảm Giá",
    },
    {
      id: 4,
      aSrc: "https://shopee.vn/m/shopee-sieu-re",
      src: "https://cf.shopee.vn/file/vn-50009109-91399a1d3ed283d272b069fac5ca989c_xhdpi",
      desc: "Shopee Siêu Rẻ",
    },
    {
      id: 5,
      aSrc: "https://shopee.vn/m/shopee-style",
      src: "https://cf.shopee.vn/file/vn-50009109-c02353c969d19918c53deaa4ea15bdbe_xhdpi",
      desc: "Shoppe Style Voucher 40%",
    },
    {
      id: 6,
      aSrc: "https://shopee.vn/m/sieu-hoi-shop-dinh-Jun-PEAK",
      src: "https://cf.shopee.vn/file/vn-50009109-29961f92098bc9153b88332110a91c87_xhdpi",
      desc: "Quốc Tế Siêu Trợ Giá",
    },
    {
      id: 7,
      aSrc: "https://shopee.vn/digital-product/shop/others",
      src: "https://cf.shopee.vn/file/9df57ba80ca225e67c08a8a0d8cc7b85_xhdpi",
      desc: "Nạp Thẻ, Dịch Vụ & VinWonders",
    },
  ];
  return (
    <div className="slider">
      <div className="slider__part">
        <div className="slider__main">
          <div className="slider__main__motion-part">
            <a
              href="https://shopee.vn/m/freeship-xtra"
              className="slider__main__motion-part__link"
            >
              <img
                src="https://cf.shopee.vn/file/vn-11134258-7r98o-lwi96dv2zxll3d_xxhdpi"
                className="slider__main__motion-part__img slider__main__motion-part__curent-img"
                alt=""
              />
            </a>
            <button className="slider__main__motion-part__btn slider__main__motion-part__previous-btn">
              <FaArrowCircleLeft className="slider__main__motion-part-icon" />
            </button>
            <button
              // ref={nextButtonRef}
              // onClick={handleClickNextButton}
              className="slider__main__motion-part__btn slider__main__motion-part__next-btn"
            >
              <FaArrowCircleRight className="slider__main__motion-part-icon" />
            </button>

            <div className="slider__main__motion-part__queue">
              {/* {motionPartLinkInfo && renderQueueItems(motionPartLinkInfo)} */}
            </div>
          </div>

          <div className="slider__main__no-motion-part">
            <div>
              <a
                href="https://shopee.vn/m/shopeefarm"
                className="slider__main__no-motion-part__link"
              >
                <img
                  src="https://cf.shopee.vn/file/vn-11134258-7r98o-lwjgjizjf463c2_xxhdpihttps://cf.shopee.vn/file/vn-11134258-7r98o-lwi8ylw6ql09b5_xhdpi"
                  className="slider__main__no-motion-part__img"
                  alt=""
                />
              </a>
            </div>
            <div>
              <a
                href="https://shopee.vn/m/uu-dai-vietcombank"
                className="slider__main__no-motion-part__link"
              >
                <img
                  src="https://cf.shopee.vn/file/vn-11134258-7r98o-lwi8ywedacihff_xhdpi"
                  className="slider__main__no-motion-part__img"
                  alt=""
                />
              </a>
            </div>
          </div>
        </div>

        <div className="slider__favourite-selections">
          {/* {favouriteSelectionsInfo &&
            renderFavouriteSelections(favouriteSelectionsInfo)} */}
          {/* <a
            href="https://shopee.vn/m/shopeesogiday"
            className="slider__favourite-selections__link"
          >
            <img
              className="slider__favourite-selections__link-img"
              src="https://cf.shopee.vn/file/vn-50009109-f6c34d719c3e4d33857371458e7a7059_xhdpi"
              alt=""
            />
            <h4 className="slider__favourite-selections__link-text">
              Voucher giảm đến 1 triệu
            </h4>
          </a> */}
          {dataSlider.map((item) => (
            <div key={item.id}>
              <a
                href={item.aSrc}
                className="slider__favourite-selections__link"
              >
                <img
                  className="slider__favourite-selections__link-img"
                  src={item.src}
                  alt=""
                />
                <h4 className="slider__favourite-selections__link-text">
                  {item.desc}
                </h4>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
