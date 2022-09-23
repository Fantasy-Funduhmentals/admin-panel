import { Box, Container, CircularProgress } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import { NativeWalletListResults } from "../components/native-wallets/nataive-wallet-list-results";
import StatusModal from "../components/StatusModal";
import { getNativeWalletsData } from "../services/tokenService";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveNativeWallets } from "../store/reducers/tokenSlice";
import { getNormalizedError } from "../utils/helpers";
import useDebounce from "../utils/hooks/useDebounce";

const NativeWallets = () => {
  const { wallets } = useAppSelector((state: RootState) => state.token);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState<number>(1);
  const debouncedValue = useDebounce<string>(searchText, 3000)
  const getNativeWallets = async () => {
    let trimText = searchText?.trim();
    try {
      setLoading(true);
      const walletRes = await getNativeWalletsData(page, trimText);
      dispatch(saveNativeWallets(walletRes.data));
      if (walletRes?.data?.data?.length == 0) {
        setPage(1)
      }
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
            title="by name or email"
            subTitle="Native Wallet"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            handleRefresh={getNativeWallets}
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
              <NativeWalletListResults
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
NativeWallets.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default NativeWallets;
