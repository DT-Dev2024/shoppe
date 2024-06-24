import useDataSourceContext from "src/hooks/hookHome/useDataSourceContext";
import "./FooterPolicyAndTerms.css";
import { IDataSource } from "src/contexts";
interface TitleData {
  href: string;
  innerHTML: string;
}
import certificate1 from "src/assets/img/footer/policy-terms/certificate1.png";
import certificate2 from "src/assets/img/footer/policy-terms/certificate2.png";
import certificate3 from "src/assets/img/footer/policy-terms/certificate3.png";

function FooterPolicyAndTerms() {
  const { footerPolicyTermsPartTitleInfo, footerPolicyTermsPartCertificateInfo, footerPolicyTermsPartCompanyInfoInfo } =
    useDataSourceContext() as IDataSource;

  const renderTitlePart = (datas: TitleData[]) =>
    datas.map((data, index) => {
      const { href, innerHTML } = data;
      return (
        <div
          key={index}
          className="footer__policy-terms__part__title__part"
        >
          <a
            href={href}
            className="footer__policy-terms__part__title__link"
          >
            {innerHTML}
          </a>
        </div>
      );
    });

  const renderCertificatePart = (datas: { href: string; image: string }[]) =>
    datas.map((data, index) => {
      const { href, image } = data;
      const splitImage = image.split("/");
      let img = "";
      if (splitImage[splitImage.length - 1] === "1.png") {
        img = certificate1;
      } else if (splitImage[splitImage.length - 1] === "2.png") {
        img = certificate2;
      } else {
        img = certificate3;
      }
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="footer__policy-terms__part__certificate__link"
        >
          <img
            src={img}
            alt=""
          />
        </a>
      );
    });

  const renderCompanyInfoPart = (datas: { innerHTML: string }[]) =>
    datas.map((data: { innerHTML: string }, index: number) => (
      <span
        key={index}
        className="footer__policy-terms__part__company-info__text"
      >
        {data.innerHTML}
      </span>
    ));

  return (
    <div className="footer__policy-terms">
      <div className="footer__policy-terms__part">
        <div className="footer__policy-terms__part__title">
          {footerPolicyTermsPartTitleInfo && renderTitlePart(footerPolicyTermsPartTitleInfo)}
        </div>

        <div className="footer__policy-terms__part__certificate">
          {footerPolicyTermsPartCertificateInfo && renderCertificatePart(footerPolicyTermsPartCertificateInfo)}
        </div>

        <div className="footer__policy-terms__part__company-info">
          {footerPolicyTermsPartCompanyInfoInfo && renderCompanyInfoPart(footerPolicyTermsPartCompanyInfoInfo)}
        </div>
      </div>
    </div>
  );
}

export default FooterPolicyAndTerms;
