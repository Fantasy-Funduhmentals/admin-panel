import { Box, Container } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { CryptoWalletListResults } from "../components/crypto-wallets/crypto-wallet-list-results";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import StatusModal from "../components/StatusModal";
import { getWalletsData } from "../services/coinService";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveCryptoWallets } from "../store/reducers/coinSlice";
import { getNormalizedError } from "../utils/helpers";

const CryptoWallets = () => {
  const { wallets } = useAppSelector((state: RootState) => state.coin);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");

  const getUserListing = async () => {
    try {
      setLoading(true);
      const walletRes = await getWalletsData();

      dispatch(saveCryptoWallets(walletRes.data));
      setLoading(false);
    } catch (err) {
      setLoading(false);

      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };

  useEffect(() => {
    getUserListing();
  }, []);

  return (
    <>
      <Head>
        <title>Customers</title>
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
            title="Wallets Managment"
            subTitle="Wallet"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
          />
          <Box sx={{ mt: 3 }}>
            <CryptoWalletListResults data={wallets} searchQuery={searchText} />
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
CryptoWallets.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default CryptoWallets;
