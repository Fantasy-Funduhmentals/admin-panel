import { Box, Container } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import { NftList } from "../components/NftComponent/nftData";
import StatusModal from "../components/StatusModal";
import { handleNftData } from "../services/nftService";
import { getNormalizedError } from "../utils/helpers";
import { useDebounce } from "usehooks-ts";

const NFT = () => {
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loadingApi, setLoadingApi] = useState(false);
  const debaouncedData = useDebounce(searchText, 2000);
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
      const playerRes = await handleNftData(page, limit, debaouncedData);
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
  }, [page, limit, debaouncedData]);

  return (
    <>
      <Head>
        <title>NFT's </title>
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
              title="NFT's Management"
              subTitle="NFT's "
              onChangeText={(ev) => {
                setSearchText(ev.target.value);
              }}
              style={{ width: "100%" }}
              handleRefresh={getAdminUsers}
            />
          </Box>

          <Box sx={{ mt: 3 }} style={{ textAlign: "center" }}>
            <NftList
              loadingApi={loadingApi}
              RefreshAdminUsersData={getAdminUsers}
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
NFT.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default NFT;
