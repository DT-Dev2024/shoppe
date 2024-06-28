import axiosClient from "./config";

export enum AUTH_ENUM {
  URL_LOGIN = "auth/login",
}

const loginAccount = async (body: { phone: string }) => {
  const rs = await axiosClient.post(AUTH_ENUM.URL_LOGIN, body);
  return rs;
};

export { loginAccount };
