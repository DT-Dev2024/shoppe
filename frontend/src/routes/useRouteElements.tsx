import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { LoadingPage } from "src/components/Loading/Loading";
import { path } from "src/constants/path.enum";
import { IDataSource } from "src/contexts";
import { AuthContext } from "src/contexts/auth.context";
import { useDataSourceContext } from "src/hooks/hookHome";
import AuthenticationLayout from "src/layouts/AuthenticationLayout";
import CartLayout from "src/layouts/CartLayout";
import CheckoutLayout from "src/layouts/CheckoutLayout";
import MainLayout from "src/layouts/MainLayout";
import OrderHistoryDetailsLayout from "src/layouts/OrderHistoryDetailsLayout";
import ProductDetailsLayout from "src/layouts/ProductDetailsLayout";
import ProductListLayout from "src/layouts/ProductListLayout";
import UserLayout from "src/layouts/UserLayout";
import Home from "src/pages/Home";
import OrderHistoryDetails from "src/pages/OrderHistoryDetails";

const Login = lazy(() => import("src/pages/Login"));
const Cart = lazy(() => import("src/pages/Cart"));
const NotFound = lazy(() => import("src/pages/NotFound"));
const ProductDetails = lazy(() => import("src/pages/ProductDetails"));
const OrderHistory = lazy(() => import("src/pages/User/pages/OrderHistory"));
const Checkout = lazy(() => import("src/pages/Checkout"));
const ProductList = lazy(() => import("src/pages/ProductList"));

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Outlet></Outlet> : <Navigate to={path.login}></Navigate>;
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AuthContext);
  return !isAuthenticated ? <Outlet></Outlet> : <Navigate to={path.home}></Navigate>;
}
function areAllArraysNotEmpty(dataSource: IDataSource): boolean {
  return Object.values(dataSource).every((value) => !Array.isArray(value) || value.length > 0);
}

function LoadingHome() {
  const [isReady, setIsReady] = useState(false);
  const dataSourceContext = useDataSourceContext();
  useEffect(() => {
    if (dataSourceContext && areAllArraysNotEmpty(dataSourceContext)) {
      setIsReady(true);
    }
  }, [dataSourceContext]);

  return isReady ? <Home /> : <LoadingPage />;
}

export default function useRoutesElement() {
  const routeElements = useRoutes([
    {
      path: "",
      element: (
        <Suspense>
          <MainLayout />
        </Suspense>
      ),
      children: [
        {
          path: path.home,
          index: true,
          element: (
            <Suspense fallback={<LoadingPage />}>
              <LoadingHome />
            </Suspense>
          ),
        },
        {
          path: path.productList,
          element: (
            <ProductListLayout>
              <Suspense>
                <ProductList />
              </Suspense>
            </ProductListLayout>
          ),
        },
        {
          path: `${path.productDetail}/:id`,
          element: (
            <ProductDetailsLayout>
              <Suspense>
                <ProductDetails />
              </Suspense>
            </ProductDetailsLayout>
          ),
        },
        {
          path: "*",
          element: (
            <Suspense>
              <NotFound />
            </Suspense>
          ),
        },
      ],
    },

    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </CartLayout>
          ),
        },
        {
          path: path.checkout,
          element: (
            <CheckoutLayout>
              <Suspense>
                <Checkout />
              </Suspense>
            </CheckoutLayout>
          ),
        },
        {
          path: path.orderHistory,
          element: (
            <UserLayout>
              <Suspense>
                <OrderHistory />
              </Suspense>
            </UserLayout>
          ),
        },
        {
          path: `${path.orderHistory}/:id`,
          element: (
            <OrderHistoryDetailsLayout>
              <Suspense>
                <OrderHistoryDetails />
              </Suspense>
            </OrderHistoryDetailsLayout>
          ),
        },
      ],
    },
    {
      path: "",
      element: <RejectedRoute />,
      children: [
        {
          path: "",
          element: <AuthenticationLayout />,
          children: [
            {
              path: path.login,
              element: (
                <Suspense>
                  <Login />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
  ]);
  return routeElements;
}
