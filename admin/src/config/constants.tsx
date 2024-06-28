import { Row, Tag } from "antd";
import Cookies from "js-cookie";
import { URL_IMAGE } from "../service/ApiService";
import DateUtil from "../util/DateUtil";
import { formatPrice } from "../util/funcUtils";

export const DOLLARS = 23000;
export const UNIT = "$";

const FORM_ITEM_LAYOUT_STAFF = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export const SESSION = "s3ssion";

const REG_PHONE = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
export { FORM_ITEM_LAYOUT_STAFF, REG_PHONE };

export const STATUS = {
  INACTIVE: 0,
  ACTIVE: 1,
};

export const MAX_ID_NUMB = 3;

export const ID_PREFIX = {
  USER: "NV",
  INSURANCE: "BH",
  SALARY: "L",
  TAX: "T",
};

export const DEFAULT_PASSWORD = "123456";

export const COLUMNS_TRANSACTION = [
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
    render: (item: any, record: any, index: number) => (
      <h4>{record.user.phone}</h4>
    ),
  },
  {
    title: "Ngân hàng",
    dataIndex: "user",
    key: "user",
    render: (user: any) => {
      return (
        // <h4>{"test"}</h4>
        <h4>{user?.bank?.bank_name || "(Trống)"}</h4>
      );
    },
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: any) => (
      <Tag
        color={
          status == "Pending"
            ? "blue"
            : status == "Success"
            ? "green"
            : "volcano"
        }
      >
        {handleConvertKeyStatus(status)}
      </Tag>
    ),
  },
  {
    title: "Ngày yêu cầu",
    dataIndex: "created_at",
    key: "created_at",
    render: (created_at: any) => (
      <h4>{DateUtil.formatTimeDateReview(created_at)}</h4>
    ),
  },
];

export const handleConvertKeyStatus = (status: any) => {
  switch (status) {
    case "Pending":
      return "Chờ phê duyệt";
    case "Success":
      return "Đã phê duyệt";
    case "Reject":
      return "Từ chối";
    default:
      break;
  }
};

export const handleConvertValueStatus = (status: any) => {
  switch (status) {
    case 1:
      return "Pending";
    case 2:
      return "Success";
    case 3:
      return "Reject";
    default:
      return undefined;
      break;
  }
};

export const handleConvertValueType = (type: any) => {
  switch (type) {
    case 1:
      return "TopUp";
    case 2:
      return "CashOut";
    case 3:
      return "PurchaseLevel";
    default:
      return undefined;
      break;
  }
};
export const checkToken = async () => {
  let cookie = Cookies.get(SESSION);
  return cookie;
};

export const COLUMNS_ADMIN = [
  {
    title: "ID",
    dataIndex: "_id",
    key: "_id",
    render: (_id: any) => <h4>{_id}</h4>,
  },
  {
    title: "Tên",
    dataIndex: "identifier",
    key: "identifier",
    render: (identifier: any) => <h4>{identifier}</h4>,
  },
  {
    title: "Ngày tạo",
    dataIndex: "created_at",
    key: "created_at",
    render: (created_at: any) => (
      <h4>{DateUtil.formatTimeDateReview(created_at)}</h4>
    ),
  },
];

export const COLUMNS_PRODUCT = [
  {
    title: "Mã sản phẩm",
    dataIndex: "_id",
    key: "_id",
    render: (_id: any) => <h4>{_id}</h4>,
  },
  {
    title: "Danh mục sản phẩm",
    dataIndex: "category",
    key: "category",
    render: (category: any) => <h4>{category.name}</h4>,
  },
  {
    width: "150px",
    title: "Ảnh sản phẩm",
    dataIndex: "image",
    key: "image",
    render: (image: any) => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          crossOrigin="anonymous"
          src={`${URL_IMAGE}/${image}`}
          style={{
            width: "60px",
            height: "60px",
            marginRight: 10,
          }}
          alt="sp"
        />
      </div>
    ),
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "item",
    key: "item",
    render: (item: any, record: any) => <h4>{record.name}</h4>,
  },
  {
    title: "Giá sản phẩm",
    dataIndex: "price",
    key: "price",
    render: (price: any) => <h4>{(formatPrice(price) || 0) + "$"}</h4>,
  },
  {
    title: "Ngày tạo",
    dataIndex: "created_at",
    key: "created_at",
    render: (created_at: any) => (
      <h4>{DateUtil.formatTimeDateReview(created_at)}</h4>
    ),
  },
];

