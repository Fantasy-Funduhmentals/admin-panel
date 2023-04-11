import { Box, Container } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import StatusModal from "../components/StatusModal";
import { NftBurnList } from "../components/burnNftComponent/burnNFt";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import { burnNftList } from "../services/nftService";
import { getNormalizedError } from "../utils/helpers";

const BurnNFTs = () => {
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loadingApi, setLoadingApi] = useState(false);
  const [data, setData] = useState();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(null);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const getAdminUsers = async () => {
    try {
      setLoadingApi(true);
      const res = await burnNftList(page, limit);
      setData(res?.data?.data);
      setCount(res?.data?.total);
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
        <title>Burn NFTs</title>
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
              title="NFT's Burn Management"
              searchTitle="NFT By Name"
              subTitle="Burn NFT"
              onChangeText={(ev) => {
                setSearchText(ev.target.value);
              }}
              style={{ width: "100%" }}
              handleRefresh={getAdminUsers}
            />
          </Box>

          <Box sx={{ mt: 3 }} style={{ textAlign: "center" }}>
            <NftBurnList
              loadingApi={loadingApi}
              RefreshAdminUsersData={getAdminUsers}
              searchQuery={searchText}
              style={{ width: "100%" }}
              page={page}
              limit={limit}
              data={data}
              handleLimitChange={handleLimitChange}
              handlePageChange={handlePageChange}
              count={count}
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

BurnNFTs.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default BurnNFTs;
