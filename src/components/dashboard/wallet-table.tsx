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
import { useMemo, useRef, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { HTTP_CLIENT } from "../../utils/axiosClient";
import { CopyToClipboard } from "react-copy-to-clipboard";
import moment from "moment";
interface Props extends CardProps {
  data: any | [];
}

export const WalletListResults = (props: Props) => {
  const { data } = props;

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
              <TableHead sx={{ background: "#5a82d7" }}>
                <TableRow>
                  <TableCell style={{ color: "white" }}>Coin</TableCell>
                  <TableCell style={{ color: "white" }}>Coin Name</TableCell>

                  <TableCell style={{ color: "white" }}>Symbol</TableCell>
                  <TableCell style={{ color: "white" }}>
                    remaining Supply
                  </TableCell>
                  <TableCell style={{ color: "white" }}>balance</TableCell>
                  {/* <TableCell style={{ color: "white" }}>Date</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((customer, index) => {
                  return (
                    <TableRow hover key={customer._id}>
                      <TableCell>
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <Avatar src={customer.token.icon.url} sx={{ mr: 2 }}>
                            {getInitials(customer.token.displayName)}
                          </Avatar>
                          <Typography
                            color="textPrimary"
                            variant="body1"
                            sx={{ minWidth: "150px" }}
                          >
                            {customer.token.displayName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <img
                          src={customer.token.displaySymbol}
                          style={{ height: 30, width: 30 }}
                        />
                      </TableCell>
                      <TableCell>{customer.token.shortName}</TableCell>
                      <TableCell>
                        {customer.token.coinSymbol == "Q"
                          ? Number(
                              customer?.token.remainingSupply?.toFixed(2)
                            ).toLocaleString()
                          : Number(
                              customer?.token.remainingSupply?.toFixed(3)
                            ).toLocaleString()}
                      </TableCell>
                      <TableCell>{customer?.balance}</TableCell>
                      {/* <TableCell>
                        {moment(customer.createdAt).format("MMM Do YY")}
                      </TableCell> */}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Paper>
      </PerfectScrollbar>
    </Card>
  );
};
