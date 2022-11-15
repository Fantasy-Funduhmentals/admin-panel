import { Box, CircularProgress, Container } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import AddArticlesModal from "../components/ArticlesComponent/add-articles-modal";
import { ArticlesListResults } from "../components/ArticlesComponent/articles-list-results";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import StatusModal from "../components/StatusModal";
import { handleArticleData } from "../services/newsService";
import { getNormalizedError } from "../utils/helpers";

const Articles = () => {
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [shopModelOpen, setShopModalOpen] = useState(false);
  const [editShop, setEditShop] = useState(null);
  const [reload, setReload] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(null);
  const [data, setData]: any[] = useState();

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  const getShopListing = async () => {
    try {
      setLoading(true);
      const usersRes = await handleArticleData(page, limit);
      console.log(
        "🚀 ~ file: articles.tsx ~ line 36 ~ getShopListing ~ usersRes",
        usersRes
      );
      setCount(usersRes?.data?.total);
      setData(usersRes?.data?.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };

  const OpenAddUserModal = (shopData: any) => {
    setShopModalOpen(!shopModelOpen);
    setEditShop(shopData);
  };

  useEffect(() => {
    getShopListing();
  }, [page, limit]);

  return (
    <>
      <Head>
        <title>Articles</title>
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
            title="Articles Management"
            subTitle="Articles"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            onPressAdd={() => {
              setShopModalOpen(true);
            }}
            handleRefresh={getShopListing}
          />
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            sx={{
              mt: 3,
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <ArticlesListResults
                data={data}
                searchQuery={searchText}
                handleRefresh={getShopListing}
                style={{ width: "100%" }}
                handlePageChange={handlePageChange}
                handleLimitChange={handleLimitChange}
                page={page}
                limit={limit}
                count={count}
                onPressUpdate={OpenAddUserModal}
              />
            )}
          </Box>
        </Container>
      </Box>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
      <AddArticlesModal
        open={shopModelOpen}
        editData={editShop}
        getShopListing={getShopListing}
        onClose={() => {
          setShopModalOpen(false);
          setReload(!reload);
          setEditShop(null);
        }}
      />
    </>
  );
};
Articles.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Articles;
