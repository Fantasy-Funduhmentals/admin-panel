import { HTTP_CLIENT } from "../utils/axiosClient";

const uploadImage = async (params: any) => {
  return await HTTP_CLIENT.post("/storage/admin/upload", params);
};

export { uploadImage };
