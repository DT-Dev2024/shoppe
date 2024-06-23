import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import {
  MdOutlineArrowForwardIos,
  MdOutlineArrowBackIos,
} from "react-icons/md"; /* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SliderMotionBanner1, SliderNoMotionBanner1, SliderNoMotionBanner2 } from "src/assets/img";
import { $$ } from "src/constants";
import { IDataSource } from "src/contexts";
import useDataSourceContext from "src/hooks/hookHome/useDataSourceContext";
import "./Slider.css";

import icon1 from "src/assets/img/container/slider/favourite-selections/icon1.gif";
import icon2 from "src/assets/img/container/slider/favourite-selections/icon2.png";
import icon3 from "src/assets/img/container/slider/favourite-selections/icon3.png";
import icon4 from "src/assets/img/container/slider/favourite-selections/icon4.png";
import icon5 from "src/assets/img/container/slider/favourite-selections/icon5.png";
import icon6 from "src/assets/img/container/slider/favourite-selections/icon6.png";
import icon7 from "src/assets/img/container/slider/favourite-selections/icon7.png";
import icon8 from "src/assets/img/container/slider/favourite-selections/icon8.png";
import icon9 from "src/assets/img/container/slider/favourite-selections/icon9.gif";
import icon10 from "src/assets/img/container/slider/favourite-selections/icon10.png";

import banner1 from "src/assets/img/container/slider/main/motion/banner1.png";
import banner2 from "src/assets/img/container/slider/main/motion/banner2.png";
import banner3 from "src/assets/img/container/slider/main/motion/banner3.png";
import banner4 from "src/assets/img/container/slider/main/motion/banner4.png";
import banner5 from "src/assets/img/container/slider/main/motion/banner5.png";
import banner6 from "src/assets/img/container/slider/main/motion/banner6.png";
import banner7 from "src/assets/img/container/slider/main/motion/banner7.png";
import banner8 from "src/assets/img/container/slider/main/motion/banner8.png";
import banner9 from "src/assets/img/container/slider/main/motion/banner9.png";
import banner10 from "src/assets/img/container/slider/main/motion/banner10.png";
import banner11 from "src/assets/img/container/slider/main/motion/banner11.png";
import banner12 from "src/assets/img/container/slider/main/motion/banner12.png";
interface IData {
  href: string;
  image: string;
  text: string;
}

interface IQueueItem {
  key: number;
  className: string;
}

function Slider() {
  const [queueItems, setQueueItems] = useState<Element[]>([]);
  const motionPartLinkRef = useRef<HTMLAnchorElement | null>(null);
  const motionPartImageRef = useRef<HTMLImageElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const banners = [
    banner1,
    banner2,
    banner3,
    banner4,
    banner5,
    banner6,
    banner7,
    banner8,
    banner9,
    banner10,
    banner11,
    banner12,
  ];

  const { sliderFavouriteSelectionsInfo: favouriteSelectionsInfo, sliderMainMotionPartLinkInfo: motionPartLinkInfo } =
    useDataSourceContext() as IDataSource;

  let queueItemCurrentIndex = 0;
  const len = motionPartLinkInfo?.length;
  const QUEUE_ITEM_CLASS = "slider__main__motion-part__queue-item";
  const QUEUE_ITEM_CURRENT_CLASS = "slider__main__motion-part__queue-item--current";

  const renderFavouriteSelections = (datas: IData[]) => {
    return datas.map((data: IData, index: number) => {
      const { href, image, text }: IData = data;
      const icons = [icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9, icon10];
      const splitImage = image.split("/");
      const id = splitImage[splitImage.length - 1].split(".")[0];
      const img = icons[parseInt(id) - 1];

      return (
        <a
          key={index}
          href={"/"}
          className="slider__favourite-selections__link"
        >
          <img
            className="slider__favourite-selections__link-img"
            src={img}
            alt=""
          />
          <h4 className="slider__favourite-selections__link-text">{text}</h4>
        </a>
      );
    });
  };

  const renderQueueItems = (datas: IData[]) =>
    datas.map((data: IData, index: number) => {
      const { key, className }: IQueueItem = {
        key: index,
        className: `${QUEUE_ITEM_CLASS} ${index === 0 ? QUEUE_ITEM_CURRENT_CLASS : ""}`,
      };
      return (
        <div
          key={key}
          // onClick={(event) => handleClickQueueItem(event)}
          className={className}
        ></div>
      );
    });

  const updateMotionPartImageLinkProps = (index: number) => {
    if (motionPartLinkInfo && motionPartLinkInfo?.length > 0) {
      const { image, href } = motionPartLinkInfo[index];
      const img = banners[index];
      if (motionPartImageRef.current) {
        motionPartImageRef.current.src = img;
      }
      if (motionPartLinkRef.current) {
        motionPartLinkRef.current.href = href;
      }
    }
  };

  const handleClickPreviousButton = () => {
    if (queueItemCurrentIndex === 0) {
      queueItems[0].classList.remove(QUEUE_ITEM_CURRENT_CLASS);
      queueItems[len! - 1].classList.add(QUEUE_ITEM_CURRENT_CLASS);
      queueItemCurrentIndex = len! - 1;
    } else {
      queueItems[queueItemCurrentIndex].classList.remove(QUEUE_ITEM_CURRENT_CLASS);
      queueItems[queueItemCurrentIndex - 1].classList.add(QUEUE_ITEM_CURRENT_CLASS);
      queueItemCurrentIndex--;
    }

    updateMotionPartImageLinkProps(queueItemCurrentIndex);
  };

  const handleClickNextButton = () => {
    if (queueItemCurrentIndex === len! - 1) {
      queueItems[len! - 1].classList.remove(QUEUE_ITEM_CURRENT_CLASS);
      queueItems[0].classList.add(QUEUE_ITEM_CURRENT_CLASS);
      queueItemCurrentIndex = 0;
    } else {
      queueItems[queueItemCurrentIndex].classList.remove(QUEUE_ITEM_CURRENT_CLASS);
      queueItems[queueItemCurrentIndex + 1].classList.add(QUEUE_ITEM_CURRENT_CLASS);
      queueItemCurrentIndex++;
    }

    updateMotionPartImageLinkProps(queueItemCurrentIndex);
  };

  const handleSlidingImage = () => {
    if (queueItemCurrentIndex < len! - 1) {
      queueItemCurrentIndex++;
      queueItems[queueItemCurrentIndex - 1].classList.remove(QUEUE_ITEM_CURRENT_CLASS);
      queueItems[queueItemCurrentIndex].classList.add(QUEUE_ITEM_CURRENT_CLASS);
    } else {
      //! cannot read property 'classList' of undefined
      // queueItemCurrentIndex = 0;
      // queueItems[len! - 1].classList.remove(QUEUE_ITEM_CURRENT_CLASS);
      // queueItems[0].classList.add(QUEUE_ITEM_CURRENT_CLASS);
    }

    updateMotionPartImageLinkProps(queueItemCurrentIndex);
  };

  const handleClickQueueItem = (event: MouseEvent<HTMLDivElement, MouseEvent> | KeyboardEvent<HTMLDivElement>) => {
    const parent = (event.target as HTMLElement).parentElement;

    // Get index of this element in parent element
    if (parent) {
      const index = Array.prototype.indexOf.call(Array.from(parent.childNodes), event.target);

      queueItems[queueItemCurrentIndex].classList.remove(QUEUE_ITEM_CURRENT_CLASS);
      queueItems[index].classList.add(QUEUE_ITEM_CURRENT_CLASS);

      updateMotionPartImageLinkProps(index);

      queueItemCurrentIndex = index;
    }
  };

  // Get queueItems NodeList, convert to array and update state
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
    <div className="slider">
      <div className="slider__part">
        <div className="slider__main">
          <div className="slider__main__motion-part">
            <a
              href="https://shopee.vn/m/freeship-xtra"
              ref={motionPartLinkRef}
              className="slider__main__motion-part__link"
            >
              <img
                src={SliderMotionBanner1}
                ref={motionPartImageRef}
                className="slider__main__motion-part__img slider__main__motion-part__curent-img"
                alt=""
              />
            </a>
            <button
              ref={previousButtonRef}
              onClick={handleClickPreviousButton}
              className="slider__main__motion-part__btn slider__main__motion-part__previous-btn"
            >
              <MdOutlineArrowBackIos />
            </button>
            <button
              ref={nextButtonRef}
              onClick={handleClickNextButton}
              className="slider__main__motion-part__btn slider__main__motion-part__next-btn"
            >
              <MdOutlineArrowForwardIos />
            </button>

            <div className="slider__main__motion-part__queue">
              {motionPartLinkInfo && renderQueueItems(motionPartLinkInfo)}
            </div>
          </div>

          <div className="slider__main__no-motion-part">
            <div>
              <a
                href="https://shopee.vn/m/shopeefarm"
                className="slider__main__no-motion-part__link"
              >
                <img
                  src={SliderNoMotionBanner1}
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
                  src={SliderNoMotionBanner2}
                  className="slider__main__no-motion-part__img"
                  alt=""
                />
              </a>
            </div>
          </div>
        </div>

        <div className="slider__favourite-selections">
          {favouriteSelectionsInfo && renderFavouriteSelections(favouriteSelectionsInfo)}
        </div>
      </div>
    </div>
  );
}

export default Slider;
