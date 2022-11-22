import { HTTP_CLIENT } from "../utils/axiosClient";

const handlePlayersData = async (page: any, limit: any) => {
  return await HTTP_CLIENT.get(`/players?page=${page}&limit=${limit}`);
};
const updatePlayerValue = async (playerId: any, params: any) => {
  return await HTTP_CLIENT.put(`/players/${playerId}/update-value`, params);
};
export { handlePlayersData, updatePlayerValue };
