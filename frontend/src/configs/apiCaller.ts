import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

export const apiCaller = (method: string, path: string, data?: unknown) => {
  return axiosPublic({
    method,
    headers: {
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Origin": "*",
    },
    url: `${path}`,
    data,
  });
};

export default apiCaller;