export function getBase64(img: any, callback: any) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export const COLUMNS_ORDER = [
  {
    title: "Mã đơn hàng",
    dataIndex: "_id",
    key: "_id",
    render: (_id: any) => <h4>{_id}</h4>,
  },
  {
    title: "Số điện thoại",
    dataIndex: "item",
    key: "item",
    render: (item: any, record: any) => {
      return (
        <Row>
          <h4>{record?.user?.phone}</h4>
        </Row>
      );
    },
  },
  {
    title: "Cấp độ",
    dataIndex: "item",
    key: "item",
    render: (item: any, record: any) => (
      <h4>{record?.user?.level || "Chưa cập nhật"}</h4>
    ),
  },
  {
    title: "Số dư tài khoản",
    dataIndex: "item",
    key: "item",
    render: (item: any, record: any) => (
      <h4>{(formatPrice(record?.user?.balance.toFixed(2)) || 0) + UNIT}</h4>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: any) => (
      <Tag
        color={
          status == "Pending"
            ? "blue"
            : status == "Processing"
            ? "yellow"
            : status == "Success"
            ? "green"
            : "orange"
        }
      >
        {handleConvertKeyStatusOrder(status)}
      </Tag>
    ),
  },
  {
    title: "Ngày yêu cầu",
    dataIndex: "created_at",
    key: "created_at",
    render: (created_at: any) => (
      <h4>{DateUtil.formatTimeDateReview(created_at)}</h4>
    ),
  },
];

export const handleConvertKeyStatusOrder = (status: any) => {
  switch (status) {
    case "Pending":
      return "Chờ xử lý";
    case "Processing":
      return "Đang xử lý";
    case "Success":
      return "Hoàn thành";
    case "Frozen":
      return "Hoàn tiền";
    default:
      break;
  }
};

export const handleConvertValueStatusOrder = (status: any) => {
  switch (status) {
    case 0:
      return undefined;
    case 1:
    case 2:
    case 3:
      return "Frozen";
    case 4:
      return "Success";
    default:
      return undefined;
      break;
  }
};

export const handleConvertValueQuerySortProduct = (status: any) => {
  switch (status) {
    case 0:
      return "PriceASC";
    case 1:
      return "PriceDESC";
    case 2:
      return "NameASC";
    case 3:
      return "NameDESC";
    default:
      return undefined;
      break;
  }
};

const handleKey = (level: any) => {};

