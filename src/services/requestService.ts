import { store } from "../store";
import { saveLoanRequests } from "../store/reducers/loanSlice";
import { HTTP_CLIENT } from "../utils/axiosClient";

const getRequests = async (page: number, searchText: string | number) => {
  return await HTTP_CLIENT.get(`/request/get-all-requests?page=${page ? page : 1}&keyword=${searchText ? searchText : ""}`);
};
const getNftRequests = async (page: number, searchText?: string | number) => {
  return await HTTP_CLIENT.get(
    `/nft-purchase-request/get-unhandled-requests?page=${page ? page : 1}&keyword=${searchText ? searchText : ""}`
  );
};

const getLoanRequests = async (page: number, searchText?: string | number) => {
  return await HTTP_CLIENT.get(
    `/nft-wallet/completed-loan-requests?page=${page ? page : 1}&keyword=${searchText ? searchText : ""}`
  );
};
const handleRequestInteraction = async (params: any) => {
  const requestsRes = await HTTP_CLIENT.post("/request/handle-request", params);
};

const handleCheckbalance = async (params: any) => {
  return await HTTP_CLIENT.get(`/native-wallet/user-q-wallet/${params}`);
};

const handleRequestNftBalance = async (params: any) => {
  const requestsRes = await HTTP_CLIENT.post(
    "/nft-purchase-request/handle-request",
    params
  );
};

export {
  getRequests,
  handleRequestInteraction,
  getNftRequests,
  handleRequestNftBalance,
  getLoanRequests,
  handleCheckbalance
};
