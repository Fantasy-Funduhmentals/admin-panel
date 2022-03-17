import { Box, Container } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import FullScreenNFTDialog from "../components/add-nft-modal";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import StatusModal from "../components/StatusModal";
import { NftListResults } from "../components/nft/nft-list-result";
import { getNFTData } from "../services/tokenService";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveNFT } from "../store/reducers/nftSlice";
import { getNormalizedError } from "../utils/helpers";

const Tokens = () => {
  const { nft } = useAppSelector((state: RootState) => state.nft);
  console.log("coinsRes>>>", nft);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [customerModelOpen, setCustomerModalOpen] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [reload, setReload] = useState(false);
  const [nftToken, setNftToken] = useState(null);

  const getTokensListing = async () => {
    try {
      setLoading(true);
      const coinsRes = await getNFTData();
      dispatch(saveNFT(coinsRes.data));
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };

  const onPressEdit = (token: any) => {
    setNftToken(token);
    setCustomerModalOpen(true);
  };

  useEffect(() => {
    getTokensListing();
  }, [reload]);

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
            title="NFT"
            subTitle="NFT"
            // onPressAdd={() => {
            //   setCustomerModalOpen(true);
            // }}
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
          />
          <Box sx={{ mt: 3 }}>
            <NftListResults
              data={nft}
              searchQuery={searchText}
              onPressEdit={onPressEdit}
            />
          </Box>
        </Container>
      </Box>

      {customerModelOpen && (
        <FullScreenNFTDialog
          open={customerModelOpen}
          onClose={() => {
            setCustomerModalOpen(false);
            setNftToken(null);
            setReload(!reload);
          }}
          editData={nftToken}
        />
      )}
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </>
  );
};
Tokens.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Tokens;
