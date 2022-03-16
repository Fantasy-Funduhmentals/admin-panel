import { store } from "../store";

const getNormalizedError = (err: any) => {
  return err?.response?.data?.message || "Request Failed!";
};

const getOtherUser = (members: any[]) => {
  const { userId } = store.getState().user;
  return members?.find((item) => item._id != userId);
};

export { getNormalizedError, getOtherUser };
