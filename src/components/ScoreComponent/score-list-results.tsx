import {
  Avatar,
  Box,
  Card,
  CardProps,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";

interface Props extends CardProps {
<<<<<<< HEAD:src/components/nft-balance/nft-balance-list-result.tsx
  data: any | {};
  status: any;
  page: number;
  total: number;
  setPage: any
}

export const NftBalanceListResults = (props: Props) => {
  const { data, page, setPage } = props;

  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);


  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1);
  };

  const dataToDisplay = useMemo(() => {
    return data?.data;
  }, [data?.data]);
=======
  data: any[];
  searchQuery?: string;
  handleLimitChange?: (prop?: any) => void;
  handlePageChange?: (event: any, prop?: any) => void;
  limit?: number;
  page?: number;
  count?: number;
}

export const ScoreListResults = (props: Props) => {
  const {
    data,
    searchQuery,
    limit,
    page,
    handleLimitChange,
    handlePageChange,
    count,
  } = props;

  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  const dataToDisplay = useMemo(() => {
    const begin = page * limit;
    const end = begin + limit;

    if (searchQuery.length > 0) {
      return data.filter((user) =>
        user?.detail?.StadiumDetails?.Name?.toLowerCase().includes(
          searchQuery.toLowerCase()
        )
      );
    } else {
      return data;
    }
  }, [page, limit, data, searchQuery]);

>>>>>>> 479735f9c643a25850edc450e734af2756134a32:src/components/ScoreComponent/score-list-results.tsx
  // function numberWithCommas(n) {
  //   var parts = n ? n.toString().split(".") : "";
  //   return (
  //     parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
  //     (parts[1] ? "." + parts[1] : "")
  //   );}

  return (
    <Card {...props}>
      <PerfectScrollbar>
        <Paper
          style={{
            width: "100%",
            // marginTop: theme.spacing.unit * 3,
            overflowX: "auto",
          }}
        >
          <Box>
            <Table>
<<<<<<< HEAD:src/components/nft-balance/nft-balance-list-result.tsx
              <TableHead sx={{ background: "#5a82d7" }}>
                <TableRow>
                  <TableCell style={{ color: "#fff" }}>User</TableCell>
                  <TableCell style={{ color: "#fff" }}>Token</TableCell>

                  <TableCell style={{ color: "#fff" }}>Balance</TableCell>
                  <TableCell style={{ color: "#fff" }}>Created At</TableCell>
=======
              <TableHead sx={{ background: "black" }}>
                <TableRow>
                  <TableCell style={{ color: "#fff" }}>Name</TableCell>
                  <TableCell style={{ color: "#fff" }}>City</TableCell>
                  <TableCell style={{ color: "#fff" }}>Country</TableCell>
                  <TableCell style={{ color: "#fff" }}>
                    Playing Surface
                  </TableCell>
                  <TableCell style={{ color: "#fff" }}>State</TableCell>
                  <TableCell style={{ color: "#fff" }}>Score ID</TableCell>
                  <TableCell style={{ color: "#fff" }}>Home Team</TableCell>
                  <TableCell style={{ color: "#fff" }}>Season</TableCell>
                  <TableCell style={{ color: "#fff" }}>Status</TableCell>
>>>>>>> 479735f9c643a25850edc450e734af2756134a32:src/components/ScoreComponent/score-list-results.tsx
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((customer) => (
                  <TableRow
                    hover
                    key={customer?._id}
                    selected={selectedCustomerIds.indexOf(customer?._id) !== -1}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Avatar
                          src={customer?.detail?.icon?.url}
                          sx={{ mr: 2 }}
                        >
                          {getInitials(customer?.detail?.StadiumDetails?.Name)}
                        </Avatar>
                        <Typography color="textPrimary" variant="body1">
                          {customer?.detail?.StadiumDetails?.Name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
<<<<<<< HEAD:src/components/nft-balance/nft-balance-list-result.tsx
                      {customer?.nftToken?.name?.toUpperCase()}
                    </TableCell>

                    {/* <TableCell>{customer?.name}</TableCell> */}
                    <TableCell>
                      {customer?.balance
                        ? Number(parseFloat(customer?.balance).toFixed(3)).toLocaleString()
                        : "0.00"}
                      {customer?.coinSymbol?.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      {moment(customer?.createdAt).format("DD/MM/YYYY hh:mm A")}
=======
                      {customer?.detail?.StadiumDetails?.City}
                    </TableCell>
                    <TableCell>
                      {customer?.detail?.StadiumDetails?.Country}
>>>>>>> 479735f9c643a25850edc450e734af2756134a32:src/components/ScoreComponent/score-list-results.tsx
                    </TableCell>
                    <TableCell>
                      {customer?.detail?.StadiumDetails?.PlayingSurface}
                    </TableCell>
                    <TableCell>
                      {customer?.detail?.StadiumDetails?.State}
                    </TableCell>
                    <TableCell>{customer?.detail?.ScoreID}</TableCell>
                    <TableCell>{customer?.detail?.HomeTeam}</TableCell>
                    <TableCell>{customer?.detail?.Season}</TableCell>
                    <TableCell>{customer?.detail?.Status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </PerfectScrollbar>
      <TablePagination
        component="div"
<<<<<<< HEAD:src/components/nft-balance/nft-balance-list-result.tsx
        count={data?.total}
=======
        count={count}
>>>>>>> 479735f9c643a25850edc450e734af2756134a32:src/components/ScoreComponent/score-list-results.tsx
        onPageChange={handlePageChange}
        page={page - 1}
        rowsPerPage={10}
        rowsPerPageOptions={[]}
      />
    </Card>
  );
};

ScoreListResults.propTypes = {
  customers: PropTypes.array.isRequired,
};
