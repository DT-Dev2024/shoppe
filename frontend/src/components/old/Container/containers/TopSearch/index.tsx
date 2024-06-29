import { useRef } from "react";
import { TopSearchTopLabelIcon } from "src/assets/img";
import { IDataSource } from "src/contexts";
import useDataSourceContext from "src/hooks/hookHome/useDataSourceContext";
import "./TopSearch.css";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";
interface ITopSearch {
  href: string;
  productImage: string;
  price: string;
  text: string;
}

function TopSearch() {
  const mainListRef = useRef<HTMLDivElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  let listIndexCurrent = 1;
  const { topSearchMainListInfo: mainListInfo } = useDataSourceContext() as IDataSource;
  const renderTopSearchMainList = (datas: ITopSearch[]) => {
    if (datas) {
      return datas.map((data: ITopSearch, index: number) => {
        const { productImage, price, text } = data;

        return (
          <a
            key={index}
            href={"/productList"}
            className="top-search__main__link"
          >
            <div className="top-search__main__product">
              <img
                src={productImage}
                className="top-search__main__product__img"
                alt=""
              />
              <img
                src={TopSearchTopLabelIcon}
                className="top-search__main__product__top-label-img"
                alt=""
              />
              {index !== 0 && (
                <div className="top-search__main__product__statistic">
                  Bán <span className="top-search__main__product__statistic__price">{price}</span>
                  k+ / tháng
                </div>
              )}
            </div>
            <div className="top-search__main__footer">
              <span className="top-search__main__footer__text">{text}</span>
            </div>
          </a>
        );
      });
    }
  };

  const handleClickNextButton = () => {
    if (listIndexCurrent === 1) {
      listIndexCurrent = 2;
      if (nextButtonRef.current) {
        nextButtonRef.current.style.display = "flex";
        nextButtonRef.current.style.justifyContent = "center";
      }

      if (previousButtonRef.current) {
        previousButtonRef.current.style.display = "flex";
        previousButtonRef.current.style.justifyContent = "center";
      }

      if (mainListRef.current) {
        mainListRef.current.style.transform = "translate(-120rem, 0)";
        mainListRef.current.style.transition = "all 500ms ease 0s";
      }
    } else {
      if (listIndexCurrent === 2) {
        listIndexCurrent = 3;
        if (nextButtonRef.current) {
          nextButtonRef.current.style.display = "flex";
          nextButtonRef.current.style.justifyContent = "center";
        }
        if (previousButtonRef.current) {
          previousButtonRef.current.style.display = "flex";
          previousButtonRef.current.style.justifyContent = "center";
        }
        if (mainListRef.current) {
          mainListRef.current.style.transform = "translate(-240rem, 0)";
          mainListRef.current.style.transition = "all 500ms ease 0s";
        }
      } else {
        if (listIndexCurrent === 3) {
          listIndexCurrent = 4;
          if (nextButtonRef.current) {
            nextButtonRef.current.style.display = "none";
          }
          if (previousButtonRef.current) {
            previousButtonRef.current.style.display = "flex";
            previousButtonRef.current.style.justifyContent = "center";
          }
          if (mainListRef.current) {
            mainListRef.current.style.transform = "translate(-360rem, 0)";
            mainListRef.current.style.transition = "all 500ms ease 0s";
          }
        }
      }
    }
  };

  const handleClickPreviousButton = () => {
    if (listIndexCurrent === 2) {
      listIndexCurrent = 1;
      if (previousButtonRef.current) {
        previousButtonRef.current.style.display = "none";
      }
      if (nextButtonRef.current) {
        nextButtonRef.current.style.display = "flex";
        nextButtonRef.current.style.justifyContent = "center";
      }
      if (mainListRef.current) {
        mainListRef.current.style.transform = "translate(0, 0)";
        mainListRef.current.style.transition = "all 500ms ease 0s";
      }
    } else {
      if (listIndexCurrent === 3) {
        listIndexCurrent = 2;
        if (previousButtonRef.current) {
          previousButtonRef.current.style.display = "flex";
          previousButtonRef.current.style.justifyContent = "center";
        }
        if (nextButtonRef.current) {
          nextButtonRef.current.style.display = "flex";
          nextButtonRef.current.style.justifyContent = "center";
        }

        if (mainListRef.current) {
          mainListRef.current.style.transform = "translate(-120rem, 0)";
          mainListRef.current.style.transition = "all 500ms ease 0s";
        }
      } else {
        if (listIndexCurrent === 4) {
          listIndexCurrent = 3;
          if (previousButtonRef.current) {
            previousButtonRef.current.style.display = "flex";
            previousButtonRef.current.style.justifyContent = "center";
          }
          if (nextButtonRef.current) {
            nextButtonRef.current.style.display = "flex";
            nextButtonRef.current.style.justifyContent = "center";
          }

          if (mainListRef.current) {
            mainListRef.current.style.transform = "translate(-240rem, 0)";
            mainListRef.current.style.transition = "all 500ms ease 0s";
          }
        }
      }
    }
  };

  return (
    <div className="top-search">
      <div className="top-search__heading">
        <span className="top-search__heading__title">TÌM KIẾM HÀNG ĐẦU</span>
        <a
          href="https://shopee.vn/top_products?catId=VN_BITL0_625"
          className="top-search__heading__view-all-btn"
        >
          Xem tất cả
          <MdOutlineArrowForwardIos />
        </a>
      </div>

      <div className="top-search__main">
        <div className="top-search__main-part">
          <div
            ref={mainListRef}
            className="top-search__main__list"
          >
            {mainListInfo && renderTopSearchMainList(mainListInfo)}
          </div>
        </div>

        <button
          ref={previousButtonRef}
          onClick={handleClickPreviousButton}
          className="navigation-btn navigation-btn__previous top-search__main__previous-btn"
        >
          <MdOutlineArrowBackIos className="fas fa-chevron-right navigation-btn__icon" />
        </button>
        <button
          ref={nextButtonRef}
          onClick={handleClickNextButton}
          className="navigation-btn navigation-btn__next top-search__main__next-btn"
        >
          <MdOutlineArrowForwardIos className="fas fa-chevron-right navigation-btn__icon" />
        </button>
      </div>
    </div>
  );
}

export default TopSearch;
