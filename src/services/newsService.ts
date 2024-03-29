import { HTTP_CLIENT } from "../utils/axiosClient";

const handleNewsData = async (page: any, limit: any) => {
  return await HTTP_CLIENT.get(`/news?page=${page}&limit=${limit}`);
};
const handleNewsletterData = async (page: any, limit: any) => {
  return await HTTP_CLIENT.get(`/newsletter?page=${page}&limit=${limit}`);
};
const handleArticleData = async (page: any, limit: any) => {
  return await HTTP_CLIENT.get(`/project-article/?page=${page}&limit=${limit}`);
};
const postArticleData = async (params?: any) => {
  return await HTTP_CLIENT.post(`/project-article/add-project-article`, params);
};
const putArticleData = async (params?: any, id?: any) => {
  return await HTTP_CLIENT.put(
    `/project-article/update-project-article/${id}`,
    params
  );
};

const handleUpdateNewsImages = async (id: string, params: any) => {
  return await HTTP_CLIENT.put(`/news/${id}`, params);
};

const delArticleData = async (id?: any) => {
  return await HTTP_CLIENT.delete(
    `/project-article/delete-project-article/${id}`
  );
};
export {
  handleNewsData,
  handleArticleData,
  postArticleData,
  putArticleData,
  delArticleData,
  handleNewsletterData,
  handleUpdateNewsImages,
};
