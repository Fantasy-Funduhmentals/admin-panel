import { Box, Container, CircularProgress } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import FullScreenNFTDialog from "../components/direct-wire-modal";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import StatusModal from "../components/StatusModal";
import { NftListResults } from "../components/DirectWireData/direct-wire-result";
import { directWireData, singleDirectWire } from "../services/tokenService";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveDirectWire } from "../store/reducers/directWire";
import { getNormalizedError } from "../utils/helpers";
import PendingDirectWireModal from "../components/pending-direct-wire-modal";
import useDebounce from "../utils/hooks/useDebounce";
import { RotatingLines } from "react-loader-spinner";

const Tokens = () => {
  const { directWire } = useAppSelector((state: RootState) => state.directWire);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [customerModelOpen, setCustomerModalOpen] = useState(false);
  const [wireDeta, setWireDeta] = useState<any>("");
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [reload, setReload] = useState(false);
  const [page, setPage] = useState<number>(1);
  const debouncedValue = useDebounce<string>(searchText, 3000)

  const getTokensListing = async () => {
    let trimText = searchText.trim();
    setLoading(true);
    try {
      const coinsRes = await directWireData(page, trimText);
      dispatch(saveDirectWire(coinsRes.data));
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



  const onPressEdit = async (data: any) => {
    setWireDeta(data)
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
            subTitle="Pending Direct-Wire"
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
                style={{ width: "100%" }}
                data={directWire}
                onPressEdit={onPressEdit}
                setPage={setPage}
                page={page} status={undefined} total={0} />
            )}
          </Box>
        </Container>
      </Box>

      {customerModelOpen && (
        <PendingDirectWireModal
          open={customerModelOpen}
          onClose={() => {
            setCustomerModalOpen(false);
            setWireDeta(null);
            setReload(!reload);
          }}
          editData={wireDeta}

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
