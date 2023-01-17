import { HTTP_CLIENT } from "../utils/axiosClient";

const getAdminStats = async () => {
  return await HTTP_CLIENT.get("/dashboard");
};

<<<<<<< HEAD
const getWalletsData = async (page: number, searchText?: string | number) => {
  return await HTTP_CLIENT.get(`/wallet/get-all-wallets?page=${page ? page : 1}&keyword=${searchText ? searchText : ""}`);
};

export { getCoins, getWalletsData };
=======
export { getAdminStats };
>>>>>>> 479735f9c643a25850edc450e734af2756134a32
