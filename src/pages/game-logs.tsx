import { Box, CircularProgress, Container } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { GamelogsList } from "../components/gamelogs/gamelogs-list";
import { ListToolbar } from "../components/list-toolbar";
import { NewsletterListResults } from "../components/newsletter/newsletter-list-results";
import StatusModal from "../components/StatusModal";
import { handleNewsletterData } from "../services/newsService";
import { getgamelogs } from "../services/teamService";
import { getNormalizedError } from "../utils/helpers";

const GameLogs = () => {
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const getGameLogsListing = async () => {
    setLoading(true);
    try {
      const res = await getgamelogs();
      setData(res?.data?.reverse());
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
    getGameLogsListing();
  }, [page, limit]);

  return (
    <>
      <Head>
        <title>Game Logs</title>
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
            title="Game logs management"
            subTitle="Game logs"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            handleRefresh={getGameLogsListing}
          />
          <Box sx={{ mt: 3 }} style={{ textAlign: "center" }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <GamelogsList
                data={data}
                searchQuery={searchText}
                handlePageChange={handlePageChange}
                handlelimitchange={handleLimitChange}
                page={page}
                limit={limit}
              />
            )}
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
GameLogs.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default GameLogs;
