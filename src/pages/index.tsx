import { Box, CircularProgress, Container, Grid } from "@mui/material";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DashboardLayout } from "../components/dashboard-layout";
import DashboardCard from "../components/dashboard/dashboardCard";
import { Sales } from "../components/dashboard/sales";
import { TrafficByDevice } from "../components/dashboard/traffic-by-device";
import StatusModal from "../components/StatusModal";
import { getMasterAddressBalances } from "../services/generalService";
import { RootState } from "../store";
import { useAppSelector } from "../store/hooks";
import { saveMasterBalances } from "../store/reducers/userSlice";
import { getNormalizedError } from "../utils/helpers";

const Dashboard = () => {
  const { masterBalances, users } = useAppSelector(
    (state: RootState) => state.user
  );
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const dispatch = useDispatch();

  const getCardsData = async () => {
    try {
      setLoading(true);
      const cardsData = await getMasterAddressBalances();

      dispatch(saveMasterBalances(cardsData.data));
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

  useEffect(() => {
    getCardsData();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard | CQR Admin</title>
      </Head>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                flex: 1,
                height: "90vh",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Grid
              container
              spacing={3}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                {/* <Budget /> */}
                <DashboardCard
                  title="BTC Wallet"
                  value={`${parseFloat(masterBalances?.btc).toFixed(2)} BTC`}
                  image="/btc.png"
                />
              </Grid>
              <Grid item xl={3} lg={3} sm={6} xs={12}>
                {/* <TotalCustomers /> */}
                <DashboardCard
                  title="ETH Wallet"
                  value={`${parseFloat(masterBalances?.eth).toFixed(2)} ETH`}
                  image="/eth.png"
                />
              </Grid>
              <Grid item xl={3} lg={3} sm={6} xs={12}>
                {/* <TasksProgress />
                 */}

                <DashboardCard
                  title="BNB Wallet"
                  value={`${parseFloat(masterBalances?.bnb).toFixed(2)} BNB`}
                  image="/bnb.png"
                />
              </Grid>
              <Grid item xl={3} lg={3} sm={6} xs={12}>
                <DashboardCard
                  title="Total Users"
                  value={masterBalances?.users}
                />
              </Grid>

              <Grid item lg={8} md={12} xl={9} xs={12}>
                <Sales />
              </Grid>
              <Grid item lg={4} md={6} xl={3} xs={12}>
                <TrafficByDevice sx={{ height: "100%" }} />
              </Grid>
              {/* <Grid item lg={4} md={6} xl={3} xs={12}>
            <LatestProducts sx={{ height: "100%" }} />
          </Grid> */}
              {/* <Grid item lg={8} md={12} xl={9} xs={12}>
            <LatestOrders />
          </Grid> */}
            </Grid>
          )}
        </Container>
      </Box>

      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </>
  );
};
Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
