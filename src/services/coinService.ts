import { HTTP_CLIENT } from "../utils/axiosClient";

const getCoins = async () => {
  const rates = await Promise.all([
    HTTP_CLIENT.get("/coin/all"),
    HTTP_CLIENT.get("/coin/coin-rates"),
  ]);

  const finalRates = rates[0].data.map((coin) => {
    const coinRate = rates[1].data.find(
      (rate) =>
        rate.coinSymbol?.toUpperCase() == coin?.coinSymbol?.toUpperCase()
    );

    return {
      ...coinRate,
      ...coin,
    };
  });

  return finalRates;
};

const getWalletsData = async (page: number, searchText?: string | number) => {
  return await HTTP_CLIENT.get(`/wallet/get-all-wallets?page=${page ? page : 1}&keyword=${searchText ? searchText : ""}`);
};

export { getCoins, getWalletsData };
