import { HTTP_CLIENT } from "../utils/axiosClient";

const handlePlayersData = async (page: any, limit: any) => {
  return await HTTP_CLIENT.get(`/players?page=${page}&limit=${limit}`);
};
export { handlePlayersData };
