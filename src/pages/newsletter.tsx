import { Box, CircularProgress, Container } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import { NewsletterListResults } from "../components/newsletter/newsletter-list-results";
import StatusModal from "../components/StatusModal";
import { handleNewsletterData } from "../services/newsService";
import { getNormalizedError } from "../utils/helpers";
import { RotatingLines } from "react-loader-spinner";

const NewsLetter = () => {
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
  const getNewsletterListing = async () => {
    setLoading(true);
    try {
      const res = await handleNewsletterData(page, limit);
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
    getNewsletterListing();
  }, [page, limit]);

  return (
    <>
      <Head>
        <title>News</title>
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
            title="Newsletter Management"
            subTitle="Newsletter"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            handleRefresh={getNewsletterListing}
          />
<<<<<<< HEAD

          <Box sx={{ mt: 3 }} style={{ textAlign: "center", minHeight: `${loading ? "60vh" : "0"}`, display: "flex", justifyContent: "center", alignItems: "center" }}>
=======
          <Box sx={{ mt: 3 }} style={{ textAlign: "center" }}>
>>>>>>> 479735f9c643a25850edc450e734af2756134a32
            {loading ? (
              <RotatingLines
                strokeColor="#5048e5"
                strokeWidth="5"
                animationDuration="0.75"
                width="66"
                visible={true}
              />
            ) : (
<<<<<<< HEAD
              <NftListResults
                style={{ width: "100%" }}
                data={newsletterList}
=======
              <NewsletterListResults
                data={data}
>>>>>>> 479735f9c643a25850edc450e734af2756134a32
                searchQuery={searchText}
                count={count}
                handlePageChange={handlePageChange}
                handleLimitChange={handleLimitChange}
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
NewsLetter.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default NewsLetter;
