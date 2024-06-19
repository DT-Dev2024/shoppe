import { QueryClient } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "swiper/swiper.min.css";
import { DataSourceContextProvider, ModalStatusContextProvider } from "./contexts";
import "./index.css";
import Home from "./pages/Home";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <AuthProvider>
            <CartProvider>

              <Home />
            </CartProvider>
            <ToastContainer></ToastContainer>
          </AuthProvider>
        </HelmetProvider>
        <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
      </QueryClientProvider>
    </BrowserRouter> */}
    <DataSourceContextProvider>
      <ModalStatusContextProvider>
        <Home />
      </ModalStatusContextProvider>
    </DataSourceContextProvider>
  </React.StrictMode>,
);
