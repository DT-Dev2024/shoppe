import { TProduct } from "./product.type";

export type TOrderHistoryStatus = 1 | 2 | 3 | 4 | 5;
export type TOrderHistoryListStatus = TOrderHistoryStatus | 0;

export type TOrderHisotry = {
  _id: string;
  buy_count: number;
  price: number;
  price_before_discount: number;
  status: TOrderHistoryStatus;
  product: TProduct;
  createdAt: string;
  updatedAt: string;
};

export type TVoucherType = "SHOP" | "USER";
export type TDiscountType = "PERCENTAGE" | "FIXED";

export type TVoucher = {
  _id: string;
  type: TVoucherType;
  code: string;
  discount: number;
  discount_type: TDiscountType;
  minium_price: number;
  maxium_discount?: number;
  expire: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export const ordersStatus: TOrderHisotry[] = [
  // Status 1 orders
  {
    buy_count: 1,
    createdAt: "2022-02-22T07:00:00.000Z",
    price: 150000,
    _id: "1",
    price_before_discount: 200000,
    status: 1 as TOrderHistoryStatus,
    updatedAt: "2022-02-22T07:00:00.000Z",
    product: {
      _id: "1",
      name: "Set quà tặng Valentine dành cho bạn gái, quà sinh nhật nước hoa, son tone hồng đáng yêu",
      price: 150000,
      price_before_discount: 200000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
      quantity: 10,
      category: {
        _id: "1",
        name: "Gift",
      },
      rating: 4,
      sold: 10,
      view: 10,
      description: "description",
      images: [],
      createdAt: "2022-02-22T07:00:00.000Z",
      updatedAt: "2022-02-22T07:00:00.000Z",
    },
  },
  {
    buy_count: 1,
    createdAt: "2022-02-22T07:00:00.000Z",
    price: 200000,
    _id: "3",
    price_before_discount: 250000,
    status: 1 as TOrderHistoryStatus,
    updatedAt: "2022-02-22T07:00:00.000Z",
    product: {
      _id: "3",
      name: "Nước hoa Nữ Rosalise by Noison EDP | Hương thơm hoa diên vĩ và hoa nhài, quý phái sang trọng",
      price: 200000,
      price_before_discount: 250000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
      quantity: 10,
      category: {
        _id: "1",
        name: "Gift",
      },
      rating: 4,
      sold: 10,
      view: 10,
      description: "description",
      images: [],
      createdAt: "2022-02-22T07:00:00.000Z",
      updatedAt: "2022-02-22T07:00:00.000Z",
    },
  },
  {
    buy_count: 2,
    createdAt: "2022-01-12T07:00:00.000Z",
    price: 500000,
    _id: "8",
    price_before_discount: 600000,
    status: 1 as TOrderHistoryStatus,
    updatedAt: "2022-01-12T07:00:00.000Z",
    product: {
      _id: "8",
      name: "Đồng hồ Casio MTP-V002L-1B3UDF",
      price: 250000,
      price_before_discount: 300000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
      quantity: 5,
      category: {
        _id: "4",
        name: "Accessories",
      },
      rating: 4.5,
      sold: 15,
      view: 30,
      description: "description",
      images: [],
      createdAt: "2022-01-12T07:00:00.000Z",
      updatedAt: "2022-01-12T07:00:00.000Z",
    },
  },

  // Status 2 orders
  {
    buy_count: 2,
    createdAt: "2022-03-15T07:00:00.000Z",
    price: 300000,
    _id: "4",
    price_before_discount: 350000,
    status: 2 as TOrderHistoryStatus,
    updatedAt: "2022-03-15T07:00:00.000Z",
    product: {
      _id: "4",
      name: "Sữa rửa mặt cho nam Nivea Men Deep Clean",
      price: 150000,
      price_before_discount: 175000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
      quantity: 20,
      category: {
        _id: "2",
        name: "Skincare",
      },
      rating: 5,
      sold: 50,
      view: 100,
      description: "description",
      images: [],
      createdAt: "2022-03-15T07:00:00.000Z",
      updatedAt: "2022-03-15T07:00:00.000Z",
    },
  },
  {
    buy_count: 3,
    createdAt: "2022-03-18T07:00:00.000Z",
    price: 450000,
    _id: "9",
    price_before_discount: 500000,
    status: 2 as TOrderHistoryStatus,
    updatedAt: "2022-03-18T07:00:00.000Z",
    product: {
      _id: "9",
      name: "Kem dưỡng ẩm CeraVe Moisturizing Cream",
      price: 150000,
      price_before_discount: 175000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
      quantity: 25,
      category: {
        _id: "2",
        name: "Skincare",
      },
      rating: 4.7,
      sold: 60,
      view: 120,
      description: "description",
      images: [],
      createdAt: "2022-03-18T07:00:00.000Z",
      updatedAt: "2022-03-18T07:00:00.000Z",
    },
  },
  {
    buy_count: 1,
    createdAt: "2022-04-01T07:00:00.000Z",
    price: 100000,
    _id: "10",
    price_before_discount: 120000,
    status: 2 as TOrderHistoryStatus,
    updatedAt: "2022-04-01T07:00:00.000Z",
    product: {
      _id: "10",
      name: "Mặt nạ ngủ Laneige Water Sleeping Mask",
      price: 100000,
      price_before_discount: 120000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
      quantity: 50,
      category: {
        _id: "2",
        name: "Skincare",
      },
      rating: 4.8,
      sold: 80,
      view: 150,
      description: "description",
      images: [],
      createdAt: "2022-04-01T07:00:00.000Z",
      updatedAt: "2022-04-01T07:00:00.000Z",
    },
  },

  // Status 3 orders
  {
    buy_count: 1,
    createdAt: "2022-04-10T07:00:00.000Z",
    price: 120000,
    _id: "5",
    price_before_discount: 150000,
    status: 3 as TOrderHistoryStatus,
    updatedAt: "2022-04-10T07:00:00.000Z",
    product: {
      _id: "5",
      name: "Kem chống nắng La Roche-Posay Anthelios",
      price: 120000,
      price_before_discount: 150000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
      quantity: 30,
      category: {
        _id: "2",
        name: "Skincare",
      },
      rating: 4.5,
      sold: 70,
      view: 200,
      description: "description",
      images: [],
      createdAt: "2022-04-10T07:00:00.000Z",
      updatedAt: "2022-04-10T07:00:00.000Z",
    },
  },

  {
    buy_count: 1,
    createdAt: "2022-05-05T07:00:00.000Z",
    price: 180000,
    _id: "12",
    price_before_discount: 200000,
    status: 3 as TOrderHistoryStatus,
    updatedAt: "2022-05-05T07:00:00.000Z",
    product: {
      _id: "12",
      name: "Kem dưỡng ẩm Clinique Moisture Surge",
      price: 180000,
      price_before_discount: 200000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
      quantity: 20,
      category: {
        _id: "2",
        name: "Skincare",
      },
      rating: 4.9,
      sold: 40,
      view: 180,
      description: "description",
      images: [],
      createdAt: "2022-05-05T07:00:00.000Z",
      updatedAt: "2022-05-05T07:00:00.000Z",
    },
  },

  // Status 4 orders
  {
    buy_count: 3,
    createdAt: "2022-05-20T07:00:00.000Z",
    price: 450000,
    _id: "6",
    price_before_discount: 500000,
    status: 4 as TOrderHistoryStatus,
    updatedAt: "2022-05-20T07:00:00.000Z",
    product: {
      _id: "6",
      name: "Máy cạo râu Philips",
      price: 150000,
      price_before_discount: 175000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
      quantity: 15,
      category: {
        _id: "3",
        name: "Electronics",
      },
      rating: 4.8,
      sold: 30,
      view: 300,
      description: "description",
      images: [],
      createdAt: "2022-05-20T07:00:00.000Z",
      updatedAt: "2022-05-20T07:00:00.000Z",
    },
  },
  {
    buy_count: 1,
    createdAt: "2022-06-15T07:00:00.000Z",
    price: 800000,
    _id: "13",
    price_before_discount: 900000,
    status: 4 as TOrderHistoryStatus,
    updatedAt: "2022-06-15T07:00:00.000Z",
    product: {
      _id: "13",
      name: "Laptop Dell Inspiron 3501",
      price: 800000,
      price_before_discount: 900000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
      quantity: 5,
      category: {
        _id: "3",
        name: "Electronics",
      },
      rating: 4.7,
      sold: 10,
      view: 150,
      description: "description",
      images: [],
      createdAt: "2022-06-15T07:00:00.000Z",
      updatedAt: "2022-06-15T07:00:00.000Z",
    },
  },
  {
    buy_count: 2,
    createdAt: "2022-07-01T07:00:00.000Z",
    price: 500000,
    _id: "14",
    price_before_discount: 600000,
    status: 4 as TOrderHistoryStatus,
    updatedAt: "2022-07-01T07:00:00.000Z",
    product: {
      _id: "14",
      name: "Máy ép trái cây Philips HR1832",
      price: 250000,
      price_before_discount: 300000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
      quantity: 10,
      category: {
        _id: "3",
        name: "Electronics",
      },
      rating: 4.6,
      sold: 20,
      view: 200,
      description: "description",
      images: [],
      createdAt: "2022-07-01T07:00:00.000Z",
      updatedAt: "2022-07-01T07:00:00.000Z",
    },
  },

  // Status 5 orders
  {
    buy_count: 1,
    createdAt: "2022-06-05T07:00:00.000Z",
    price: 200000,
    _id: "7",
    price_before_discount: 250000,
    status: 5 as TOrderHistoryStatus,
    updatedAt: "2022-06-05T07:00:00.000Z",
    product: {
      _id: "7",
      name: "Tai nghe Bluetooth Sony WH-1000XM4",
      price: 200000,
      price_before_discount: 250000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
      quantity: 5,
      category: {
        _id: "3",
        name: "Electronics",
      },
      rating: 4.9,
      sold: 20,
      view: 500,
      description: "description",
      images: [],
      createdAt: "2022-06-05T07:00:00.000Z",
      updatedAt: "2022-06-05T07:00:00.000Z",
    },
  },
  {
    buy_count: 2,
    createdAt: "2022-07-20T07:00:00.000Z",
    price: 800000,
    _id: "15",
    price_before_discount: 900000,
    status: 5 as TOrderHistoryStatus,
    updatedAt: "2022-07-20T07:00:00.000Z",
    product: {
      _id: "15",
      name: "Bàn phím cơ Logitech G Pro",
      price: 400000,
      price_before_discount: 450000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
      quantity: 10,
      category: {
        _id: "3",
        name: "Electronics",
      },
      rating: 4.8,
      sold: 30,
      view: 300,
      description: "description",
      images: [],
      createdAt: "2022-07-20T07:00:00.000Z",
      updatedAt: "2022-07-20T07:00:00.000Z",
    },
  },
  {
    buy_count: 3,
    createdAt: "2022-08-05T07:00:00.000Z",
    price: 600000,
    _id: "16",
    price_before_discount: 700000,
    status: 5 as TOrderHistoryStatus,
    updatedAt: "2022-08-05T07:00:00.000Z",
    product: {
      _id: "16",
      name: "Chuột gaming Razer DeathAdder V2",
      price: 200000,
      price_before_discount: 250000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ll86dohx6hmefa_tn",
      quantity: 15,
      category: {
        _id: "3",
        name: "Electronics",
      },
      rating: 4.9,
      sold: 40,
      view: 400,
      description: "description",
      images: [],
      createdAt: "2022-08-05T07:00:00.000Z",
      updatedAt: "2022-08-05T07:00:00.000Z",
    },
  },
];