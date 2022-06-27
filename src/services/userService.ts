import { HTTP_CLIENT } from "../utils/axiosClient";

const handleUserLogin = async (params: any) => {
  return await HTTP_CLIENT.post("/admin-auth/login", params);
};
const getWalletData = async () => {
  return await HTTP_CLIENT.get("/admin-wallet");
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
const getGraphData = async (params: any) => {
  return await HTTP_CLIENT.get("/admin-stats/getAdminStats");
};

const swapFee = async (params: any) => {
  return await HTTP_CLIENT.post("/settings/admin/update-swap-rate", params);
};
const getMaintenanceMode = async () => {
  return await HTTP_CLIENT.get("/settings/maintenance");
};

const createNewUser = async (params: any) => {
  return await HTTP_CLIENT.post("/auth/admin-create-user", params);
};

const createSubAdminUser = async (params: any) => {
  return await HTTP_CLIENT.post("/admin-auth/register-subAdmin", params);
};

const handleBlock = async (params: any) => {
  return await HTTP_CLIENT.post("/user/block-user", params);
};

const handleBlockSubAdmin = async (params: any) => {
  return await HTTP_CLIENT.post("/admin-auth/block-subAdmin", params);
};

export {
  handleUserLogin,
  handleBlockSubAdmin,
  getAllUsers,
  changePassword,
  createSubAdminUser,
  createNewUser,
  handleBlock,
  swapFee,
  getSwapRate,
  directWireAccountDetails,
  getMaintenanceMode,
  getGraphData,
  getWalletData,
};
