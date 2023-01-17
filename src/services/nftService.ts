import { HTTP_CLIENT } from "../utils/axiosClient";

const handleNftData = async (page: any, limit: any, searchText: string) => {
  return await HTTP_CLIENT.get(
    `/nft/list-all-for-admin?page=${page}&limit=${limit}&name=${searchText}`
  );
};
const updateNftValue = async (playerId: any, params: any) => {
  return await HTTP_CLIENT.put(`/nft/${playerId}`, params);
};
export { handleNftData, updateNftValue };