export const COLUMNS_CUSTOMER = [
  {
    title: "Mã khách hàng",
    dataIndex: "_id",
    key: "_id",
    render: (_id: any) => <h4>{_id}</h4>,
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
    render: (phone: any) => <h4>{phone}</h4>,
  },
  {
    title: "Tên khách hàng",
    dataIndex: "name",
    key: "name",
    render: (name: any) => <h4>{name}</h4>,
  },
  {
    title: "Cấp độ",
    dataIndex: "levelName",
    key: "levelName",
    render: (levelName: any) => <h4>{levelName || "Trống"}</h4>,
  },
  {
    title: "Số dư tài khoản",
    dataIndex: "balance",
    key: "balance",
    render: (balance: any) => (
      <h4>{(formatPrice(balance.toFixed(2)) || 0) + UNIT}</h4>
    ),
  },
  {
    title: "Số tiền đóng băng",
    dataIndex: "frozen_balance",
    key: "frozen_balance",
    render: (frozen_balance: any) => (
      <h4>{(formatPrice(frozen_balance.toFixed(2)) || 0) + UNIT}</h4>
    ),
  },
  {
    title: "Số đơn bị khoá",
    dataIndex: "limited_order",
    key: "limited_order",
    render: (limited_order: any) => (
      <h4>{limited_order?.num || "Chưa cập nhật"}</h4>
    ),
  },
  {
    title: "Ngày tạo",
    dataIndex: "created_at",
    key: "created_at",
    render: (created_at: any) => (
      <h4>{DateUtil.formatTimeDateReview(created_at)}</h4>
    ),
  },
];
export const COLUMNS_VIP = [
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
    render: (name: any) => <h4>{name}</h4>,
  },
  {
    title: "Ảnh",
    dataIndex: "background_urls",
    key: "background_urls",
    render: (background_urls: any) => (
      <img
        crossOrigin="anonymous"
        src={`${URL_IMAGE}/${background_urls[0]}`}
        style={{
          width: "60px",
          height: "60px",
          marginRight: 10,
        }}
        alt="sp"
      />
    ),
  },
  {
    title: "Giá",
    dataIndex: "price",
    key: "price",
    render: (price: any) => <h4>{(formatPrice(price) || 0) + "$"}</h4>,
  },
  {
    title: "Số lượng sản phẩm",
    dataIndex: "products",
    key: "products",
    render: (products: any) => <h4>{formatPrice(products.length) || 0}</h4>,
  },
  {
    title: "Hoa hồng",
    dataIndex: "commission_percent",
    key: "commission_percent",
    render: (commission_percent: any) => <h4>{commission_percent + "%"}</h4>,
  },
  {
    title: "Ngày tạo",
    dataIndex: "created_at",
    key: "created_at",
    render: (created_at: any) => (
      <h4>{DateUtil.formatTimeDateReview(created_at)}</h4>
    ),
  },
];
export const COLUMNS_CATEGORY = [
  {
    title: "Mã danh mục",
    dataIndex: "_id",
    key: "_id",
    render: (_id: any) => <h4>{_id}</h4>,
  },
  {
    title: "Ảnh danh mục",
    dataIndex: "image",
    key: "image",
    render: (image: any) => (
      <img
        crossOrigin="anonymous"
        src={`${URL_IMAGE}/${image}`}
        style={{
          width: "60px",
          height: "60px",
          marginRight: 10,
        }}
        alt="sp"
      />
    ),
  },
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
    render: (name: any) => <h4>{name}</h4>,
  },
  {
    title: "Ngày tạo",
    dataIndex: "created_at",
    key: "created_at",
    render: (created_at: any) => (
      <h4>{DateUtil.formatTimeDateReview(created_at)}</h4>
    ),
  },
];

export const convertVndToDollar = (price: any) => {
  return formatPrice((+price / DOLLARS).toFixed(0).toString());
};
export const IS_ACTIVE = {
  ACTIVE: "Active",
  UN_ACTIVE: "InActive",
};

export const IsLimitedOrder = {
  Limited: "Limited",
  NotLimited: "NotLimited",
};

