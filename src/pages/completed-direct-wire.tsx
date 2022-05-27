import { Box, Container, CircularProgress } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import FullScreenNFTDialog from "../components/direct-wire-modal";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import StatusModal from "../components/StatusModal";
import { NftListResults } from "../components/completedDirectWireData/direct-wire-result";
import { completedDirectWireData } from "../services/tokenService";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveCompleteDirectWire } from "../store/reducers/completeDirectWire";
import { getNormalizedError } from "../utils/helpers";

const Tokens = () => {
  const { completeDirectWire } = useAppSelector(
    (state: RootState) => state.completeDirectWire
  );

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [customerModelOpen, setCustomerModalOpen] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [reload, setReload] = useState(false);
  const [wireData, setWireData] = useState(null);

  const getTokensListing = async () => {
    setLoading(true);
    try {
      const coinsRes = await completedDirectWireData();

      dispatch(saveCompleteDirectWire(coinsRes.data));
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

  const onPressEdit = (data: any) => {
    setWireData(data);
    setCustomerModalOpen(true);
  };

  useEffect(() => {
    getTokensListing();
  }, [reload]);

  return (
    <>
      <Head>
        <title>Direct Wire | CQR Admin</title>
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
            title="Completed Direct Wire"
            subTitle="Completed Direct-Wire"
            // onPressAdd={() => {
            //   setCustomerModalOpen(true);
            // }}
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            handleRefresh={getTokensListing}
          />
          <Box sx={{ mt: 3 }} style={{ textAlign: "center" }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <NftListResults
                data={completeDirectWire}
                searchQuery={searchText}
                onPressEdit={onPressEdit}
              />
            )}
          </Box>
        </Container>
      </Box>

      {customerModelOpen && (
        <FullScreenNFTDialog
          open={customerModelOpen}
          onClose={() => {
            setCustomerModalOpen(false);
            setWireData(null);
            setReload(!reload);
          }}
          editData={wireData}
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
