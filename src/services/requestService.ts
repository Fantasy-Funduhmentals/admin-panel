import { store } from "../store";
import { saveRequests } from "../store/reducers/requestSlice";
import { HTTP_CLIENT } from "../utils/axiosClient";
import { saveNftRequests } from "../store/reducers/nftRequestSlice";
import { saveLoanRequests } from "../store/reducers/loanSlice";

const getRequests = async (callback: any, page: number, searchText: string | number) => {
  const requestsRes = await HTTP_CLIENT.get(`/request/get-all-requests?page=${page ? page : 1}&keyword=${searchText ? searchText : ""}`);
  store.dispatch(saveRequests(requestsRes.data));
  callback();
};

const getNftRequests = async (callback: any, page: number) => {
  const requestsRes = await HTTP_CLIENT.get(
    `/nft-purchase-request/get-unhandled-requests?page=${page ? page : 1}`
  );
  store.dispatch(saveNftRequests(requestsRes.data));
  callback();
};

const getLoanRequests = async (callback: any, page: number) => {
  const requestsRes = await HTTP_CLIENT.get(
    `/nft-wallet/completed-loan-requests?page=${page ? page : 1}`
  );
  store.dispatch(saveLoanRequests(requestsRes.data));
  callback();
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
