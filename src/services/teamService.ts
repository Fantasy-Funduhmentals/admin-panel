import { HTTP_CLIENT } from "../utils/axiosClient";

const handleTeamsData = async (page: any, limit: any) => {
  return await HTTP_CLIENT.get(`/teams?page=${page}&limit=${limit}`);
};

const handlePositionData = async () => {
  return await HTTP_CLIENT.get("/position");
};

const postPsitionData = async (params: any) => {
  return await HTTP_CLIENT.post(`/position`, params);
};
const updatePsitionData = async (params: any, id: string) => {
  return await HTTP_CLIENT.put(`/position/${id}`, params);
};
const deletePsitionData = async (id: string) => {
  return await HTTP_CLIENT.delete(`/position/${id}`);
};
const getPositionStatus = async (params: any) => {
  return await HTTP_CLIENT.post("/position/status", params);
};
const getgamelogs = async () => {
  return await HTTP_CLIENT.get("/game-logs");
};
export {
  handleTeamsData,
  handlePositionData,
  postPsitionData,
  updatePsitionData,
  deletePsitionData,
  getPositionStatus,
  getgamelogs,
};
