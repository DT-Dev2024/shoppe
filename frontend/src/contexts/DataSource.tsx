import axios from "axios";
import { useState, useEffect, createContext } from "react";
import { API1_URL, API2_URL, API3_URL, historyListInfoApi } from "src/apis";

export interface IDataSource {
  directoryMainItemListInfo: {
    href: string;
    itemImage: string;
    itemTitle: string;
  }[][];
  footerTextATagsInfo?: {
    href: string;
    innerHTML: string;
  }[];
  footerPolicyTermsPartTitleInfo?: {
    href: string;
    innerHTML: string;
  }[];
  footerPolicyTermsPartCertificateInfo?: {
    href: string;
    image: string;
  }[];
  footerPolicyTermsPartCompanyInfoInfo?: {
    href: string;
    innerHTML: string;
  }[];

  headerNotificationPopupWhenLoggedInListInfo?: {
    href: string;
    itemImage: string;
    itemTitle: string;
    itemDescription: string;
  }[];
  headerSearchHistoryListInfo?: {
    href: string;
    innerHTML: string;
  }[];
  headerSearchHistoryKeywordsListInfo?: {
    href: string;
    innerHTML: string;
  }[];
  flashSaleMainListInfo?: {
    href: string;
    bubbleImage: string;
    frameImage: string;
    price: number;
    selledStatus: string;
    selledPartWidthPercent: number;
    saleOffPercent: number;
  }[];
  outstandingHotSellingProductsInfo?: {
    info: {
      heading: string;
    };
    list: {
      href: string;
      image: string;
      price: number;
      percent: number;
    }[];
  };

  outstandingHotBrandsInfo?: {
    info: {
      heading: string;
    };
    list: {
      href: string;
      image: string;
      subImage: string;
      text: string;
    }[];
  };
  searchTrendingMainListInfo?: {
    href: string;
    productName: string;
    productDescription: string;
    image: string;
  }[][];

  shopeeMallHeadingTextInfo: {
    // Define the properties of shopeeMallHeadingTextInfo here
    // For example:
    image: string;
    title: string;
  }[];

  shopeeMallMainProductListInfo: {
    // Define the properties of shopeeMallMainProductListInfo here
    // For example:
    id: number;
    href: string;
    image: string;
    price: number;
    text: string;
  }[][];

  shopeeMallMainMotionLinkInfo: {
    href: string;
    image: string;
  }[];

  sliderFavouriteSelectionsInfo?: {
    href: string;
    image: string;
    title: string;
    text: string;
  }[];

  sliderMainMotionPartLinkInfo?: {
    // For example:
    href: string;
    image: string;
    text: string;
  }[];

  todaySuggestionMainTabMainInfo?: {
    // Define the properties of todaySuggestionMainTabMainInfo here
    // For example:
    href: string;
    image: string;
    title: string;
    text: string;
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
  }[][];

  todaySuggestionMainTabSuperSaleInfo?: {
    // Define the properties of todaySuggestionMainTabSuperSaleInfo here
    // For example:
    href: string;
    image: string;
    title: string;
    text: string;
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
  }[][];
  topSearchMainListInfo?: {
    href: string;
    productImage: string;
    price: string;
    text: string;
  }[];

  underFlashSalePartInfo?: {
    href: string;
    image: string;
  }[];

  footerDirectoryListInfo?: {
    heading: IHeading;
    footerDirectoryItemPartListInfo: IFooterDirectoryItem[];
  }[][];

  footerLinkAboutTextCSKHInfo: {
    href: string;
    innerHTML: string;
  }[]; // replace with the actual type
  footerLinkAboutTextVeShopeeInfo: {
    href: string;
    innerHTML: string;
  }[]; // replace with the actual type
  footerLinkAboutSocialInfo: {
    href: string;
    image: string;
    text: string;
  }[]; // replace with the actual type
  footerLinkCopyrightCountryAndAreaListInfo: {
    href: string;
    innerHTML: string;
  }[]; // replace with the actual type
}

interface IHeading {
  href: string;
  innerHTML: string;
}

interface IFooterDirectoryItem {
  href: string;
  innerHTML: string;
}
//default value of context
const defaultDataSource: IDataSource = {
  directoryMainItemListInfo: [],
  footerTextATagsInfo: [],
  footerPolicyTermsPartTitleInfo: [],
  footerPolicyTermsPartCertificateInfo: [],
  footerPolicyTermsPartCompanyInfoInfo: [],
  headerNotificationPopupWhenLoggedInListInfo: [],
  headerSearchHistoryListInfo: [],
  headerSearchHistoryKeywordsListInfo: [],
  flashSaleMainListInfo: [],
  outstandingHotSellingProductsInfo: { info: { heading: "" }, list: [] },
  outstandingHotBrandsInfo: { info: { heading: "" }, list: [] },
  searchTrendingMainListInfo: [],
  shopeeMallHeadingTextInfo: [],
  shopeeMallMainProductListInfo: [],
  shopeeMallMainMotionLinkInfo: [],
  sliderFavouriteSelectionsInfo: [],
  sliderMainMotionPartLinkInfo: [],
  todaySuggestionMainTabMainInfo: [],
  todaySuggestionMainTabSuperSaleInfo: [],
  topSearchMainListInfo: [],
  underFlashSalePartInfo: [],
  footerDirectoryListInfo: [],
  footerLinkAboutTextCSKHInfo: [],
  footerLinkAboutTextVeShopeeInfo: [],
  footerLinkAboutSocialInfo: [],
  footerLinkCopyrightCountryAndAreaListInfo: [],
};

// Context
const DataSourceContext = createContext<IDataSource | undefined>(undefined);

// Provider
function DataSourceContextProvider({ children }: { children: React.ReactNode }) {
  const [dataSource, setDataSource] = useState(defaultDataSource);

  useEffect(() => {
    const fetchData = async () => {
      const { data: data1 } = await axios.get(API1_URL);
      const { data: data2 } = await axios.get(API2_URL);
      const { data: data3 } = await axios.get(API3_URL);

      const historyListInfo = await historyListInfoApi.get();

      // Format data
      const resultData1 = [...data1, ...data2, ...data3];
      const resultData2 = {
        ...resultData1[0],
        ...resultData1[1],
        ...resultData1[2],
        headerSearchHistoryListInfo: historyListInfo,
      };

      // Pass dataSource to Consumers
      setDataSource(resultData2);
    };
    fetchData();
  }, []);
  console.log(dataSource.footerTextATagsInfo);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return <DataSourceContext.Provider value={dataSource!}>{children}</DataSourceContext.Provider>;
}

export { DataSourceContext, DataSourceContextProvider };
