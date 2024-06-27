import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/swiper.min.css";
import App from "./App";
import { DataSourceContextProvider } from "./contexts";
import { AuthProvider } from "./contexts/auth.context";
import { CartProvider } from "./contexts/cart.context";
import { OrderProvider } from "./contexts/order.context";
import "./index.css";
import "./components/old/GlobalStyles/GlobalStyles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <AuthProvider>
          <DataSourceContextProvider>
            <CartProvider>
              <OrderProvider>
                <App />
              </OrderProvider>
            </CartProvider>
          </DataSourceContextProvider>
          <ToastContainer />
        </AuthProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
