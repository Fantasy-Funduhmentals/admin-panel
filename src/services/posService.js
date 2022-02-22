import axios from "axios";
import panelConfig from "../panel.config";

const API_URL = panelConfig.API_URL;

export const getAllMerchants = async () => {
  return await axios.get(`${API_URL}/merchant/list/merchants`);
};

export const getAllShops = async () => {
  return await axios.get(`${API_URL}/shop/getAllShops`);
};

export const getAllProducts = async () => {
  return await axios.get(`${API_URL}/product/list/products`);
};

export const changeMerchantStatus = async (params) => {
  return await axios.post(`${API_URL}/merchant/changeMerchantStatus`, params);
};

export const deleteProduct = async (id) => {
  return await axios.delete(`${API_URL}/product/delete-product/${id}`);
};
