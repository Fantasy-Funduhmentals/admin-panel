import { HTTP_CLIENT } from "../utils/axiosClient";

const getAdminStats = async () => {
  return await HTTP_CLIENT.get("/admin-stats/getAdminStats");
};

export { getAdminStats };
