import { Box, Container } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import { RequestListResults } from "../components/nft-request-list-result/nft-request-list-result";
import StatusModal from "../components/StatusModal";
import { getNftRequests } from "../services/requestService";
import { RootState } from "../store";
import { useAppSelector } from "../store/hooks";
import { getNormalizedError } from "../utils/helpers";

const SdiraRequests = () => {
  const { nftRequests } = useAppSelector(
    (state: RootState) => state.nftRequest
  );
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");

  const getCoinsListing = async () => {
    debugger;
    try {
      setLoading(true);
      await getNftRequests(() => {
        setLoading(false);
      });
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };

  useEffect(() => {
    getCoinsListing();
  }, []);

  return (
    <>
      <Head>
        <title>Requests | CQR Admin</title>
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
            title="NFT purchase requests managment"
            subTitle="Request"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
          />
          <Box sx={{ mt: 3 }}>
            <RequestListResults data={nftRequests} searchQuery={searchText} />
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
SdiraRequests.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SdiraRequests;
