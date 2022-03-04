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

export const CoinListResults = (props: Props) => {
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
      return data.slice(begin, end);
    }
  }, [page, limit, data, searchQuery]);

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
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Blockchain</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Change 24H</TableCell>
                  <TableCell>High 24H</TableCell>
                  <TableCell>Low 24H</TableCell>
                  <TableCell>Market Cap</TableCell>
                  <TableCell>Total Volume</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay.map((customer) => (
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
                    <TableCell>{customer.rate} $</TableCell>
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
                      {customer.high24h}
                    </TableCell>
                    <TableCell style={{ color: "red" }}>
                      {customer.low24h}{" "}
                    </TableCell>

                    <TableCell>{customer.marketCap}</TableCell>
                    <TableCell>{customer.totalVolume}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={data.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

CoinListResults.propTypes = {
  customers: PropTypes.array.isRequired,
};
