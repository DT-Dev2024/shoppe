import axiosClient from "./config";

export enum AUTH_ENUM {
  URL_LOGIN = "auth/login",
}

const getAllVouchers = async () => {
  const rs = await axiosClient.get("voucher");
  return rs;
};

export { getAllVouchers };
