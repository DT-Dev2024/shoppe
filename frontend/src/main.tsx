import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "swiper/swiper.min.css";
import App from "./App";
import { AuthProvider } from "./contexts/auth.context";
import { CartProvider } from "./contexts/cart.context";
import "./index.css";
import { DataSourceContextProvider } from "./contexts";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <AuthProvider>
          <DataSourceContextProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </DataSourceContextProvider>
          <ToastContainer />
        </AuthProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
