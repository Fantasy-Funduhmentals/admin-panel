import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
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
import { setupAxios } from "../utils/axiosClient";
import Router from "next/router";
import { WalletListResults } from "../components/dashboard/wallet-table";
import { getWalletData } from "../services/userService";
import LogsModal from "../components/dashboard/logs-modal";
const Dashboard = () => {
  const { role } = useAppSelector((state: RootState) => state.user);
  const { masterBalances, users } = useAppSelector(
    (state: RootState) => state.user
  );
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const [userModelOpen, setUserModalOpen] = useState(false);
  const [reload, setReload] = useState(false);

  const walletData = async () => {
    try {
      setLoading(true);
      const res = await getWalletData();
      console.log(res.data, "_JJJJ");
      setData(res.data);
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
  const getCardsData = async () => {
    try {
      setLoading(true);
      setupAxios();
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
    walletData();
    if (role == "sub admin") {
      Router.push("/chat");
    }
  }, []);

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            // marginTop: "300px",
            minHeight: "90vh",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
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
                      value={`${parseFloat(masterBalances?.btc).toFixed(
                        2
                      )} BTC`}
                      image="/btc.png"
                    />
                  </Grid>
                  <Grid item xl={3} lg={3} sm={6} xs={12}>
                    {/* <TotalCustomers /> */}
                    <DashboardCard
                      title="ETH Wallet"
                      value={`${parseFloat(masterBalances?.eth).toFixed(
                        2
                      )} ETH`}
                      image="/eth.png"
                    />
                  </Grid>
                  <Grid item xl={3} lg={3} sm={6} xs={12}>
                    {/* <TasksProgress />
                     */}

                    <DashboardCard
                      title="BNB Wallet"
                      value={`${parseFloat(masterBalances?.bnb).toFixed(
                        2
                      )} BNB`}
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
                  <Grid item lg={4} md={12} xl={3} xs={12}>
                    <TrafficByDevice sx={{ height: "100%" }} />
                  </Grid>
                  <Grid item lg={12} md={12} xl={12} xs={12}>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        m: 1,
                      }}
                    >
                      <Typography sx={{ m: 1 }} variant="h4">
                        Wallets
                      </Typography>

                      <Box sx={{ m: 1 }}>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => setUserModalOpen(true)}
                        >
                          Wallet Logs
                        </Button>
                      </Box>
                    </Box>
                    <WalletListResults data={data} />
                  </Grid>
                </Grid>
              )}
            </Container>
          </Box>
          <LogsModal
            open={userModelOpen}
            onClose={() => {
              setUserModalOpen(false);
              setReload(!reload);
            }}
          />
          <StatusModal
            statusData={statusData}
            onClose={() => setStatusData(null)}
          />
        </>
      )}
    </>
  );
};
Dashboard.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Dashboard;
