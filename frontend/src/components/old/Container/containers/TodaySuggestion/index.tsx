import "./TodaySuggestion.css";
import {
  TodaySuggestionLeftSerratedIcon,
  TodaySuggestionRightSerratedIcon,
  TodaySuggestionHeadingLabelImage,
  TodaySuggestionMallLabelImage,
  TodaySuggestionYeuThichPlusLabelImage,
} from "src/assets/img";
import { useRef, useState, useEffect } from "react";
import useDataSourceContext from "src/hooks/hookHome/useDataSourceContext";
import { IDataSource } from "src/contexts";
interface IData {
  productLink: string;
  productImage: string;
  frameImage: string;
  name: string;
  saleOffText: string;
  price: string;
  selledQuantity: string;
  saleOffLabelPercent: string;
  sponsorLabel: string;
  favouriteLabel: string;
  href: string;
  image: string;
  title: string;
  text: string;
}

function TodaySuggestion() {
  const [scrollDistance, setScrollDistance] = useState(0);
  const todaySuggestionRef = useRef<HTMLDivElement>(null);
  const headingTabMainRef = useRef<HTMLButtonElement>(null);
  const headingTabSuperSaleRef = useRef<HTMLButtonElement>(null);
  const tabMainRef = useRef<HTMLDivElement>(null);
  const tabSuperSaleRef = useRef<HTMLDivElement>(null);
  const viewAllBtnRef = useRef<HTMLAnchorElement>(null);

  const { todaySuggestionMainTabMainInfo, todaySuggestionMainTabSuperSaleInfo } = useDataSourceContext() as IDataSource;

  const renderFavouriteLabel = (data: IData): JSX.Element | string => {
    let favouriteLabelActiveClass = "";
    let favouriteLabelInnerHTML: JSX.Element | string = "";
    const { favouriteLabel } = data;

    if (favouriteLabel) {
      switch (favouriteLabel) {
        case "Yêu thích": {
          favouriteLabelActiveClass = "today-suggestion__main-product__favourite-label--yeuthich";
          favouriteLabelInnerHTML = "Yêu thích";
          break;
        }
        case "Yêu thích+": {
          favouriteLabelActiveClass = "today-suggestion__main-product__favourite-label--yeuthichplus";
          favouriteLabelInnerHTML = (
            <img
              src={TodaySuggestionYeuThichPlusLabelImage}
              className="today-suggestion__main-product__favourite-label--yeuthichplus__img"
              alt=""
            />
          );
          break;
        }
        case "Mall": {
          favouriteLabelActiveClass = "today-suggestion__main-product__favourite-label--mall";
          favouriteLabelInnerHTML = (
            <img
              src={TodaySuggestionMallLabelImage}
              className="today-suggestion__main-product__favourite-label--mall__img"
              alt=""
            />
          );
          break;
        }
        default:
          break;
      }
    }

    return (
      <div className={"today-suggestion__main-product__favourite-label " + favouriteLabelActiveClass}>
        {favouriteLabelInnerHTML}
      </div>
    );
  };

  const renderTabMain = (tabMainInfo: IData[][]) =>
    tabMainInfo.map((data1, index1) => (
      <div
        key={index1}
        className="today-suggestion__main-list"
      >
        {data1.map((data2, index2) => {
          const {
            productLink,
            productImage,
            frameImage,
            name,
            saleOffText,
            price,
            selledQuantity,
            saleOffLabelPercent,
            sponsorLabel,
          } = data2;

          return (
            <div
              key={index2}
              className="today-suggestion__main-item"
            >
              <a
                key={index2}
                href={"/"}
                className="today-suggestion__main-product"
              >
                <div>
                  <img
                    src={productImage}
                    className="today-suggestion__main-product__product-img"
                    alt=""
                  />
                  {frameImage && (
                    <img
                      src={frameImage}
                      className="today-suggestion__main-product__frame-img"
                      alt=""
                    />
                  )}

                  <div className="today-suggestion__main-product__part">
                    <span className="today-suggestion__main-product__name">{name}</span>
                    {saleOffText && (
                      <div className="today-suggestion__main-product__sale-off">
                        <img
                          src={TodaySuggestionLeftSerratedIcon}
                          className="today-suggestion__main-product__sale-off__left-serrated"
                          alt=""
                        />
                        <span className="today-suggestion__main-product__sale-off__text">{saleOffText}</span>
                        <img
                          src={TodaySuggestionRightSerratedIcon}
                          className="today-suggestion__main-product__sale-off__right-serrated"
                          alt=""
                        />
                      </div>
                    )}
                    <div className="today-suggestion__main-product__price-and-selled-quantity">
                      <span className="today-suggestion__main-product__price">{price}</span>
                      <span className="today-suggestion__main-product__selled-quantity">{selledQuantity}</span>
                    </div>
                  </div>

                  {renderFavouriteLabel(data2)}
                  {saleOffLabelPercent && (
                    <div className="today-suggestion__main-product__sale-off-label">
                      <span className="today-suggestion__main-product__sale-off-label__percent">
                        {saleOffLabelPercent}
                      </span>
                      <span className="today-suggestion__main-product__sale-off-label__text">giảm</span>
                    </div>
                  )}
                  {sponsorLabel && <div className="today-suggestion__main-product__sponsor-label">Tài Trợ</div>}
                  <div className="today-suggestion__main-product__hover-label">Tìm sản phẩm tương tự</div>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    ));

  const renderTabSuperSale = (tabSuperSaleInfo: IData[][]) =>
    tabSuperSaleInfo.map((data1, index1) => (
      <div
        key={index1}
        className="today-suggestion__main-list"
      >
        {data1.map((data2, index2) => {
          const {
            productLink,
            productImage,
            frameImage,
            name,
            saleOffText,
            price,
            selledQuantity,
            saleOffLabelPercent,
            sponsorLabel,
          } = data2;

          return (
            <div
              key={index2}
              className="today-suggestion__main-item"
            >
              <a
                href={"/"}
                className="today-suggestion__main-product"
              >
                <div>
                  <img
                    src={productImage}
                    className="today-suggestion__main-product__product-img"
                    alt=""
                  />
                  {frameImage && (
                    <img
                      src={frameImage}
                      className="today-suggestion__main-product__frame-img"
                      alt=""
                    />
                  )}

                  <div className="today-suggestion__main-product__part">
                    <span className="today-suggestion__main-product__name">{name}</span>
                    {saleOffText && (
                      <div className="today-suggestion__main-product__sale-off">
                        <img
                          src={TodaySuggestionLeftSerratedIcon}
                          className="today-suggestion__main-product__sale-off__left-serrated"
                          alt=""
                        />
                        <span className="today-suggestion__main-product__sale-off__text">{saleOffText}</span>
                        <img
                          src={TodaySuggestionRightSerratedIcon}
                          className="today-suggestion__main-product__sale-off__right-serrated"
                          alt=""
                        />
                      </div>
                    )}
                    <div className="today-suggestion__main-product__price-and-selled-quantity">
                      <span className="today-suggestion__main-product__price">{price}</span>
                      <span className="today-suggestion__main-product__selled-quantity">{selledQuantity}</span>
                    </div>
                  </div>

                  {renderFavouriteLabel(data2)}
                  {saleOffLabelPercent && (
                    <div className="today-suggestion__main-product__sale-off-label">
                      <span className="today-suggestion__main-product__sale-off-label__percent">
                        {saleOffLabelPercent}
                      </span>
                      <span className="today-suggestion__main-product__sale-off-label__text">giảm</span>
                    </div>
                  )}
                  {sponsorLabel && <div className="today-suggestion__main-product__sponsor-label">Tài Trợ</div>}
                  <div className="today-suggestion__main-product__hover-label">Tìm sản phẩm tương tự</div>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    ));

  const toggleActiveHeadingTab = (activeTab: string): void => {
    switch (activeTab) {
      case "main": {
        headingTabSuperSaleRef.current?.classList.remove("today-suggestion__heading-tab--active");
        headingTabMainRef.current?.classList.add("today-suggestion__heading-tab--active");
        break;
      }
      case "supersale": {
        headingTabMainRef.current?.classList.remove("today-suggestion__heading-tab--active");
        headingTabSuperSaleRef.current?.classList.add("today-suggestion__heading-tab--active");
        break;
      }
      default:
        break;
    }
  };

  const handleClickHeadingTabMain = () => {
    toggleActiveHeadingTab("main");

    // config for this case
    if (todaySuggestionRef.current) {
      todaySuggestionRef.current.style.height = "263rem";
    }
    if (tabSuperSaleRef.current) {
      tabSuperSaleRef.current.style.display = "none";
    }
    if (tabMainRef.current) {
      tabMainRef.current.style.display = "block";
    }
    if (viewAllBtnRef.current) {
      viewAllBtnRef.current.href = "https://shopee.vn/daily_discover?pageNumber=2";
    }

    // scroll to this part
    window.scrollTo(0, scrollDistance);
  };

  const handleClickHeadingTabSuperSale = () => {
    toggleActiveHeadingTab("supersale");

    // config for this case
    if (todaySuggestionRef.current) {
      todaySuggestionRef.current.style.height = "324rem";
    }
    if (tabMainRef.current) tabMainRef.current.style.display = "none";
    if (tabSuperSaleRef.current) tabSuperSaleRef.current.style.display = "block";
    if (viewAllBtnRef.current) viewAllBtnRef.current.href = "https://shopee.vn/double_eleven_big_sale/2";

    // scroll to this part
    window.scrollTo(0, scrollDistance);
  };

  useEffect(() => {
    if (todaySuggestionRef.current) setScrollDistance(todaySuggestionRef.current.offsetTop - 120);
  }, []);

  return (
    <div
      ref={todaySuggestionRef}
      className="today-suggestion"
    >
      <div className="today-suggestion__heading">
        <button
          ref={headingTabMainRef}
          onClick={handleClickHeadingTabMain}
          className="today-suggestion__heading-tab-main today-suggestion__heading-tab--active"
        >
          <span>GỢI Ý HÔM NAY</span>
        </button>
        <button
          ref={headingTabSuperSaleRef}
          onClick={handleClickHeadingTabSuperSale}
          className="today-suggestion__heading-tab-super-sale"
        >
          <img
            src={TodaySuggestionHeadingLabelImage}
            alt=""
          />
        </button>
      </div>

      <div className="today-suggestion__main">
        <div
          ref={tabMainRef}
          className="today-suggestion__main__tab-main"
        >
          {todaySuggestionMainTabMainInfo && renderTabMain(todaySuggestionMainTabMainInfo)}
        </div>
        <div
          ref={tabSuperSaleRef}
          className="today-suggestion__main__tab-super-sale"
        >
          {todaySuggestionMainTabSuperSaleInfo && renderTabSuperSale(todaySuggestionMainTabSuperSaleInfo)}
        </div>
        <a
          ref={viewAllBtnRef}
          href="https://shopee.vn/daily_discover?pageNumber=2"
          className="today-suggestion__main__view-all-btn"
        >
          Xem thêm
        </a>
      </div>
    </div>
  );
}

export default TodaySuggestion;
