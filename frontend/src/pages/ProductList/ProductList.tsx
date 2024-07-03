/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import productApi from "src/apis/product.api";
import useQueryConfig from "src/hooks/useQueryConfig";
import { TProduct, TProductList, TProductListConfig } from "src/types/product.type";
import Product from "./components/Product";

const ProductList = () => {
  const queryConfig = useQueryConfig();
  const [productsData, setProductsData] = useState<TProduct[]>([]);
  const [categoriesData, setCategoriesData] = useState(null);

  useEffect(() => {
    fetchProducts();
    // fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productApi.getProducts();
      setProductsData(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="bg-gray-100 py-6">
      <Helmet>
        <title>Sản phẩm</title>
        <meta
          name="description"
          content="A shopee clone edition used for studying purposes"
          data-react-helmet="true"
        />
      </Helmet>
      <div className="mx-auto  px-4 lg:w-[120rem] lg:px-0">
        {productsData && (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-5">
            {productsData.map((product) => (
              <div
                className="col-span-1"
                key={product.id}
              >
                <Product product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
