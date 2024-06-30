export type TProduct = {
  image: string;
  detailImage: string[];
  name: string;
  description: string;
  price: number;
  sale_price: number;
  feedback: TFeedback;
  created_at?: string;
};

export type TFeedback = {
  star: number;
  comment: number;
  sold: number;
};
