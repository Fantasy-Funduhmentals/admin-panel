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
import { RootState } from "../store";
import { useAppSelector } from "../store/hooks";
import { saveMasterBalances } from "../store/reducers/userSlice";
import { getNormalizedError } from "../utils/helpers";
import { setupAxios } from "../utils/axiosClient";
import LogsModal from "../components/dashboard/logs-modal";
import { getAdminStats } from "../services/coinService";
const Dashboard = () => {
  const { role } = useAppSelector((state: RootState) => state.user);
  const { masterBalances, users } = useAppSelector(
    (state: RootState) => state?.user
  );

  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const dispatch = useDispatch();
  const [reload, setReload] = useState(false);

  const getCardsData = async () => {
    try {
      setLoading(true);
      setupAxios();
      const cardsData = await getAdminStats();

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
            <title>Dashboard </title>
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
                  <Grid item lg={6} sm={6} xl={3} xs={12}>
                    {/* <Budget /> */}
                    <DashboardCard
                      title="Total No. of Players"
                      value={masterBalances?.playersCount}
                      image="/Projects.png"
                    />
                  </Grid>
                  <Grid item xl={3} lg={6} sm={6} xs={12}>
                    {/* <TotalCustomers /> */}
                    <DashboardCard
                      title="Fantasy fundumentals Gear Shop"
                      value={
                        masterBalances?.shopsCount
                          ? masterBalances?.shopsCount
                          : "-"
                      }
                      image="/Profit.png"
                    />
                  </Grid>
                  <Grid item xl={3} lg={6} sm={6} xs={12}>
                    <DashboardCard
                      title="Total Investment"
                      value={
                        masterBalances?.investment
                          ? masterBalances?.investment
                          : "-"
                      }
                      image="/Investment.png"
                    />
                  </Grid>
                  <Grid item xl={3} lg={6} sm={6} xs={12}>
                    <DashboardCard
                      title="Total Users
                      "
                      value={
                        masterBalances?.usersCount
                          ? masterBalances?.usersCount
                          : "-"
                      }
                    />
                  </Grid>

                  <Grid item lg={8} md={12} xl={9} xs={12}>
                    <Sales />
                  </Grid>
                  <Grid item lg={4} md={12} xl={3} xs={12}>
                    <TrafficByDevice sx={{ height: "100%" }} />
                  </Grid>
                </Grid>
              )}
            </Container>
          </Box>

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
