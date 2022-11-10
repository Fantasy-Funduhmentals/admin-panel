import { HTTP_CLIENT } from "../utils/axiosClient";

const getAdminStats = async () => {
  return await HTTP_CLIENT.get("/dashboard");
};

export { getAdminStats };
