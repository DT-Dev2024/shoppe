/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import useQueryConfig from "src/hooks/useQueryConfig";
import { TProductListConfig } from "src/types/product.type";

const ProductList = () => {
  const queryConfig = useQueryConfig();
  const [productsData, setProductsData] = useState(null);
  const [categoriesData, setCategoriesData] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [queryConfig]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/products`, {
        params: queryConfig as TProductListConfig,
      });
      setProductsData(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/categories`);
      setCategoriesData(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="bg-gray-200 py-6">
      <Helmet>
        <title>Shopee At Home | Trang chủ</title>
        <meta
          name="description"
          content="A shopee clone edition used for studying purposes"
          data-react-helmet="true"
        />
      </Helmet>
      <div className="container">
        {productsData && (
          <div className="gap-6 md:grid md:grid-cols-12">
            <div className="block w-full md:col-span-3">
              {/* <AsideFilter
                queryConfig={queryConfig}
                categories={categoriesData.data.data || []}
              /> */}
            </div>
            <div className="block w-full md:col-span-9">
              {/* <SortProductList
                queryConfig={queryConfig}
                pageSize={productsData.data.pagination.page_size}
              /> */}
              {/* <div className="grid grid-cols-2 gap-3 mt-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {productsData.data.products.map((product) => (
                  <div
                    className="col-span-1"
                    key={product._id}
                  >
                    <Product product={product}></Product>
                  </div>
                ))}
              </div> */}
              {/* <Pagination
                queryConfig={queryConfig}
                pageSize={productsData.data.pagination.page_size}
              /> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
