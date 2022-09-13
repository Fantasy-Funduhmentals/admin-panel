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
  Button,
} from "@mui/material";
import moment from "moment";
import PropTypes, { any } from "prop-types";
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";
import { HTTP_CLIENT } from "../../utils/axiosClient";

interface Props extends CardProps {
  data: any | {};
  searchQuery?: string;
  status: any;
  page: number;
  total: number;
  setPage: any;
}

export const NativeWalletListResults = (props: Props) => {
  const { data, searchQuery, setPage, page } = props;
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  const handlePageChange = (event, newPage) => {
    if (newPage >= 0) {
      setPage(newPage);
    }
  };

  const dataToDisplay = useMemo(() => {
    const rates = data?.data?.rates;
    let wallets = data?.data?.wallets;

    wallets = wallets?.map((wallet) => {
      const rateIndex = rates.findIndex((rate) => {
        return rate?.coinSymbol === wallet?.coinSymbol;
      });
      return {
        ...wallet,
        rate: rates[rateIndex],
      };
    });

    if (searchQuery.length > 0) {
      return wallets
        .filter(
          (user) =>
            user.user?.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            user?.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
        )

    } else {
      return wallets;
    }
  }, [data, searchQuery]);

  return (
    <>
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
                <TableHead sx={{ background: "#5a82d7" }}>
                  <TableRow>
                    <TableCell style={{ color: "#fff" }}>User</TableCell>
                    <TableCell style={{ color: "#fff" }}>Coin</TableCell>
                    <TableCell style={{ color: "#fff" }}>Balance</TableCell>
                    <TableCell style={{ color: "#fff" }}>USD Value</TableCell>
                    <TableCell style={{ color: "#fff" }}>Token value</TableCell>
                    <TableCell style={{ color: "#fff" }}>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataToDisplay?.map((customer) => (
                    <TableRow
                      hover
                      key={customer._id}
                      selected={
                        selectedCustomerIds.indexOf(customer._id) !== -1
                      }
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
                      <TableCell>
                        {customer.coin?.shortName.toUpperCase()}
                      </TableCell>

                      {/* <TableCell>{customer?.address}</TableCell> */}
                      <TableCell>
                        {customer?.balance
                          ? Number(
                            parseFloat(customer?.balance).toFixed(3)
                          ).toLocaleString()
                          : "0.00"}{" "}
                        {customer.coin?.shortName.toUpperCase()}
                      </TableCell>
                      <TableCell>
                        {Number(
                          (customer?.balance * customer?.rate?.price).toFixed(3)
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {Number(customer?.rate?.price).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {moment(customer.createdAt).format(
                          "DD/MM/YYYY hh:mm A"
                        )}
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
          rowsPerPage={data?.data?.wallets?.length}
          rowsPerPageOptions={[]}
        />
      </Card>
    </>
  );
};

NativeWalletListResults.propTypes = {
  data: PropTypes.array.isRequired,
};
