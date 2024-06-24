import { useDataSourceContext } from "src/hooks/hookHome";
import "./FooterDirectory.css";
import { IDataSource } from "src/contexts";

interface IHeading {
  href: string;
  innerHTML: string;
}

interface IFooterDirectoryItem {
  href: string;
  innerHTML: string;
}

interface IFooterDirectory {
  heading: IHeading;
  footerDirectoryItemPartListInfo: IFooterDirectoryItem[];
}

function FooterDirectory() {
  const { footerDirectoryListInfo } = useDataSourceContext() as IDataSource;
  const renderFooterDirectoryList = (datas: IFooterDirectory[][]) => {
    return datas.map((data1, index1) => {
      return (
        <li
          key={index1}
          className="footer__directory__item"
        >
          {data1.map((data2, index2) => {
            const { heading, footerDirectoryItemPartListInfo } = data2;
            // const { _, innerHTML: innerHTML2 } = heading;
            return (
              <div
                key={index2}
                className="footer__directory__item__part"
              >
                <a
                  href={"/"}
                  className="footer__directory__item__part__heading"
                >
                  {heading?.innerHTML}
                </a>

                <div className="footer__directory__item__part__list">
                  {footerDirectoryItemPartListInfo &&
                    footerDirectoryItemPartListInfo.map((data3, index3) => {
                      // const { href: href3, innerHTML: innerHTML3 } = data3;

                      return (
                        <a
                          key={index3}
                          href={"/"}
                          className="footer__directory__item__part__item"
                        >
                          {data3.innerHTML}
                        </a>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </li>
      );
    });
  };

  return (
    <div className="footer__directory">
      <span className="footer__directory__heading">Danh Mục</span>
      <ul className="footer__directory__list">
        {footerDirectoryListInfo && renderFooterDirectoryList(footerDirectoryListInfo)}
      </ul>
    </div>
  );
}

export default FooterDirectory;
