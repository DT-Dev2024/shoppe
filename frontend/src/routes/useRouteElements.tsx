import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";
import { LoadingPage } from "src/components/Loading/Loading";
import { path } from "src/constants/path.enum";
import { IDataSource } from "src/contexts";
import { AuthContext } from "src/contexts/auth.context";
import { useDataSourceContext } from "src/hooks/hookHome";
import AuthenticationLayout from "src/layouts/AuthenticationLayout";
import CartLayout from "src/layouts/CartLayout";
import MainLayout from "src/layouts/MainLayout";
import UserLayout from "src/layouts/UserLayout";
import Home from "src/pages/Home";

const Login = lazy(() => import("src/pages/Login"));
const Cart = lazy(() => import("src/pages/Cart"));
const NotFound = lazy(() => import("src/pages/NotFound"));
const ProductDetails = lazy(() => import("src/pages/ProductDetails"));
const OrderHistory = lazy(() => import("src/pages/User/pages/OrderHistory"));
const Profile = lazy(() => import("src/pages/User/pages/Profile"));

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
          path: path.productDetail,
          element: (
            <Suspense>
              <ProductDetails />
            </Suspense>
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
          path: path.user,
          element: <UserLayout />,
          children: [
            {
              path: path.profile,
              element: (
                <Suspense>
                  <Profile />
                </Suspense>
              ),
            },
            {
              path: path.orderHistory,
              element: (
                <Suspense>
                  <OrderHistory />
                </Suspense>
              ),
            },
          ],
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
