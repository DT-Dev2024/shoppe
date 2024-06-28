import { TAddress } from "src/types/user.types";
import axiosClient from "./config";

const userApi = {
  updateProfile: (body: TAddress) => axiosClient.put("/user/udpate-address", body),
};

export default userApi;
