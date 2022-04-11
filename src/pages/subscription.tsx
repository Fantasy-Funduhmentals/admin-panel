import { Box, Container,CircularProgress } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import FullScreenDialog from "../components/add-subscription-modal";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import StatusModal from "../components/StatusModal";
import { SubscriptionListListResults } from "../components/subscription/subscription";
import { getSubscriptionData } from "../services/tokenService";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveSubscriptionData } from "../store/reducers/subscriptionSlice";
import { getNormalizedError } from "../utils/helpers";

const Tokens = () => {
  const { subscriptionList } = useAppSelector(
    (state: RootState) => state.subscription
  );

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [customerModelOpen, setCustomerModalOpen] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [reload, setReload] = useState(false);
  const [editToken, setEditToken] = useState(null);

  const getTokensListing = async () => {
    setLoading(true);
    try {
      
      const subscriptionRes = await getSubscriptionData();
      dispatch(saveSubscriptionData(subscriptionRes.data));
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
    setEditToken(token);
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
            title="Subscription Managment"
            subTitle="Package"
            onPressAdd={() => {
              setCustomerModalOpen(true);
            }}
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
          />
          <Box sx={{ mt: 3 }} style={{textAlign:"center"}}>
           {loading ? <CircularProgress/>: <SubscriptionListListResults
              data={subscriptionList}
              searchQuery={searchText}
              onPressEdit={onPressEdit}
            />}
          </Box>
        </Container>
      </Box>

      {customerModelOpen && (
        <FullScreenDialog
          open={customerModelOpen}
          onClose={() => {
            setCustomerModalOpen(false);
            setEditToken(null);
            setReload(!reload);
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
