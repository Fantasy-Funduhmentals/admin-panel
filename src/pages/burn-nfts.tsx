import { Box, Container } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { NftBurnList } from "../components/burnNftComponent/burnNFt";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import StatusModal from "../components/StatusModal";
import { getAdminUserData } from "../services/tokenService";
import { useAppDispatch } from "../store/hooks";
import { saveAdminUser } from "../store/reducers/adminSlice";
import { getNormalizedError } from "../utils/helpers";

const BurnNFTs = () => {
  const dispatch = useAppDispatch();
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loadingApi, setLoadingApi] = useState(false);

  const getAdminUsers = async () => {
    try {
      setLoadingApi(true);
      const AdminUser = await getAdminUserData();
      dispatch(saveAdminUser(AdminUser?.data));
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
  }, []);

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
