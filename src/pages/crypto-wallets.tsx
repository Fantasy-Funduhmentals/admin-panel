import { Box, Container, CircularProgress } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
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
  const [page, setPage] = useState<number>(1);
  const debouncedValue = useDebounce<string>(searchText, 3000)
  const getUserListing = async () => {
    let trimText = searchText?.trim();
    try {
      setLoading(true);
      const walletRes = await getWalletsData(page, trimText);
      dispatch(saveCryptoWallets(walletRes.data));
      if (walletRes?.data?.data?.length == 0) { setPage(1) }
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
            title="by email or address"
            subTitle="Wallet"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            handleRefresh={getUserListing}
          />
          <Box sx={{ mt: 3 }} style={{ textAlign: "center", minHeight: `${loading ? "60vh" : "0"}`, display: "flex", justifyContent: "center", alignItems: "center" }}>
            {loading ? (
              <RotatingLines
                strokeColor="#5048e5"
                strokeWidth="5"
                animationDuration="0.75"
                width="66"
                visible={true}
              />
            ) : (
              <CryptoWalletListResults
                style={{ width: "100%" }}
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
