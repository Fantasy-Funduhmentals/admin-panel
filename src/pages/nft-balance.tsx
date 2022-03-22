import { Box, Container } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import { NftBalanceListResults } from "../components/nft-balance/nft-balance-list-result";
import StatusModal from "../components/StatusModal";
import { getNFTBalanceData } from "../services/tokenService";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveUserNft } from "../store/reducers/nftSlice";
import { getNormalizedError } from "../utils/helpers";

const NativeWallets = () => {
  const { userNft } = useAppSelector((state: RootState) => state.nft);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");

  const getNativeWallets = async () => {
    try {
      setLoading(true);
      const walletRes = await getNFTBalanceData();

      dispatch(saveUserNft(walletRes.data));
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
            title="NFT Balance Management"
            subTitle="NFT balance"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
          />
          <Box sx={{ mt: 3 }}>
            <NftBalanceListResults data={userNft} searchQuery={searchText} />
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
