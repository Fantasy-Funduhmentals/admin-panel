import { HTTP_CLIENT } from "../utils/axiosClient";

const handleBetaData = async (page: any, limit: any) => {
  return await HTTP_CLIENT.get(`/close-beta?page=${page}&limit=${limit}`);
};

export { handleBetaData };
