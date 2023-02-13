import { Box, CircularProgress, Container } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { BetamangementResults } from "../components/betaMangement/beta-management-list-results";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import StatusModal from "../components/StatusModal";
import { handleBetaData } from "../services/betaService";
import { getNormalizedError } from "../utils/helpers";

const News = () => {
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState();
  const [count, setCount] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const getbetaListing = async () => {
    setLoading(true);
    try {
      const res = await handleBetaData(page, limit);
      setData(res?.data?.data);
      setCount(res?.data?.total);
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
    getbetaListing();
  }, [page, limit]);

  return (
    <>
      <Head>
        <title>Beta</title>
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
            title="Close Beta"
            subTitle="Beta"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            handleRefresh={getbetaListing}
          />
          <Box sx={{ mt: 3 }} style={{ textAlign: "center" }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <BetamangementResults
                data={data}
                searchQuery={searchText}
                count={count}
                handlePageChange={handlePageChange}
                handleLimitChange={handleLimitChange}
                page={page}
                limit={limit}
                getbetaListing={getbetaListing}
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
News.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default News;
