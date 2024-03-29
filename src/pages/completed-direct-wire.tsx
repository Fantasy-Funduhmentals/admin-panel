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
import useDebounce from "../utils/hooks/useDebounce";
import { RotatingLines } from "react-loader-spinner";

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
  const [page, setPage] = useState<number>(1);
  const debouncedValue = useDebounce<string>(searchText, 3000)

  const getTokensListing = async () => {
    let trimText = searchText?.trim();
    try {
      setLoading(true);
      const coinsRes = await completedDirectWireData(page, trimText);
      dispatch(saveCompleteDirectWire(coinsRes.data));
      if (coinsRes?.data?.data?.length == 0) { setPage(1) }
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

  const onPressEdit = (data: any) => {
    setWireData(data);
    setCustomerModalOpen(true);
  };

  useEffect(() => {
    getTokensListing();
  }, [reload, page, debouncedValue]);

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
            title="by name or email"
            subTitle="Completed Direct-Wire"
            // onPressAdd={() => {
            //   setCustomerModalOpen(true);
            // }}
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            handleRefresh={getTokensListing}
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
              <NftListResults
                data={completeDirectWire}
                style={{ width: "100%" }}
                onPressEdit={onPressEdit}
                setPage={setPage}
                page={page} status={undefined} total={0} />
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
