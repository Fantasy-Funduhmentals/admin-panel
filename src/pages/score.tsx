import {
  Box,
  Card,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DashboardLayout } from "../components/dashboard-layout";
import { ListToolbar } from "../components/list-toolbar";
import { ScoreListResults } from "../components/ScoreComponent/score-list-results";
import StatusModal from "../components/StatusModal";
import { getScoreData } from "../services/generalService";
import { getNormalizedError } from "../utils/helpers";
const Item = [
  {
    name: "Upcoming",
  },
  {
    name: "Recent",
  },
];
const Coins = () => {
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState();
  const [selectItems, setSelectItems] = useState("Upcoming");
  const [dropDownValue, setDropDownValue] = useState(true);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(null);

  const handleLimitChange = (event: any) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage: any) => {
    setPage(newPage);
  };

  const handleDurationChange = (event) => {
    setSelectItems(event.target.value);
    if (event.target.value === "Upcoming") {
      setDropDownValue(true);
    } else {
      setDropDownValue(false);
    }
  };

  const getCoinsListing = async () => {
    setLoading(true);
    try {
      const coinsRes = await getScoreData(dropDownValue, limit, page);
      setCount(coinsRes?.data?.total);
      setData(coinsRes?.data?.data);
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
  }, [dropDownValue, limit, page]);

  return (
    <>
      <Head>
        <title>Score</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container
          maxWidth={false}
          sx={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}
        >
          <ListToolbar
            title="Score Management"
            subTitle="Score"
            searchTitle="By Name"
            onChangeText={(ev) => {
              setSearchText(ev.target.value);
            }}
            handleRefresh={getCoinsListing}
          />
          <Card sx={{ p: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" color="success">
                Score Type
              </InputLabel>
              <Select
                color="success"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectItems}
                label="Select Role"
                onChange={handleDurationChange}
              >
                {Item.map((item, index) => (
                  <MenuItem key={index} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Card>
          <Box sx={{ mt: 3 }} style={{ textAlign: "center" }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <ScoreListResults
                data={data}
                searchQuery={searchText}
                handleLimitChange={handleLimitChange}
                handlePageChange={handlePageChange}
                limit={limit}
                page={page}
                count={count}
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
Coins.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Coins;
