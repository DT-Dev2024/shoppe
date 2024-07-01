import axios from "axios";
import queryString from "query-string";

const API = import.meta.env.VITE_SERVER_URL + "/";

const axiosClient = axios.create({
  baseURL: API,
  headers: {
    "content-type": "application/json",
    Accept: "application/json",
  },

  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
  (config) => {
    const getLocalToken = localStorage.getItem("access_token") || "";
    if (getLocalToken !== null) {
      config.headers.Authorization = `Bearer ${getLocalToken}`;
    }
    return config;
  },
  function error() {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    throw error;
  },
);
export default axiosClient;
