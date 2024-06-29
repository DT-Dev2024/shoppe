import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { ShopeeMallHeadingLabelIcon, ShopeeMallMotionBanner1 } from "src/assets/img";
import { $$ } from "src/constants";
import { IDataSource } from "src/contexts";
import useDataSourceContext from "src/hooks/hookHome/useDataSourceContext";
import "./ShopeeMall.css";

import BACK from "src/assets/img/container/shopee-mall/heading/back.png";
import QUANTITY from "src/assets/img/container/shopee-mall/heading/quality.png";
import SHIPPING from "src/assets/img/container/shopee-mall/heading/shipping.png";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";

interface HeadingText {
  image: string;
  title: string;
}
interface MotionLink {
  href: string;
  image: string;
}
interface ProductList {
  id: number;
  href: string;
  image: string;
  price: number;
  text: string;
}

function ShopeeMall() {
  const [queueItems, setQueueItems] = useState<Element[]>([]);
  const mainProductListRef = useRef<HTMLUListElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const motionImageRef = useRef<HTMLImageElement>(null);
  const motionLinkRef = useRef<HTMLAnchorElement>(null);

  const {
    shopeeMallHeadingTextInfo: headingTextInfo,
    shopeeMallMainProductListInfo: productListInfo,
    shopeeMallMainMotionLinkInfo: motionLinkInfo,
  } = useDataSourceContext() as IDataSource;

  let currentListIndex = 1;
  let queueItemCurrentIndex = 0;
  const len = motionLinkInfo.length;
  const QUEUE_ITEM_CLASS = "shopee-mall__main__motion__queue-item";
  const QUEUE_ITEM_CURRENT_CLASS = "shopee-mall__main__motion__queue-item--current";

  const renderHeadingText = (datas: HeadingText[]) =>
    datas.map((data, index) => {
      const { image, title } = data;
      const icons = [BACK, QUANTITY, SHIPPING];
      const splitImage = image.split("/");
      const name = splitImage[splitImage.length - 1].split(".")[0];
      let img = "";
      if (name.toLowerCase() === "back") {
        img = BACK;
      } else if (name.toLowerCase() === "quantity") {
        img = QUANTITY;
      } else {
        img = SHIPPING;
      }
      return (
        <div key={index}>
          <img
            src={img}
            className="shopee-mall__heading__text__icon"
            alt=""
          />
          <span className="shopee-mall__heading__text__title">{title}</span>
        </div>
      );
    });

  const renderProductList = (datas: ProductList[][]) => {
    const shopeeMallMainProductListLength = datas.length;
    const shopeeMallMainProductListItemsLength = shopeeMallMainProductListLength * 2;

    return datas.map((data, index) => (
      <li
        key={index}
        className="shopee-mall__main__product-item"
      >
        {data.map((dataChild, index) => {
          const { id, href, image, text } = dataChild;

          // check special case: last li tag
          return id !== shopeeMallMainProductListItemsLength ? (
            <a
              key={index}
              href={"/productList"}
              className="shopee-mall__main__product-item__link"
            >
              <img
                src={image}
                className="shopee-mall__main__product-item__link__img"
                alt=""
              />
              <span className="shopee-mall__main__product-item__link__text">{text}</span>
            </a>
          ) : (
            <div
              key={index}
              className="shopee-mall__main__product-item__link__exception"
            >
              <a
                href="https://shopee.vn/mall"
                className="shopee-mall__heading__view-all-btn"
              >
                Xem tất cả
                <div>
                  <MdOutlineArrowForwardIos />
                </div>
              </a>
            </div>
          );
        })}
      </li>
    ));
  };

  const renderQueueItems = (datas: MotionLink[]) =>
    datas.map((data, index) => {
      return (
        // <div
        //   key={index}
        //   onClick={(event) => handleClickQueueItem(event)}
        //   onKeyDown={(event) => handleClickQueueItem(event)}
        //   className={`${QUEUE_ITEM_CLASS} ${index === 0 ? QUEUE_ITEM_CURRENT_CLASS : ""}`}
        // ></div>
        <div
          key={index}
          className={`${QUEUE_ITEM_CLASS} ${index === 0 ? QUEUE_ITEM_CURRENT_CLASS : ""}`}
        ></div>
      );
    });

  const updateMotionImageLinkProps = (index: number) => {
    if (motionLinkInfo.length > 0) {
      const { image, href } = motionLinkInfo[index];
      if (motionImageRef.current) {
        motionImageRef.current.src = image;
      }
      if (motionLinkRef.current) {
        motionLinkRef.current.href = href;
      }
    }
  };
  const handleClickNextButton = () => {
    // If first list
    if (currentListIndex === 1) {
      currentListIndex = 2;
      if (previousButtonRef.current) {
        previousButtonRef.current.style.display = "flex";
        previousButtonRef.current.style.justifyContent = "center";
      }
      if (nextButtonRef.current) {
        nextButtonRef.current.style.display = "flex";
        nextButtonRef.current.style.justifyContent = "center";
      }

      if (mainProductListRef.current) {
        mainProductListRef.current.style.transform = "translate(-80rem, 0)";
        mainProductListRef.current.style.transition = "all 500ms ease 0s";
      }
    } else {
      // If second list
      if (currentListIndex === 2) {
        currentListIndex = 3;
        if (previousButtonRef.current) {
          previousButtonRef.current.style.display = "flex";
          previousButtonRef.current.style.justifyContent = "center";
        }
        if (nextButtonRef.current) {
          nextButtonRef.current.style.display = "none";
        }

        if (mainProductListRef.current) {
          mainProductListRef.current.style.transform = "translate(-160rem, 0)";
          mainProductListRef.current.style.transition = "all 500ms ease 0s";
        }
      }
    }
  };

  const handleClickPreviousButton = () => {
    if (currentListIndex === 2) {
      currentListIndex = 1;
      if (previousButtonRef.current) {
        previousButtonRef.current.style.display = "none";
      }
      if (nextButtonRef.current) {
        nextButtonRef.current.style.display = "flex";
        nextButtonRef.current.style.justifyContent = "center";
      }

      if (mainProductListRef.current) {
        mainProductListRef.current.style.transform = "translate(0, 0)";
        mainProductListRef.current.style.transition = "all 500ms ease 0s";
      }
    }
  };

  const handleSlidingImage = () => {
    if (queueItemCurrentIndex < len - 1) {
      queueItemCurrentIndex++;
      queueItems[queueItemCurrentIndex - 1].classList.remove(QUEUE_ITEM_CURRENT_CLASS);
      queueItems[queueItemCurrentIndex].classList.add(QUEUE_ITEM_CURRENT_CLASS);
    } else {
      // ! cannot read property 'classList' of undefined
      // queueItemCurrentIndex = 0;
      // queueItems[len - 1].classList.remove(QUEUE_ITEM_CURRENT_CLASS);
      // queueItems[0].classList.add(QUEUE_ITEM_CURRENT_CLASS);
    }

    updateMotionImageLinkProps(queueItemCurrentIndex);
  };

  useEffect(() => {
    const queueItemsArray = Array.from($$(`.${QUEUE_ITEM_CLASS}`));
    setQueueItems(queueItemsArray);
  }, []);

  // Auto change slider image & queue item index
  useEffect(() => {
    const timerId = setInterval(handleSlidingImage, 5000);
    return () => clearInterval(timerId);
  }, [queueItems]);

  return (
    <div className="shopee-mall">
      <div className="shopee-mall__heading">
        <div className="shopee-mall__heading__part">
          <a
            href="https://shopee.vn/mall"
            className="shopee-mall__heading__link"
          >
            <img
              src={ShopeeMallHeadingLabelIcon}
              className="shopee-mall__heading__img"
              alt=""
            />
          </a>
        </div>

        <div className="shopee-mall__heading__text">{headingTextInfo && renderHeadingText(headingTextInfo)}</div>

        <a
          href="https://shopee.vn/mall"
          className="shopee-mall__heading__view-all-btn "
        >
          <span>Xem tất cả</span>
          <div className="flex items-center justify-center">
            <MdOutlineArrowForwardIos className="text-white" />
          </div>
        </a>
      </div>

      <div className="shopee-mall__main">
        <div className="shopee-mall__main__motion one-time">
          <a
            href="https://shopee.vn/m/uu-dai-provence"
            ref={motionLinkRef}
            className="shopee-mall__main__motion__link"
          >
            <img
              src={ShopeeMallMotionBanner1}
              ref={motionImageRef}
              className="shopee-mall__main__motion__img"
              alt=""
            />
          </a>
          <div className="shopee-mall__main__motion__queue">{motionLinkInfo && renderQueueItems(motionLinkInfo)}</div>
        </div>

        <div className="shopee-mall__main__product">
          <div className="shopee-mall__main__product-part">
            <ul
              ref={mainProductListRef}
              className="shopee-mall__main__product-list"
            >
              {productListInfo && renderProductList(productListInfo)}
            </ul>
          </div>

          <button
            ref={previousButtonRef}
            onClick={handleClickPreviousButton}
            className="navigation-btn navigation-btn__previous shopee-mall__main__product__previous-btn"
          >
            <MdOutlineArrowBackIos className="fas fa-chevron-left navigation-btn__icon" />
          </button>
          <button
            ref={nextButtonRef}
            onClick={handleClickNextButton}
            className="navigation-btn navigation-btn__next shopee-mall__main__product__next-btn"
          >
            <MdOutlineArrowForwardIos className="fas fa-chevron-right navigation-btn__icon" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShopeeMall;
