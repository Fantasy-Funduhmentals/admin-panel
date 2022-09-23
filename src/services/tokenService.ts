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
const directWireData = async (page: number, searchText?: string | number) => {
  return await HTTP_CLIENT.get(`/direct-wires/all-pending-wires?page=${page ? page : 1}&keyword=${searchText ? searchText : ""}`);
};

const singleDirectWire = async (id: number | string) => {
  return await HTTP_CLIENT.get(`/direct-wires?id=${id}`)
}

const completedDirectWireData = async (page: number, searchText?: string | number) => {
  return await HTTP_CLIENT.get(`/direct-wires/all-wires?page=${page ? page : 1}&keyword=${searchText ? searchText : ""}`);
};

const getNewsLetter = async () => {
  return await HTTP_CLIENT.get("/newsletter");
};

const getAdminUserData = async () => {
  return await HTTP_CLIENT.get("/admin-auth/getAllSubAdmins");
};

const getNativeWalletsData = async (page: number, searchText?: string | number) => {
  return await HTTP_CLIENT.get(`/native-wallet/all-native-wallets?page=${page ? page : 1}&keyword=${searchText ? searchText : ""}`);
};
const getAllNativeWalletsData = async () => {
  return await HTTP_CLIENT.get("/native-token/get-all-native-tokens");
};

const getNFTBalanceData = async (page: number, searchText?: string | number) => {
  return await HTTP_CLIENT.get(`/nft-wallet/all-nft-wallets?page=${page ? page : 1}&keyword=${searchText ? searchText : ""}`);
};
const directWiresPost = async (data) => {
  return await HTTP_CLIENT.post("direct-wires/handle-wire", data);
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
  getAdminUserData,
  getNewsLetter,
  updateNFT,
  getNFTBalanceData,
  getSubscriptionData,
  updateSubscription,
  createSubscription,
  deleteSubscription,
  getAllNativeWalletsData,
  directWireData,
  directWiresPost,
  completedDirectWireData,
  singleDirectWire
};
