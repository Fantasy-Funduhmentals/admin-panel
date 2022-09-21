import { Box, Container, CircularProgress } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import { RequestListResults } from "../components/loan-request-completed/loan-request-list-result";
import StatusModal from "../components/StatusModal";
import { getLoanRequests } from "../services/requestService";
import { RootState } from "../store";
import { useAppSelector } from "../store/hooks";
import { getNormalizedError } from "../utils/helpers";
import useDebounce from "../utils/hooks/useDebounce";

const SdiraRequests = () => {
  const { loanRequests } = useAppSelector(
    (state: RootState) => state.loanRequest
  );


  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState<number>(1);
  const debouncedValue = useDebounce<string>(searchText, 3000)

  const getCoinsListing = async () => {
    try {
      setLoading(true);
      await getLoanRequests(() => {
        setLoading(false);
      }, page, searchText);
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
    }
  };

  useEffect(() => {
    getCoinsListing();
  }, [page, debouncedValue]);

  return (
    <>
      <Head>
        <title>Requests | CQR Admin</title>
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
            title="by name or email"
            subTitle="Loan"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            handleRefresh={getCoinsListing}
          />
          <Box sx={{ mt: 3 }} style={{ textAlign: "center" }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <RequestListResults
                data={loanRequests}
                searchText={searchText}
                setPage={setPage}
                page={page} total={0} status={undefined} />
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
SdiraRequests.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default SdiraRequests;
