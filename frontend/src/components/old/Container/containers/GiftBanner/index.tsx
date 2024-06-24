import useModalStatusContext from "src/hooks/hookHome/useModalStatusContext";
import "./GiftBanner.css";
import { useEffect } from "react";
import { handlePreventScrolling } from "src/helpers";
import { GiftBannerImage } from "src/assets/img";

function GiftBanner() {
  const { setShowModal } = useModalStatusContext();
  let timerId: NodeJS.Timeout;

  const handleClickGiftBanner = () => {
    if (timerId) {
      clearInterval(timerId);
    }

    timerId = setTimeout(() => {
      setShowModal(true);
      handlePreventScrolling();
    }, 100);
  };

  useEffect(() => {
    return () => clearInterval(timerId);
  }, []);

  return (
    <div
      className="gift-banner"
      onClick={handleClickGiftBanner}
      onKeyDown={handleClickGiftBanner}
      role="button"
      tabIndex={0}
    >
      <div className="gift-banner__part">
        <img
          src={GiftBannerImage}
          className="gift-banner__part__img"
          alt=""
        />
      </div>
    </div>
  );
}

export default GiftBanner;
