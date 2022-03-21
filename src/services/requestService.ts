import { store } from "../store";
import { saveRequests } from "../store/reducers/requestSlice";
import { HTTP_CLIENT } from "../utils/axiosClient";
import { saveNftRequests } from "../store/reducers/nftRequestSlice";

const getRequests = async (callback: any) => {
  const requestsRes = await HTTP_CLIENT.get("/request/get-all-requests");
  store.dispatch(saveRequests(requestsRes.data));
  callback();
};

const getNftRequests = async (callback: any) => {
  const requestsRes = await HTTP_CLIENT.get(
    "/nft-purchase-request/get-unhandled-requests"
  );
  store.dispatch(saveNftRequests(requestsRes.data));
  callback();
};

const handleRequestInteraction = async (params: any) => {
  const requestsRes = await HTTP_CLIENT.post("/request/handle-request", params);
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
};
