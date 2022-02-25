import { HTTP_CLIENT } from "../utils/axiosClient";

const uploadImage = async (params: any) => {
  return await HTTP_CLIENT.post("/storage/admin/upload", params);
};
const uploadUserCsv = async (params: any) => {
  return await HTTP_CLIENT.post("/admin-import/import-data", params);
};

export { uploadImage, uploadUserCsv };
