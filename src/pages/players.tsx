import { Box, Container } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import PlayerList from "../components/PlayersComponent/playerData";
import StatusModal from "../components/StatusModal";
import { handlePlayersData } from "../services/playerService";
import { getNormalizedError } from "../utils/helpers";

const Player = () => {
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loadingApi, setLoadingApi] = useState(false);
  const [data, setData] = useState();
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(null);
  const [page, setPage] = useState(0);
  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage: any) => {
    setPage(newPage);
  };
  const getAdminUsers = async () => {
    try {
      setLoadingApi(true);
      const playerRes = await handlePlayersData(page, limit);

      setData(playerRes?.data?.data);
      setCount(playerRes?.data?.total);
      setLoadingApi(false);
    } catch (err) {
      setLoadingApi(false);
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };

  useEffect(() => {
    getAdminUsers();
  }, [page, limit]);

  return (
    <>
      <Head>
        <title>Players </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <ListToolbar
              title="Players Management"
              subTitle="Players"
              onChangeText={(ev) => {
                setSearchText(ev.target.value);
              }}
              style={{ width: "100%" }}
              handleRefresh={getAdminUsers}
            />
          </Box>

          <Box sx={{ mt: 3 }} style={{ textAlign: "center" }}>
            <PlayerList
              loadingApi={loadingApi}
              RefreshAdminUsersData={getAdminUsers}
              searchQuery={searchText}
              style={{ width: "100%" }}
              handleLimitChange={handleLimitChange}
              handlePageChange={handlePageChange}
              page={page}
              limit={limit}
              count={count}
              data={data}
            />
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
Player.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Player;
