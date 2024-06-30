import axiosClient from "./config";

// API endpoints
const API1_URL = "https://61bc99f0d8542f001782486b.mockapi.io/api/1";
const API2_URL = "https://61bc99f0d8542f001782486b.mockapi.io/api/2";
const API3_URL = "https://61bc99f0d8542f001782486b.mockapi.io/api/3";
const API4_URL = "https://61bc99f0d8542f001782486b.mockapi.io/api/4";
const API = import.meta.env.VITE_SERVER_URL;

const api = {
  // [GET]
  get: async (path: string) => {
    const result = await axiosClient.get(path);
    return result.data;
  },

  // [POST]
  post: (postData: unknown) => {
    axiosClient.post("/", postData, {
      headers: {
        "x-access-token": "token-value",
      },
    });
  },
};

export { API1_URL, API2_URL, API3_URL, API4_URL, api, API };
