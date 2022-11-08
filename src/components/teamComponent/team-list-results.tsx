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
  data: any[];
  searchQuery?: string;
}

export const TeamListResults = (props: Props) => {
  const { data, searchQuery } = props;

  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const dataToDisplay = useMemo(() => {
    const begin = page * limit;
    const end = begin + limit;

    if (searchQuery.length > 0) {
      return data
        .filter(
          (user) =>
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.coinSymbol?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(begin, end);
    } else {
      return data?.slice(begin, end);
    }
  }, [page, limit, data, searchQuery]);

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
              <TableHead sx={{ background: "black" }}>
                <TableRow>
                  <TableCell style={{ color: "#fff" }}>Name</TableCell>
                  <TableCell style={{ color: "#fff" }}>Blockchain</TableCell>
                  <TableCell style={{ color: "#fff" }}>Price</TableCell>
                  <TableCell style={{ color: "#fff" }}>Change 24H</TableCell>
                  <TableCell style={{ color: "#fff" }}>High 24H</TableCell>
                  <TableCell style={{ color: "#fff" }}>Low 24H</TableCell>
                  <TableCell style={{ color: "#fff" }}>Market Cap</TableCell>
                  <TableCell style={{ color: "#fff" }}>Total Volume</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay?.map((customer) => (
                  <TableRow
                    hover
                    key={customer._id}
                    selected={selectedCustomerIds.indexOf(customer._id) !== -1}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Avatar src={customer.icon.url} sx={{ mr: 2 }}>
                          {getInitials(customer.name)}
                        </Avatar>
                        <Typography color="textPrimary" variant="body1">
                          {customer.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{customer.blockchain}</TableCell>
                    <TableCell>{customer.rate.toLocaleString()} $</TableCell>
                    <TableCell
                      style={{
                        color:
                          Number(customer.changePercentage24h) < 0
                            ? "red"
                            : "green",
                      }}
                    >
                      {parseFloat(customer.changePercentage24h).toFixed(2)} %
                    </TableCell>
                    <TableCell style={{ color: "green" }}>
                      {customer.high24h.toLocaleString()}
                    </TableCell>
                    <TableCell style={{ color: "red" }}>
                      {customer.low24h.toLocaleString()}{" "}
                    </TableCell>

                    <TableCell>{customer.marketCap.toLocaleString()}</TableCell>
                    <TableCell>
                      {customer.totalVolume.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={data?.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

TeamListResults.propTypes = {
  customers: PropTypes.array.isRequired,
};