export const UserBankNames = {
  MartimeBank: "MARITIME BANK",
  AgriBank: "AGRIBANK",
  VietinBank: "VIETINBANK",
  BacABank: "BAC A BANK",
  BaoVietBank: "BAO VIET BANK",
  BidvBank: "BIDV BANK",
  GPBank: "GP BANK",
  HDBank: "HD BANK",
  HongLeOngBank: "HONGLEONG BANK",
  IndovinaBank: "INDOVINA BANK",
  KienLongBank: "KIENLONGBANK",
  MBBank: "MBBANK",
  NaMaBank: "NAMA BANK",
  AChauBank: "NGAN HANG A CHAU",
  TMCPDongABank: "Ngân hàng TMCP Đông Á",
  TMCPVietABank: "Ngân hàng TMCP Việt Á",
  LDVietNgaBank: "NH LD VIET NGA",
  MTVCIMBBank: "NH MTV CIMB",
  TMCPQuocDanBank: "NH TMCP QUOC DAN",
  OceanBank: "OCEANBANK",
  PGBBank: "PGBANK",
  PhuongDongBank: "PHUONGDONG BANK",
  SacomBank: "SACOMBANK",
  SCBBank: "SCB BANK",
  SeaBank: "SEABANK",
  SHBBank: "SHB BANK",
  ShinHanBank: "SHINHAN BANK VN",
  TechcomBank: "TECHCOMBANK",
  TienPhongBank: "TIENPHONG BANK",
  UnitedOverseasBank: "UNITED OVERSEAS BANK",
  VIBBank: "VIB BANK",
  VIDPublicBank: "VIDPublic Bank",
  VietBank: "VIETBANK",
  VietcomBank: "VIETCOMBANK",
  VPBank: "VPBANK",
  WooriBank: "우리은행 (WOORI BANK)",
  LienVietPostBank: "LienVietPostBank",
  EximBank: "EXIMBANK",
  CitiBank: "Citi Bank",
  BanVietBank: "Ban Viet Bank",
  NCBBank: "NCB Bank",
  SaigonBank: "SAIGON Bank",
  KBKookminBank: "KB국민은행 (KBKookminBank)",
  HSBCBank: "HSBC Bank",
  OCBCBank: "OCBC Bank",
  UOBBank: "UOB Bank",
  MizuhoBank: "Mizuho Bank",
  MUFGBank: "MUFG Bank",
  DaeguBank: "DGB대구은행 (DaeguBank)",
  MitsubishiUFJBank: "Mitsubishi UFJ Bank",
  KEBHanaBank: "KEB Hana Bank",
  KookminBank: "Kookmin Bank",
  BusanBank: "Busan Bank",
  USDTBEP20: "USDT BEP20",
  CBBank: "CB Bank",
  NonghyupBank: "NH저축은행 (NonghyupBank)",
  KBKookmincard: "KB국민카드 (KBKookmincard)",
  RakutenBank: "楽天銀行 (RakutenBank)",
  ShinkinBank: "全国の信用金庫 (ShinkinBank)",
  ResonaBank: "りそな銀行 (ResonaBank)",
  Aozorabank: "あおぞら銀行 (Aozorabank)",
  SMTB: "三井住友信託銀行 (SMTB)",
  AEONBank: "イオン銀行 (AEONBank)",
  TaishinlnternationalBank: "台新銀行 (TaishinlnternationalBank)",
  taiwanBusinessBank: "台湾企銀 (taiwanBusinessBank)",
  OsakaShinkinBank: "北おおさか信用金庫 (OsakaShinkinBank)",
  DaichiMiraiShinkinBank: "大地みらい信用金庫 (DaichiMiraiShinkinBank)",
  SaitamakenShinkinbank: "奇玉縣信用金庫 (SaitamakenShinkinbank)",
  JoyoBank: "常陽銀行 (JoyoBank)",
  B77Bank: "七十七銀行 (77Bank)",
  PayPayBank: "旧ジャパンネット銀行 (PayPayBank)",
  AshikagaBank: "足利銀行 (AshikagaBank)",
  HekikaiShinkinBank: "碧海信用金庫 (HekikaiShinkinBank)",
  AmagasakiShinkinBank: "尼崎信用金庫 (AmagasakiShinkinBank)",
  TaiwanCooperativeBank: "台作金庫銀行 (TaiwanCooperativeBank)",
  NantoBank: "南都銀行 (NantoBank)",
  AujibunBank: "Au じぶん銀行 (AujibunBank)",
  HirosimaBank: "広島銀行 (HirosimaBank)",
  bankoftaiwan: "臺灣銀行 (bankoftaiwan)",
  hokuribuBank: "北陸銀行 (hokuribuBank)",
  SMBC: "三井住友銀行 (SMBC)",
  NisshinShinkinBank: "日新信用金庫 (NisshinShinkinBank)",
  SevenBank: "セブン銀行 (SevenBank)",
  GMOAozoraNetBank: "あおぞらネツト銀行 (GMOAozoraNetBank)",
  ShinseiBank: "新生銀行 (ShinseiBank)",
  TaichungBank: "台中銀行 (TaichungBank)",
  nanyangCommercialBank: "南洋商业銀行 (nanyang commercial bank)",
  MegaInternationalCommercialBank:
    "兆豐國際商業銀行 (Mega International Commercial Bank)",
  firstbank: "第一銀行 (firstbank)",
  YuuchoGinkou: "ゆうちょ銀行 (Yuucho Ginkou)",
  OgakiKyoritsuBank: "大垣共立銀行 (Ogaki Kyoritsu Bank)",
  cathayUnitedBankTaiwan: "国泰联合银行 (cathay united bank taiwan)",
  himawariShinkinBank: "ひまわり信用金庫 (himawariShinkinBank)",
  LANDBANKOFTAIWAN: "臺灣土地銀行 (LAND BANK OF TAIWAN)",
  hyakugobank: "百万銀行 (hyakugobank)",
  HSBCBankUSA: "HSBC Bank USA",
  WellsFargo: "Wells Fargo ",
  PinnacleBank: "Pinnacle Bank",
  USBancorp: "US Bancorp",
  JPMorganChaseBank: "JP Morgan Chase Bank",
  PNCFinancialServices: "PNC Financial Services",
  AgFirstFarmCreditBank: "AgFirst Farm Credit Bank",
  GoldmanSachs: "Goldman Sachs",
  WilshireBank: "Wilshire Bank",
  TDBank: "TD Bank",
  MorganStanley: "Morgan Stanley",
  CapitalOne: "Capital One",
  Citigroup: "Citigroup",
  BankCSOB: "Bank CSOB",
  CeskaSporitelna: "Ceska Sporitelna",
  KomercniBanka: "Komercní Banka",
  BankUniCreditCZ: "Bank UniCredit CZ",
  RaiffeisenbankCZ: "Raiffeisenbank CZ",
  Barclays: "Barclays",
  NatWest: "NatWest",
  HSBC: "HSBC",
  Lloyds: "Lloyds",
  Sparkasse: "Sparkasse",
  DeutscheBank: "Deutsche Bank",
  Comdirect: "Comdirect",
  Commerzbank: "Commerzbank",
  N26: "N26",
  BNPParibas: "BNP Paribas",
  CreditAgricole: "Crédit Agricole",
  LCL: "LCL",
  SocieteGenerale: "Société Générale",
  CréditIndustrielEtCommercial: "Crédit Industriel et Commercial (CIC)",
  LaBanquePostale: "La Banque Postale",
  NordeaBankAB: "Nordea Bank AB",
  BankofAmerica: "Bank of America",
  KIOPIBK: "KIOP IBK",
};

export const COLUMNS_LOG = [
  {
    title: "Tên admin",
    dataIndex: "name",
    key: "name",
    render: (name: any) => <h4>{name}</h4>,
  },
  {
    title: "Loại tương tác",
    dataIndex: "action",
    key: "action",
    render: (action: any) => <h4>{action}</h4>,
  },
  {
    title: "Nội dung",
    dataIndex: "content",
    key: "content",
    render: (content: any) => <h4>{content}</h4>,
  },
  {
    title: "Ngày tạo",
    dataIndex: "created_at",
    key: "created_at",
    render: (created_at: any) => (
      <h4>{DateUtil.formatTimeDateReview(created_at)}</h4>
    ),
  },
];
