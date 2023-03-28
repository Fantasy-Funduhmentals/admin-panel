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
const ImportOdds = async (params: any) => {
  return await HTTP_CLIENT.post("/admin-import/import-odds", params);
};
const getScoreData = async (
  dropDownValue: any,
  limit: number,
  page: number
) => {
  return await HTTP_CLIENT.get(
    `/scores?upcoming=${dropDownValue}&page=${page}&limit=${limit}`
  );
};

export {
  uploadImage,
  uploadUserCsv,
  getMasterAddressBalances,
  getWalletLogs,
  getScoreData,
  ImportOdds,
};
