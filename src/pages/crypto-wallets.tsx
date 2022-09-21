import { Box, Container, CircularProgress } from "@mui/material";
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
import useDebounce from "../utils/hooks/useDebounce";

const CryptoWallets = () => {
  const { wallets } = useAppSelector((state: RootState) => state.coin);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState<number>(0);
  const debouncedValue = useDebounce<string>(searchText, 3000)
  const getUserListing = async () => {
    try {
      setLoading(true);
      const walletRes = await getWalletsData(page, searchText);
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
  }, [page, debouncedValue]);

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
            title="Wallets Management"
            subTitle="Wallet"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            handleRefresh={getUserListing}
          />
          <Box sx={{ mt: 3 }} style={{ textAlign: "center" }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <CryptoWalletListResults
                data={wallets}

                setPage={setPage}
                page={page} total={0} status={undefined} />
            )}
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
