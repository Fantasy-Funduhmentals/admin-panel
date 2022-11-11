import { HTTP_CLIENT } from "../utils/axiosClient";

const getShopData = async (page: any, limit: any) => {
  return await HTTP_CLIENT.get(`/shop?page=${page}&limit=${limit}`);
};
const updateShopData = async (params: any) => {
  return await HTTP_CLIENT.put(`/shop`, params);
};
const deleteShopData = async (id: any) => {
  return await HTTP_CLIENT.delete(`/shop/${id}`);
};
const postShopData = async (params: any) => {
  return await HTTP_CLIENT.post(`/shop`, params);
};
const getShopStatus = async (id: any) => {
  return await HTTP_CLIENT.get(`/shop/status/${id}`);
};
const changesImageUrl = async (params: any) => {
  return await HTTP_CLIENT.post(`/storage/upload`, params);
};
export {
  getShopData,
  updateShopData,
  deleteShopData,
  getShopStatus,
  changesImageUrl,
  postShopData,
};
