import { HTTP_CLIENT } from "../utils/axiosClient";

const handleNftData = async (page: any, limit: any, searchText: string) => {
  return await HTTP_CLIENT.get(
    `/nft/list-all-for-admin?page=${page}&limit=${limit}&name=${searchText}`
  );
};
const updateNftValue = async (playerId: any, params: any) => {
  return await HTTP_CLIENT.put(`/nft/${playerId}`, params);
};
const burnNftList = async (page: number, limit: number) => {
  return await HTTP_CLIENT.get(`/burn-request?page=${page}&limit=${limit}`);
};
const nftBurnRequest = async (id: number, param: any) => {
  return await HTTP_CLIENT.put(`/burn-request/${id}/change-status`, param);
};
export { handleNftData, updateNftValue, burnNftList, nftBurnRequest };
