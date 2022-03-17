import { HTTP_CLIENT } from "../utils/axiosClient";

const getTokensData = async () => {
  return await HTTP_CLIENT.get("/native-token/get-all-native-tokens");
};

const getNFTData = async () => {
  return await HTTP_CLIENT.get("/nft-token");
};

const getNativeWalletsData = async () => {
  return await HTTP_CLIENT.get("/native-wallet/all-native-wallets");
};

const createNewToken = async (params: any) => {
  return await HTTP_CLIENT.post("/native-token/createNewToken", params);
};

const updateToken = async (params: any) => {
  return await HTTP_CLIENT.post("/native-token/updateToken", params);
};
const updateNFT = async (params: any) => {
  return await HTTP_CLIENT.put("/update-nft-token", params);
};
export {
  getTokensData,
  getNativeWalletsData,
  createNewToken,
  updateToken,
  getNFTData,
  updateNFT,
};
