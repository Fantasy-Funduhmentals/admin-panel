import {
  Avatar,
  Box,
  Card,
  CardProps,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
} from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";
import { SeverityPill } from "../severity-pill";
import { HTTP_CLIENT } from "../../utils/axiosClient";

interface Props extends CardProps {
  data: any | {};
  searchQuery?: string;
  status: any;
  page: number;
  total: number;
  setPage: any;
}

export const CryptoWalletListResults = (props: Props) => {
  const { data, searchQuery, setPage, page } = props;
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const dataToDisplay = useMemo(() => {
    if (searchQuery?.length > 0) {
      return data?.data
        .filter(
          (user) =>
            user.userId?.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            user.userId?.email
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        )

    } else {
      return data?.data;
    }
  }, [data, searchQuery]);

  return (
    <Card {...props}>
      <PerfectScrollbar>
        <Paper
          style={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <Box>
            <Table>
              <TableHead sx={{ background: "#5a82d7" }}>
                <TableRow>
                  <TableCell style={{ color: "#fff" }}>User</TableCell>
                  <TableCell style={{ color: "#fff" }}>Coin</TableCell>
                  <TableCell style={{ color: "#fff" }}>Address</TableCell>
                  <TableCell style={{ color: "#fff" }}>Balance</TableCell>
                  <TableCell style={{ color: "#fff" }}>Created At</TableCell>
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
                          src={customer.userId?.profilePicture}
                          sx={{ mr: 2 }}
                        >
                          {getInitials(customer.userId?.name)}
                        </Avatar>
                        <Box
                          sx={{
                            alignItems: "center",
                          }}
                        >
                          <Typography color="textPrimary" variant="body1">
                            {customer.userId?.name}
                          </Typography>
                          {customer?.userId?.email}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{customer.coinSymbol?.toUpperCase()}</TableCell>

                    <TableCell>{customer?.address}</TableCell>
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
        count={data?.total}
        onPageChange={handlePageChange}
        page={page}
        rowsPerPage={data?.data?.length}
        rowsPerPageOptions={[]}
      />
    </Card>
  );
};

CryptoWalletListResults.propTypes = {
  data: PropTypes.array.isRequired,
};
