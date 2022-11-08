import { HTTP_CLIENT } from "../utils/axiosClient";

const uploadImage = async (params: any) => {
  return await HTTP_CLIENT.post("/storage/admin/upload", params);
};

const uploadUserCsv = async (params: any) => {
  return await HTTP_CLIENT.post("/admin-import/import-data", params);
};

const getMasterAddressBalances = async () => {
  return await HTTP_CLIENT.get("/wallet/get-master-wallet-balances");
};
const getWalletLogs = async () => {
  return await HTTP_CLIENT.get("/admin-wallet/logs");
};

export { uploadImage, uploadUserCsv, getMasterAddressBalances, getWalletLogs };
