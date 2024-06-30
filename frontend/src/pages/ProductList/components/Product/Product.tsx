import { Link } from "react-router-dom";
import ProductRating from "src/components/ProductRating";
import { TProduct } from "src/types/product.type";
import { formatCurrency, formatNumberToSocialStyle } from "src/utils/formatNumber";
type ProductProps = {
  product: TProduct;
};
const Product = ({ product }: ProductProps) => {
  return (
    <Link to={`/productDetails/${product.id}`}>
      <div className="overflow-hidden rounded-sm bg-white shadow transition-all duration-200 hover:translate-y-[-0.09rem] hover:shadow-md">
        <div className="relative w-full pt-[100%]">
          <img
            src={product.image}
            alt={product.name}
            className="absolute left-0 top-0 h-full w-full bg-white object-cover"
          />
        </div>
        <div className="overflow-hidden p-2">
          <div className="line-clamp-2 min-h-[2rem] text-[14px]">{product.name}</div>
          <div className="mt-3 flex items-center gap-x-1">
            {product.sale_price !== 0 ? (
              <>
                <div className="text-[12px] text-gray-500 line-through">
                  <span className="text-[12px]">₫</span>
                  <span>{formatCurrency(product.price)}</span>
                </div>
                <div className="rounded-sm bg-red-500 px-1 text-[14px] text-white">
                  ₫{formatCurrency((product.price * (100 - product.sale_price)) / 100)}
                </div>
              </>
            ) : (
              <div className="text-[12px]">
                <span className="text-[12px]">₫</span>
                <span>{formatCurrency(product.price)}</span>
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between gap-x-2">
            <ProductRating
              rating={product.product_feeback.star ?? 0}
              activeClassName="w-3 h-3 fill-[#ffca11] text-[#ffca11]"
              nonActiveClassName="w-3 h-3 fill-gray-300 text-gray-300"
            ></ProductRating>
            <div className="flex gap-x-1 text-[11px]">
              <span>{formatNumberToSocialStyle(product.product_feeback.sold ?? 0)}</span>
              <span>Đã bán</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Product;
