import { HTTP_CLIENT } from "../utils/axiosClient";

const handleTeamsData = async (page: any, limit: any) => {
  return await HTTP_CLIENT.get(`/teams?page=${page}&limit=${limit}`);
};
export { handleTeamsData };
