import { HTTP_CLIENT } from "../utils/axiosClient";

const handleUserLogin = async (params: any) => {
  return await HTTP_CLIENT.post("/admin-auth/login", params);
};

const getAllUsers = async () => {
  return await HTTP_CLIENT.get("/user/get-all-users");
};
const getSwapRate = async () => {
  return await HTTP_CLIENT.get("/settings");
};

const changePassword = async (params: any) => {
  return await HTTP_CLIENT.post("/admin-auth/change-password", params);
};
const directWireAccountDetails = async (params: any) => {
  return await HTTP_CLIENT.post("settings/admin/update-bank-details", params);
};

const swapFee = async (params: any) => {
  return await HTTP_CLIENT.post("/settings/admin/update-swap-rate", params);
};

const createNewUser = async (params: any) => {
  return await HTTP_CLIENT.post("/auth/admin-create-user", params);
};

export { handleUserLogin, getAllUsers, changePassword, createNewUser, swapFee, getSwapRate,directWireAccountDetails };
