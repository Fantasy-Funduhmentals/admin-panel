import { Box, Container, CircularProgress, Button } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import FullScreenNFTDialog from "../components/add-nft-modal";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import StatusModal from "../components/StatusModal";
import { NftListResults } from "../components/newletter/new-letter-list-result";
import { getNewsLetter } from "../services/tokenService";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveNewsletter } from "../store/reducers/newsLetterSlice";
import { getNormalizedError } from "../utils/helpers";
import { RotatingLines } from "react-loader-spinner";

const Tokens = () => {
  const { newsletterList } = useAppSelector(
    (state: RootState) => state.newsletter
  );

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [customerModelOpen, setCustomerModalOpen] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [reload, setReload] = useState(false);
  const [nftToken, setNftToken] = useState(null);

  const getNewsLetterList = async () => {
    setLoading(true);
    try {
      const coinsRes = await getNewsLetter();

      dispatch(saveNewsletter(coinsRes.data));
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

  const onPressEdit = (token: any) => {
    setNftToken(token);
    setCustomerModalOpen(true);
  };

  useEffect(() => {
    getNewsLetterList();
  }, []);

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
            title="Newsletter"
            subTitle="Newsletter"
            // onPressAdd={() => {
            //   setCustomerModalOpen(true);
            // }}
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            handleRefresh={getNewsLetterList}
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
                data={newsletterList}
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
