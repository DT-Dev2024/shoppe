import useDataSourceContext from "src/hooks/hookHome/useDataSourceContext";
import "./UnderFlashSale.css";
import { IDataSource } from "src/contexts";

interface IUnderFlashSalePart {
  href: string;
  image: string;
}

function UnderFlashSale() {
  const { underFlashSalePartInfo } = useDataSourceContext() as IDataSource;

  const renderUnderFlashSalePart = (datas: IUnderFlashSalePart[]) =>
    datas.map((data, index) => {
      const { href, image } = data;
      return (
        <a
          key={index}
          href={href}
          className="under-flash-sale__link"
        >
          <img
            src={image}
            className="under-flash-sale__img"
            alt=""
          />
        </a>
      );
    });

  return (
    <div className="under-flash-sale">
      <div className="under-flash-sale__part">
        {underFlashSalePartInfo && renderUnderFlashSalePart(underFlashSalePartInfo)}
      </div>
    </div>
  );
}

export default UnderFlashSale;
