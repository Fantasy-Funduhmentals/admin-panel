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
import moment from "moment";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";

interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
}

export const NativeWalletListResults = (props: Props) => {
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
            user.user?.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            user.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(begin, end);
    } else {
      return data?.slice(begin, end);
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
                  <TableCell>User</TableCell>
                  <TableCell>Coin</TableCell>

                  <TableCell>Balance</TableCell>
                  <TableCell>Created At</TableCell>
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
                        <Avatar
                          src={customer.user?.profilePicture}
                          sx={{ mr: 2 }}
                        >
                          {getInitials(customer.user?.name)}
                        </Avatar>
                        <Box
                          sx={{
                            alignItems: "center",
                          }}
                        >
                          <Typography color="textPrimary" variant="body1">
                            {customer.user?.name}
                          </Typography>
                          {customer?.user?.email}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{customer.coinSymbol?.toUpperCase()}</TableCell>

                    {/* <TableCell>{customer?.address}</TableCell> */}
                    <TableCell>
                      {customer?.balance
                        ? parseFloat(customer?.balance).toFixed(3)
                        : "0.00"}{" "}
                      {customer.coinSymbol?.toUpperCase()}
                    </TableCell>
                    <TableCell>
                      {moment(customer.createdAt).format("DD/MM/YYYY hh:mm A")}
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

NativeWalletListResults.propTypes = {
  data: PropTypes.array.isRequired,
};
