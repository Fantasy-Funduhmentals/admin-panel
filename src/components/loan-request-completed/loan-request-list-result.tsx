import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import web3 from "web3";

import {
  Avatar,
  Box,
  Card,
  CardProps,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
  CardHeader,
  CardContent,
  Divider,
  CircularProgress,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import moment from "moment";
import PropTypes from "prop-types";
import * as React from "react";
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  getRequests,
  getLoanRequests,
  handleRequestInteraction,
  handleRequestNftBalance,
} from "../../services/requestService";
import { REQUEST_STATUS, REQUEST_TYPES } from "../../utils/enums/request.enum";
import { getInitials } from "../../utils/get-initials";
import { getNormalizedError } from "../../utils/helpers";
import { SeverityPill } from "../severity-pill";
import StatusModal from "../StatusModal";
import { GetNftBalanceContract } from "../../utils/contract/nftBalanceContract";
import { useWeb3 } from "@3rdweb/hooks";
import BigNumber from "big-number";
import { HTTP_CLIENT } from "../../utils/axiosClient";
import NoDataFound from "../NoDataFound/NoDataFound";
interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
}

const Row = (props) => {
  const { row, handleRequest } = props;
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const { address } = useWeb3();
  const [statusData, setStatusData] = useState(null);
  // const authToken = store.getState();

  const getExplanationText = (requestType: REQUEST_TYPES) => {
    let explanation = "";

    switch (requestType) {
      case REQUEST_TYPES.CRYPTO_PURCHASE:
        explanation = "Swap From crypto to asset";
        break;
      case REQUEST_TYPES.FIAT_PURCHASE:
        explanation = "Purchase through bank";
        break;
      case REQUEST_TYPES.TOKENS_SWAP:
        explanation = "Swap asset to asset";
        break;
    }

    return explanation;
  };

  const handleTransaction = async (row: any) => {
    if (!address) {
      setStatusData({
        type: "error",
        message: "Please active your wallet first",
      });
      return;
    }
    // setLoading(true);

    try {
      const addressRes = await HTTP_CLIENT.get(
        `wallet/get-user-bnb-wallet/${row?.user?.email}`
      );

      if (addressRes?.data?.address) {
        let amount = row.balance;
        // let amount = web3.utils.toWei(row.amount, "ether");
        let id = row?.token?.index;
        let from = address;
        let to = addressRes.data.address;
        let data = [];
        const nftBalance = await GetNftBalanceContract();
        setLoading(true);

        const res = await nftBalance.methods
          .safeTransferFrom(from, to, id, amount, data)
          .send({ from: address });
        if (res) {
          let params = {
            walletId: row?._id,
          };

          const addressRes = await HTTP_CLIENT.post(
            "nft-wallet/complete-loan-status/",
            params
          );
          // const response = await handleRequestNftBalance({ requestId, status });
          setStatusData({
            type: "success",
            message: "Transacion successfully",
          });
        }
        getLoanRequests(() => {
          setLoading(false);
        });
        setLoading(false);
      }
    } catch (err) {
      setStatusData({
        type: "error",
        message: "Transaction failed",
      });
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      {loading ? (
        <TableRow>
          <CircularProgress color="secondary" />
        </TableRow>
      ) : (
        <>
          <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
            <TableCell>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">
              {/* {row.name} */}
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Avatar src={row.user?.profilePicture} sx={{ mr: 2 }}>
                  {getInitials(row.user?.name)}
                </Avatar>
                <Box
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <Typography color="textPrimary" variant="body1">
                    {row.user?.name}
                  </Typography>
                  {row?.user?.email}
                </Box>
              </Box>
            </TableCell>
            <TableCell>{row?.nftToken?.name}</TableCell>
            <TableCell align="center">{row?.loanAmount}</TableCell>
            <TableCell align="center">{row?.nftToken?.index}</TableCell>
            <SeverityPill
              style={{ marginTop: "27px" }}
              color={(row.isLoan && "success") || "error"}
            >
              {row.isLoan ? "completed" : "Incomplete"}
            </SeverityPill>
            <TableCell align="center">
              {row?.nftToken?.remainingSupply}
            </TableCell>
            <TableCell>
              <Button
                variant="outlined"
                color="success"
                onClick={() => handleTransaction(row)}
              >
                Accept
              </Button>
            </TableCell>
            {/* <TableCell>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setLoading(true);
                  handleRequest(row._id, REQUEST_STATUS.REJECTED, () => {
                    setLoading(false);
                  });
                }}
              >
                Reject
              </Button>
            </TableCell> */}
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            alignItems: "center",
                          }}
                        >
                          <Table size="small" aria-label="purchases">
                            <TableHead>
                              <TableCell align="left">
                                <Typography color="textPrimary" variant="h6">
                                  Details
                                </Typography>
                              </TableCell>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell align="left">Balance</TableCell>
                                <TableCell align="left">
                                  {row.balance}
                                </TableCell>
                              </TableRow>
                              {/* <TableRow>
                                <TableCell align="left">Status</TableCell>
                                <TableCell align="left">{row.status}</TableCell>
                              </TableRow> */}

                              <TableRow>
                                <TableCell align="left">Created At</TableCell>
                                <TableCell align="left">
                                  {moment(row.createdAt).format(
                                    "DD/MM/YYYY hh:mm A"
                                  )}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell align="left">
                                  Price PerShare
                                </TableCell>
                                <TableCell align="left">
                                  {row?.nftToken?.pricePerShare}
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell align="left">
                                  Remaining Supply
                                </TableCell>
                                <TableCell align="left">
                                  {row?.nftToken?.remainingSupply}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell align="left">Total Supply</TableCell>
                                <TableCell align="left">
                                  {row?.nftToken?.totalSupply}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>

                          {/* <Typography sx={{ textAlign: "left" }}>Amount</Typography>
                      <Typography sx={{ textAlign: "right" }}>
                        Amount
                      </Typography> */}
                        </Box>
                      </Box>
                    </CardContent>
                    <Divider />
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    ></Box>
                  </Card>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </>
      )}
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </React.Fragment>
  );
};

