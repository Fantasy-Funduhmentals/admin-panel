import { Box, Container } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import { NativeWalletListResults } from "../components/native-wallets/nataive-wallet-list-results";
import StatusModal from "../components/StatusModal";
import { getNativeWalletsData } from "../services/tokenService";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveNativeWallets } from "../store/reducers/tokenSlice";
import { getNormalizedError } from "../utils/helpers";

const NativeWallets = () => {
  const { wallets } = useAppSelector((state: RootState) => state.token);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");

  const getNativeWallets = async () => {
    try {
      setLoading(true);
      const walletRes = await getNativeWalletsData();

      dispatch(saveNativeWallets(walletRes.data));
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
    getNativeWallets();
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
            title="Native Wallets Managment"
            subTitle="Native Wallet"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
          />
          <Box sx={{ mt: 3 }}>
            <NativeWalletListResults data={wallets} searchQuery={searchText} />
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
NativeWallets.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default NativeWallets;
