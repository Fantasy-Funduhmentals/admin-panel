<<<<<<< HEAD:src/pages/coins.tsx
import { Box, Container, CircularProgress } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { CoinListResults } from "../components/coin/coin-list-results";
=======
import { Box, CircularProgress, Container } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
>>>>>>> 479735f9c643a25850edc450e734af2756134a32:src/pages/lates-news.tsx
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import { NewsListResults } from "../components/news/news-list-results";
import StatusModal from "../components/StatusModal";
import { handleNewsData } from "../services/newsService";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveCoins } from "../store/reducers/coinSlice";
import { getNormalizedError } from "../utils/helpers";

const News = () => {
  const { coins } = useAppSelector((state: RootState) => state.coin);
  const dispatch = useAppDispatch();
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
  const getCoinsListing = async () => {
    setLoading(true);
    try {
<<<<<<< HEAD:src/pages/coins.tsx

      const coinsRes = await getCoins();

      dispatch(saveCoins(coinsRes));
=======
      const res = await handleNewsData(page, limit);
      setData(res?.data?.data);
      setCount(res?.data?.total);
>>>>>>> 479735f9c643a25850edc450e734af2756134a32:src/pages/lates-news.tsx
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
    getCoinsListing();
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
            title="News Management"
            subTitle="News"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            handleRefresh={getCoinsListing}
          />
<<<<<<< HEAD:src/pages/coins.tsx
          <Box sx={{ mt: 3 }} style={{ textAlign: "center", minHeight: `${loading ? "60vh" : "0"}`, display: "flex", justifyContent: "center", alignItems: "center" }}>
            {loading ?
              <RotatingLines
                strokeColor="#5048e5"
                strokeWidth="5"
                animationDuration="0.75"
                width="66"
                visible={true}
              /> :
              <CoinListResults data={coins} searchQuery={searchText} style={{ width: "100%" }} />}
=======
          <Box sx={{ mt: 3 }} style={{ textAlign: "center" }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <NewsListResults
                data={data}
                searchQuery={searchText}
                count={count}
                handlePageChange={handlePageChange}
                handleLimitChange={handleLimitChange}
                page={page}
                limit={limit}
              />
            )}
>>>>>>> 479735f9c643a25850edc450e734af2756134a32:src/pages/lates-news.tsx
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