export const RequestListResults = (props: Props) => {
  const { data, searchQuery } = props;

  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRequest = async (
    requestId: string,
    status: string,
    callback: any
  ) => {
    try {
      setLoading(true);
      // await handleRequestNftBalance({
      //   requestId,
      //   status,
      // });
      getLoanRequests(() => {
        setLoading(false);
      });

      callback();
      setStatusData({
        type: "success",
        message: "Request handled successfully",
      });
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      callback();

      setLoading(false);
    }
  };

  const dataToDisplay = useMemo(() => {
    const begin = page * limit;
    const end = begin + limit;

    if (searchQuery.length > 0) {
      return data
        .filter(
          (requests) =>
            requests.user.name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            requests.user.email
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
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
            overflowX: "auto",
          }}
        >
          <Box>
            <TableContainer component={Paper} >
              {dataToDisplay.length == 0 ? (
               <NoDataFound/>
              ) : (
                <Table aria-label="collapsible table">
                  <TableHead sx={{ background: "#5a82d7" }}>
                    <TableRow>
                      <TableCell />
                      <TableCell style={{ color: "#fff" }}>User</TableCell>
                      <TableCell style={{ color: "#fff" }}>NFT name</TableCell>
                      <TableCell style={{ color: "#fff" }}>
                        Loan Amount
                      </TableCell>
                      <TableCell style={{ color: "#fff" }}>index</TableCell>
                      <TableCell style={{ color: "#fff" }}>
                        Loan Status
                      </TableCell>

                      <TableCell style={{ color: "#fff" }}>
                        remaining Supply
                      </TableCell>
                      <TableCell />
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataToDisplay?.map((row) => (
                      <Row
                        key={row.name}
                        row={row}
                        handleRequest={handleRequest}
                        loading={loading}
                      />
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Box>
        </Paper>
      </PerfectScrollbar>

      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
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

RequestListResults.propTypes = {
  customers: PropTypes.array.isRequired,
};
