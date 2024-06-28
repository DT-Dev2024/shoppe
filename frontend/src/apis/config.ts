import axios from "axios";
import queryString from "query-string";

const API = "http://103.72.99.224:3000/api/";

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
