import { HTTP_CLIENT } from "../utils/axiosClient";

const getAdminUserData = async () => {
  return await HTTP_CLIENT.get("/admin-auth/getAllSubAdmins");
};

export { getAdminUserData };
