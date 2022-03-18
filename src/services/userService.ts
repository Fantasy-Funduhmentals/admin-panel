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

const createNewUser = async (params: any) => {
  return await HTTP_CLIENT.post("/auth/admin-create-user", params);
};

export { handleUserLogin, getAllUsers, changePassword, createNewUser };
