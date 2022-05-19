import { HTTP_CLIENT } from "../utils/axiosClient";

const getTokensData = async () => {
  return await HTTP_CLIENT.get("/native-token/get-all-native-tokens");
};

const getSubscriptionData = async () => {
  return await HTTP_CLIENT.get("/package");
};

const getNFTData = async () => {
  return await HTTP_CLIENT.get("/nft-token");
};
const directWireData = async () => {
  return await HTTP_CLIENT.get("/direct-wires/all-pending-wires");
};

const getNewsLetter = async () => {
  return await HTTP_CLIENT.get("/newsletter");
};

const getNativeWalletsData = async () => {
  return await HTTP_CLIENT.get("/native-wallet/all-native-wallets");
};
const getAllNativeWalletsData = async () => {
  return await HTTP_CLIENT.get("/native-token/get-all-native-tokens");
};

const getNFTBalanceData = async () => {
  return await HTTP_CLIENT.get("/nft-wallet/all-nft-wallets");
};

const createNewToken = async (params: any) => {
  return await HTTP_CLIENT.post("/native-token/createNewToken", params);
};

const createSubscription = async (params: any) => {
  return await HTTP_CLIENT.post("/package", params);
};

const updateToken = async (params: any) => {
  return await HTTP_CLIENT.post("/native-token/updateToken", params);
};

const updateSubscription = async (params: any) => {
  return await HTTP_CLIENT.put("/package", params);
};
const updateNFT = async (params: any) => {
  return await HTTP_CLIENT.post("/nft-token/update-nft-token", params);
};

const deleteSubscription = async (params: any) => {
  return await HTTP_CLIENT.delete(`/package/${params._id}`);
};
export {
  getTokensData,
  getNativeWalletsData,
  createNewToken,
  updateToken,
  getNFTData,
  getNewsLetter,
  updateNFT,
  getNFTBalanceData,
  getSubscriptionData,
  updateSubscription,
  createSubscription,
  deleteSubscription,
  getAllNativeWalletsData,
  directWireData
};
