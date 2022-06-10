import { Box, Container ,CircularProgress} from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { CoinListResults } from "../components/coin/coin-list-results";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import StatusModal from "../components/StatusModal";
import { getCoins } from "../services/coinService";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveCoins } from "../store/reducers/coinSlice";
import { getNormalizedError } from "../utils/helpers";

const Coins = () => {
  const { coins } = useAppSelector((state: RootState) => state.coin);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");

  const getCoinsListing = async () => {
    setLoading(true);
    try {
      
      const coinsRes = await getCoins();

      dispatch(saveCoins(coinsRes));
      setLoading(false);
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setLoading(false);

    }
  };

  useEffect(() => {
    getCoinsListing();
  }, []);

  return (
    <>
      <Head>
        <title>Customers | CQR Admin</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <ListToolbar
            title="Coin Management"
            subTitle="Coin"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            handleRefresh={getCoinsListing}
          />
          <Box sx={{ mt: 3 }} style={{textAlign:"center"}}>
            {loading ? <CircularProgress/>:<CoinListResults data={coins} searchQuery={searchText} />}
          </Box>
        </Container>
      </Box>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </>
  );
};
Coins.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Coins;
