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
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";
import { HTTP_CLIENT } from "../../utils/axiosClient";

interface Props extends CardProps {
  data: any | [] | {};
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

    const rates = data.rates;
    let wallets = data.wallets;

    wallets = wallets?.map((wallet) => {
      const rateIndex = rates.findIndex((rate) => {
        return rate.coinSymbol === wallet.coinSymbol;
      });
      return {
        ...wallet,
        rate: rates[rateIndex],
      };
    });


    if (searchQuery.length > 0) {
      return wallets?
        .filter(
          (user) =>
            user.user?.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            user.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(begin, end);
    } else {
      return wallets?.slice(begin, end);
    }
  }, [page, limit, data, searchQuery]);
  function numberWithCommas(n) {
    var parts = n ? n.toString().split(".") : "";
    return (
      parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      (parts[1] ? "." + parts[1] : "")
    );
  }

  


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
                <TableHead sx={{background:"#5a82d7"}}>
                  <TableRow >
                    <TableCell style={{color:"#fff"}}>User</TableCell>
                    <TableCell style={{color:"#fff"}}>Coin</TableCell>
                    <TableCell style={{color:"#fff"}}>Balance</TableCell>
                    <TableCell style={{color:"#fff"}}>USD Value</TableCell>
                    <TableCell style={{color:"#fff"}}>Token value</TableCell>
                    <TableCell style={{color:"#fff"}}>Created At</TableCell>
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
                          ? numberWithCommas(parseFloat(customer?.balance).toFixed(3))
                          : "0.00"}{" "}
                        {customer.coin?.shortName.toUpperCase()}
                      </TableCell>
                      <TableCell>
                        {(customer?.balance * customer?.rate?.price).toFixed(3) }
                      </TableCell>
                      <TableCell>
                        {customer?.rate?.price }
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
          count={data?.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </>
  );
};

NativeWalletListResults.propTypes = {
  data: PropTypes.array.isRequired,
};
