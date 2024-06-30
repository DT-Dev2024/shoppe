import Cookie from "js-cookie";
import { create } from "apisauce";
import queryString from "query-string";
import swal from "sweetalert";
import R from "../component/assets";
import reactotron from "../ReactotronConfig";
import Cookies from "js-cookie";
import { SESSION } from "../config/constants";

export const BASE_URL_DEV = process.env.REACT_APP_BASE_API_URL as string;
export const URL_IMAGE = process.env.REACT_APP_BASE_IMAGE_URL as string;

// export const BASE_URL_DEV = "https://api.targeet.site";
// export const URL_IMAGE = "http://51.79.226.175:3005";
// console.log("BASE_URL_DEV", BASE_URL_DEV);

const createAPI = () => {
  const APIInstant = create({
    baseURL: BASE_URL_DEV,
    timeout: 20000,
    headers: {
      "Content-Type": "application/json",
    },
  });
  APIInstant.axiosInstance.interceptors.request.use(
    async (config) => {
      config.headers.token = Cookie.get(SESSION);
      config.headers.Authorization = `Bearer ${Cookie.get(SESSION)}`;
      return config;
    },
    (error) => Promise.reject(error)
  );
  APIInstant.axiosInstance.interceptors.response.use(
    (response) => {
      const data = response.data;
      // if (data && !data?.token) {
      //   reactotron.logImportant!("DATA", data);
      //   if (data.code === 401 || data.code === 402 || data.code === 403) {
      //     swal({
      //       title: R.strings().fail_request,
      //       text: data?.message || R.strings().error_network,
      //       icon: "error",
      //     }).then(function (isConfirm) {
      //       if (isConfirm) {
      //         Cookie.set("session", "");
      //         localStorage.setItem("token", "");
      //         window.location.reload();
      //       }
      //     });
      //   } else {
      //     swal({
      //       title: R.strings().fail_request,
      //       text: data?.message || R.strings().error_network,
      //       icon: "error",
      //     });
      //   }
      // }

      return response;
    },
    // handle error
    async (error: any) => {
      const data = error?.response?.data;
      reactotron.logImportant!("DATA", data);
      swal({
        title: R.strings().fail_request,
        text: data?.message || R.strings().error_network,
        icon: "error",
      });
      if (error?.response?.data?.code === 401) Cookies.set(SESSION, "");
      return error;
    }
  );
  return APIInstant;
};
const axiosInstance = createAPI();

/* Support function */
function handleResult(api: any) {
  return api.then((res: { data: { status: number; code: number } }) => {
    if (res?.data?.code == 401) {
      swal({
        title: R.strings().fail_request,
        text: "Phiên đăng nhập hết hạn! Vui lòng đăng nhập lại.",
        icon: "error",
      });
      return Promise.reject(res?.data);
    }
    return Promise.resolve(res?.data);
  });
}

function parseUrl(url: string, query: any) {
  return queryString.stringifyUrl({ url: url, query });
}

export const ApiClient = {
  get: (url: string, payload?: any) =>
    handleResult(axiosInstance.get(parseUrl(url, payload))),
  post: (url: string, payload?: any) =>
    handleResult(axiosInstance.post(url, payload)),
  put: (url: string, payload?: any) =>
    handleResult(axiosInstance.put(url, payload)),
  patch: (url: string, payload?: any) =>
    handleResult(axiosInstance.patch(url, payload)),
  delete: (url: string, payload?: any) =>
    handleResult(axiosInstance.delete(url, {}, { data: payload })),
};

export default axiosInstance;
