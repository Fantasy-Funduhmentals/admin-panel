import { store } from "../store";
import { saveRequests } from "../store/reducers/requestSlice";
import { HTTP_CLIENT } from "../utils/axiosClient";

const getRequests = async (callback: any) => {
  const requestsRes = await HTTP_CLIENT.get("/request/get-all-requests");
  store.dispatch(saveRequests(requestsRes.data));
  callback();
};

const handleRequestInteraction = async (params: any) => {
  const requestsRes = await await HTTP_CLIENT.post(
    "/request/handle-request",
    params
  );
};

export { getRequests, handleRequestInteraction };
