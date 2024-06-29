import { TAddress } from "src/types/user.types";
import axiosClient from "./config";

const userApi = {
  addAddress: (body: TAddress) => axiosClient.post("/users/add-address", body),
  updateAddress: (body: TAddress) => axiosClient.post("/users/address", body),
  updateAddressDefault: (addressId: string) => axiosClient.put(`/users/update-address-default/${addressId}`),
};

export default userApi;
