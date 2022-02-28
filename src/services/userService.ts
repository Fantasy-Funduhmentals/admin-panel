import { HTTP_CLIENT } from "../utils/axiosClient";

const handleUserLogin = async (params: any) => {
  return await HTTP_CLIENT.post("/admin-auth/login", params);
};

const getAllUsers = async () => {
  return await HTTP_CLIENT.get("/user/get-all-users");
};

const changePassword = async (params: any) => {
  return await HTTP_CLIENT.post("/admin-auth/change-password", params);
};

export { handleUserLogin, getAllUsers, changePassword };
