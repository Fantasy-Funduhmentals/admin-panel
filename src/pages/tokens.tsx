import { Box, Container } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import FullScreenDialog from "../components/add-token-modal";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import StatusModal from "../components/StatusModal";
import { TokenListResults } from "../components/token/token-list-results";
import { getTokensData } from "../services/tokenService";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveTokens } from "../store/reducers/tokenSlice";
import { getNormalizedError } from "../utils/helpers";

const Tokens = () => {
  const {
    token: { tokens },
  } = useAppSelector((state: RootState) => state);

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [customerModelOpen, setCustomerModalOpen] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [editToken, setEditToken] = useState(null);

  const getTokensListing = async () => {
    try {
      setLoading(true);
      const coinsRes = await getTokensData();
      dispatch(saveTokens(coinsRes.data));
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };

  const onPressEdit = (token: any) => {
    console.log("--token----", token);

    setEditToken(token);
    setCustomerModalOpen(true);
  };

  useEffect(() => {
    getTokensListing();
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
            title="Token Managment"
            subTitle="Token"
            onPressAdd={() => {
              setCustomerModalOpen(true);
            }}
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
          />
          <Box sx={{ mt: 3 }}>
            <TokenListResults
              data={tokens}
              searchQuery={searchText}
              onPressEdit={onPressEdit}
            />
          </Box>
        </Container>
      </Box>

      {customerModelOpen && (
        <FullScreenDialog
          open={customerModelOpen}
          onClose={() => {
            setCustomerModalOpen(false);
            setEditToken(null);
          }}
          editData={editToken}
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
