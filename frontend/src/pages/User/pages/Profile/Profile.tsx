import React from "react";
import { CiSearch } from "react-icons/ci";

// Define the types
interface Order {
  id: number;
  shop: string;
  image: string;
  name: string;
  type: string;
  priceOriginal: number;
  priceDiscount: number;
  finalPrice: number;
  quantity?: number;
}

interface OrderItemProps {
  order: Order;
}

// Sample data
const orders: Order[] = [
  {
    id: 1,
    shop: "GENNY GIFT",
    image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
    name: "Set quà tặng Valentine dành cho bạn gái, quà sinh nhật nước hoa, son tone hồng đáng yêu",
    type: "Hộp TN mã 5",
    priceOriginal: 240000,
    priceDiscount: 173000,
    finalPrice: 184000,
    quantity: 2,
  },
  {
    id: 2,
    shop: "Tinh dầu Noison",
    image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
    name: "Nước hoa Nữ Rosalise by Noison EDP | Hương thơm hoa diên vĩ và hoa nhài, quý phái sang trọng",
    type: "12ml",
    priceOriginal: 358000,
    priceDiscount: 179000,
    finalPrice: 179000,
    quantity: 1,
  },
];

//function convert to vietnamese currency
function currencyFormat(num: number) {
  return new Intl.NumberFormat("vi-VN", {
    currency: "VND",
  }).format(num);
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  //convert to vietnamese currency

  return (
    <div className="mb-4 rounded-lg border bg-white p-4 shadow-md">
      <div className="flex items-center justify-between border-b pb-2">
        <h5 className="text-2xl font-bold">{order.shop}</h5>
        <p className="text-xl font-bold text-orange-600">Trạng thái</p>
      </div>

      <div className="mt-3 flex items-center justify-between border-b pb-10">
        <div className="flex">
          <img
            className="h-40 w-32 rounded-lg object-cover"
            src={order.image}
            alt={order.name}
          />
          <div className="space-y-4 p-2 text-[16px] text-gray-600">
            <p>{order.name}</p>
            <p>Phân loại: {order.type}</p>
            <p>x{order.quantity}</p>
          </div>
        </div>
        <div className="text-xl">
          <span className="text-gray-500 line-through">₫{currencyFormat(order.priceOriginal)}</span>
          <span className="font-bold text-orange-600"> ₫{currencyFormat(order.priceDiscount)}</span>
        </div>
      </div>
      <div className="mt-4 flex justify-end text-[14px]">
        <span className="my-4 mr-2 flex text-3xl">
          <svg
            width={16}
            height={17}
            viewBox="0 0 253 263"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Shopee Guarantee</title>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M126.5 0.389801C126.5 0.389801 82.61 27.8998 5.75 26.8598C5.08763 26.8507 4.43006 26.9733 3.81548 27.2205C3.20091 27.4677 2.64159 27.8346 2.17 28.2998C1.69998 28.7657 1.32713 29.3203 1.07307 29.9314C0.819019 30.5425 0.688805 31.198 0.689995 31.8598V106.97C0.687073 131.07 6.77532 154.78 18.3892 175.898C30.003 197.015 46.7657 214.855 67.12 227.76L118.47 260.28C120.872 261.802 123.657 262.61 126.5 262.61C129.343 262.61 132.128 261.802 134.53 260.28L185.88 227.73C206.234 214.825 222.997 196.985 234.611 175.868C246.225 154.75 252.313 131.04 252.31 106.94V31.8598C252.31 31.1973 252.178 30.5414 251.922 29.9303C251.667 29.3191 251.292 28.7649 250.82 28.2998C250.35 27.8358 249.792 27.4696 249.179 27.2225C248.566 26.9753 247.911 26.852 247.25 26.8598C170.39 27.8998 126.5 0.389801 126.5 0.389801Z"
              fill="#ee4d2d"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M207.7 149.66L119.61 107.03C116.386 105.472 113.914 102.697 112.736 99.3154C111.558 95.9342 111.772 92.2235 113.33 88.9998C114.888 85.7761 117.663 83.3034 121.044 82.1257C124.426 80.948 128.136 81.1617 131.36 82.7198L215.43 123.38C215.7 120.38 215.85 117.38 215.85 114.31V61.0298C215.848 60.5592 215.753 60.0936 215.57 59.6598C215.393 59.2232 215.128 58.8281 214.79 58.4998C214.457 58.1705 214.063 57.909 213.63 57.7298C213.194 57.5576 212.729 57.4727 212.26 57.4798C157.69 58.2298 126.5 38.6798 126.5 38.6798C126.5 38.6798 95.31 58.2298 40.71 57.4798C40.2401 57.4732 39.7735 57.5602 39.3376 57.7357C38.9017 57.9113 38.5051 58.1719 38.1709 58.5023C37.8367 58.8328 37.5717 59.2264 37.3913 59.6604C37.2108 60.0943 37.1186 60.5599 37.12 61.0298V108.03L118.84 147.57C121.591 148.902 123.808 151.128 125.129 153.884C126.45 156.64 126.797 159.762 126.113 162.741C125.429 165.72 123.755 168.378 121.363 170.282C118.972 172.185 116.006 173.221 112.95 173.22C110.919 173.221 108.915 172.76 107.09 171.87L40.24 139.48C46.6407 164.573 62.3785 186.277 84.24 200.16L124.49 225.7C125.061 226.053 125.719 226.24 126.39 226.24C127.061 226.24 127.719 226.053 128.29 225.7L168.57 200.16C187.187 188.399 201.464 170.892 209.24 150.29C208.715 150.11 208.2 149.9 207.7 149.66Z"
              fill="#fff"
            />
          </svg>
          Thành tiền: <span className="ml-2 text-orange-600">₫{currencyFormat(order.priceOriginal)}</span>
        </span>
      </div>

      <div className="mt-4 flex justify-end text-[14px]">
        <button className="mr-2 rounded-lg bg-orange-600 px-16 py-5 text-white">Mua Lại</button>
        <button className="rounded-lg border bg-white px-4 py-2 text-gray-700">Liên Hệ Người Bán</button>
      </div>
    </div>
  );
};

const OrderList: React.FC = () => {
  const tabs: string[] = [
    "Tất cả",
    "Chờ thanh toán",
    "Vận chuyển",
    "Chờ giao hàng",
    "Hoàn thành",
    "Đã hủy",
    "Trả hàng/Hoàn tiền",
  ];

  const [activeTab, setActiveTab] = React.useState<string>(tabs[0]);
  const [onSearch, setOnSearch] = React.useState<boolean>(false);
  return (
    <div>
      <div className="flex justify-center">
        <div className="grid w-full grid-cols-7">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab ? "border-b border-b-orange-600 text-orange-600" : ""
              } bg-white py-4 text-[16px]`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <form
        action=""
        className="mt-4 flex w-full items-center rounded border bg-gray-100 p-4"
      >
        <CiSearch className={`text-3xl ${onSearch ? "font-bold text-black" : ""}`} />

        <input
          type="text"
          className="w-full bg-transparent pl-4 text-xl focus:outline-none"
          placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
          onFocus={() => setOnSearch(true)}
          onBlur={() => setOnSearch(false)}
        />
      </form>
      <div className="mt-4">
        {orders.map((order) => (
          <OrderItem
            key={order.id}
            order={order}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderList;
