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

const changePassword = async (params: any) => {
  return await HTTP_CLIENT.post("/admin-auth/change-password", params);
};

const getGraphData = async (params: any) => {
  return await HTTP_CLIENT.get("/admin-stats/getAdminStats");
};

const getMaintenanceMode = async () => {
  return await HTTP_CLIENT.get("/settings/maintenance");
};
const getUserInfo = async () => {
  return await HTTP_CLIENT.get("/admin-auth/info");
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
const handleUserJwt = async () => {
  return await HTTP_CLIENT.get("/auth/verify-jwt");
};

export {
  handleUserLogin,
  handleBlockSubAdmin,
  getAllUsers,
  changePassword,
  createSubAdminUser,
  createNewUser,
  handleBlock,
  getMaintenanceMode,
  getGraphData,
  getWalletData,
  getUserInfo,
  handleUserJwt,
};
