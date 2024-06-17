import { apiCaller } from "@configs/apiCaller";

const getAllUsers = async () => {
  const path = "/user";
  const response = await apiCaller("GET", path);
  return response;
};

export { getAllUsers };
