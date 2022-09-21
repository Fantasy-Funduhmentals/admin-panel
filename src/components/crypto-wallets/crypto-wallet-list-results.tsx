import {
  Avatar,
  Box,
  Card,
  CardProps, Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import { useMemo } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";

interface Props extends CardProps {
  data: any | {};
  status: any;
  page: number;
  total: number;
  setPage: any;
}

export const CryptoWalletListResults = (props: Props) => {
  const { data, setPage, page } = props;


  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1);
  };

  const dataToDisplay = useMemo(() => {
    return data?.data;
  }, [data?.data]);

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
        page={page - 1}
        rowsPerPage={10}
        rowsPerPageOptions={[]}
      />
    </Card>
  );
};

CryptoWalletListResults.propTypes = {
  data: PropTypes.array.isRequired,
};
