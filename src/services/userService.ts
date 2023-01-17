import { HTTP_CLIENT } from "../utils/axiosClient";

const handleUserLogin = async (params: any) => {
  return await HTTP_CLIENT.post("/admin-auth/login", params);
};
const getWalletData = async () => {
  return await HTTP_CLIENT.get("/admin-wallet");
};

const getAllUsers = async (page: number, searchText?: string | number, type?: any) => {
  return await HTTP_CLIENT.get(`/user/get-all-users?page=${page ? page : 1}&keyword=${searchText ? searchText : ""}&type=${type}`);
};

const changePassword = async (params: any) => {
  return await HTTP_CLIENT.post("/admin-auth/change-password", params);
};
const twoFaAuth = async (params: any) => {
  return await HTTP_CLIENT.post("/2fa/authenticate", params);
};
const generateTwoFa = async () => {
  return await HTTP_CLIENT.post("/2fa/generate");
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
  return await HTTP_CLIENT.get("/admin-auth/verify-jwt");
};

const handleSettingsData = async (params: any) => {
  console.log(
    "🚀 ~ file: userService.ts:56 ~ handleSettingsData ~ params",
    params
  );
  return await HTTP_CLIENT.post("/settings", params);
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
  generateTwoFa,
  twoFaAuth,
  handleSettingsData,
};
