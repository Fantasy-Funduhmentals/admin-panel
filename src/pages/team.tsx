import { Box, CircularProgress, Container } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import StatusModal from "../components/StatusModal";
import { TeamListResults } from "../components/teamComponent/team-list-results";
import { handleTeamsData } from "../services/teamService";
import { RootState } from "../store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveCoins } from "../store/reducers/coinSlice";
import { getNormalizedError } from "../utils/helpers";
import useDebounce from "../utils/hooks/useDebounce";

const Team = () => {
  const { coins } = useAppSelector((state: RootState) => state.coin);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
<<<<<<< HEAD:src/pages/native-wallets.tsx
  const [page, setPage] = useState<number>(1);
  const debouncedValue = useDebounce<string>(searchText, 3000)
  const getNativeWallets = async () => {
    let trimText = searchText?.trim();
    try {
      setLoading(true);
      const walletRes = await getNativeWalletsData(page, trimText);
      dispatch(saveNativeWallets(walletRes.data));
      if (walletRes?.data?.data?.length == 0) {
        setPage(1)
      }
=======
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
      const res = await handleTeamsData(page, limit);
      setData(res?.data?.data);
      setCount(res?.data?.total);

>>>>>>> 479735f9c643a25850edc450e734af2756134a32:src/pages/team.tsx
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
<<<<<<< HEAD:src/pages/native-wallets.tsx
    getNativeWallets();
  }, [page, debouncedValue]);
=======
    getCoinsListing();
  }, [page, limit]);
>>>>>>> 479735f9c643a25850edc450e734af2756134a32:src/pages/team.tsx

  return (
    <>
      <Head>
        <title>Team</title>
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
<<<<<<< HEAD:src/pages/native-wallets.tsx
            title="by name or email"
            subTitle="Native Wallet"
=======
            title="Team Management"
            subTitle="Team"
>>>>>>> 479735f9c643a25850edc450e734af2756134a32:src/pages/team.tsx
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            handleRefresh={getCoinsListing}
          />
          <Box sx={{ mt: 3 }} style={{ textAlign: "center", minHeight: `${loading ? "60vh" : "0"}`, display: "flex", justifyContent: "center", alignItems: "center" }}>
            {loading ? (
              <RotatingLines
                strokeColor="#5048e5"
                strokeWidth="5"
                animationDuration="0.75"
                width="66"
                visible={true}
              />
            ) : (
<<<<<<< HEAD:src/pages/native-wallets.tsx
              <NativeWalletListResults
                style={{ width: "100%" }}
                data={wallets}
                setPage={setPage}
                page={page} total={0} status={undefined} />
=======
              <TeamListResults
                data={data}
                searchQuery={searchText}
                count={count}
                handlePageChange={handlePageChange}
                handleLimitChange={handleLimitChange}
                page={page}
                limit={limit}
              />
>>>>>>> 479735f9c643a25850edc450e734af2756134a32:src/pages/team.tsx
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
Team.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Team;
