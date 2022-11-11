import { HTTP_CLIENT } from "../utils/axiosClient";

const handleNewsData = async (page: any, limit: any) => {
  return await HTTP_CLIENT.get(`/news?page=${page}&limit=${limit}`);
};
export { handleNewsData };
