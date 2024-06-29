import useDataSourceContext from "src/hooks/hookHome/useDataSourceContext";
import "./Directory.css";
import { useRef } from "react";
import { IDataSource } from "src/contexts";
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from "react-icons/md";

interface IData {
  href: string;
  itemImage: string;
  itemTitle: string;
}

function Directory() {
  const mainListRef = useRef<HTMLUListElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);

  const { directoryMainItemListInfo: mainItemListInfo } = useDataSourceContext() as IDataSource;

  const renderMainList = (datas: IData[][]) =>
    datas.map((data: IData[], index) => {
      const { href: href1, itemImage: image1, itemTitle: title1 } = data[0];
      const { href: href2, itemImage: image2, itemTitle: title2 } = data[1];

      return (
        <li
          key={index}
          className="directory__main__item"
        >
          <a
            href={"/productList"}
            className="directory__main__item__link"
          >
            <img
              src={image1}
              className="directory__main__item__img"
              alt=""
            />
            <span className="directory__main__item__title">{title1}</span>
          </a>

          <a
            href={"/productList"}
            className="directory__main__item__link"
          >
            <img
              src={image2}
              className="directory__main__item__img"
              alt=""
            />
            <span className="directory__main__item__title">{title2}</span>
          </a>
        </li>
      );
    });

  const handleClickNextButton = () => {
    if (nextButtonRef.current) {
      nextButtonRef.current.style.display = "none";
    }
    if (previousButtonRef.current) {
      previousButtonRef.current.style.display = "flex";
      previousButtonRef.current.style.justifyContent = "center";
    }

    if (mainListRef.current) {
      mainListRef.current.style.transform = "translate(-36rem, 0)";
      mainListRef.current.style.transition = "all 500ms ease 0s";
    }
  };

  const handleClickPreviousButton = () => {
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
  };

  return (
    <div className="directory">
      <div className="directory__heading">DANH MỤC</div>

      <div className="directory__main">
        <div className="directory__main__part">
          <ul
            ref={mainListRef}
            className="directory__main__list"
          >
            {mainItemListInfo && renderMainList(mainItemListInfo)}
          </ul>
        </div>

        <button
          ref={previousButtonRef}
          onClick={handleClickPreviousButton}
          className="navigation-btn navigation-btn__previous directory__main__previous-btn"
        >
          <MdOutlineArrowBackIos className="fas fa-chevron-left navigation-btn__icon" />
        </button>
        <button
          ref={nextButtonRef}
          onClick={handleClickNextButton}
          className="navigation-btn navigation-btn__next directory__main__next-btn"
        >
          <MdOutlineArrowForwardIos className="fas fa-chevron-right navigation-btn__icon" />
        </button>
      </div>
    </div>
  );
}

export default Directory;
