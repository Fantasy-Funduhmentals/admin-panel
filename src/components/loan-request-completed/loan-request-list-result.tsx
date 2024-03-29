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
import { saveLoanRequests } from "../../store/reducers/loanSlice";
import { useDispatch } from "react-redux";
interface Props extends CardProps {
  data: any | {};
  status: any;
  searchText?: string | number;
  page: number;
  total: number;
  setPage: any;
}

const Row = (props) => {
  const { row, handleRequest, page } = props;
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const { address } = useWeb3();
  const dispatch = useDispatch()
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
        message: "Please connect your wallet first",
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
        const coinsRes = await getLoanRequests(page);
        dispatch(saveLoanRequests(coinsRes.data));
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
        <TableRow
          sx={{
            minHeight: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
            <TableCell>{row?.token?.name}</TableCell>
            <TableCell align="center">{row?.balance}</TableCell>
            <TableCell align="center">{row?.token?.index}</TableCell>
            <SeverityPill
              style={{ marginTop: "27px" }}
              color={(row.loanStatus && "success") || "error"}
            >
              {row.loanStatus ? "Paid" : "UnPaid"}
            </SeverityPill>
            {/* <TableCell align="center">
              {row?.nftToken?.remainingSupply}
            </TableCell> */}
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
                                  Price Per Units
                                </TableCell>
                                <TableCell align="left">
                                  {row?.token?.pricePerShare}
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell align="left">
                                  Remaining Units
                                </TableCell>
                                <TableCell align="left">
                                  {Number(
                                    row?.token?.remainingSupply
                                  ).toLocaleString()}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell align="left">Total Supply</TableCell>
                                <TableCell align="left">
                                  {Number(
                                    row?.token?.totalSupply
                                  ).toLocaleString()}
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
  const { data, page, searchText, setPage } = props;
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);



  const handlePageChange = (event, newPage) => {

    setPage(newPage + 1);

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
      const coinsRes = await getLoanRequests(page, searchText);
      dispatch(saveLoanRequests(coinsRes.data));
      if (coinsRes?.data?.data?.length == 0) { setPage(1) }
      setLoading(false);
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
            <TableContainer component={Paper}>
              {dataToDisplay?.length == 0 ? (
                <NoDataFound />
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

                      {/* <TableCell style={{ color: "#fff" }}>
                        remaining Units
                      </TableCell> */}
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
        count={data?.total}
        onPageChange={handlePageChange}
        page={page - 1}
        rowsPerPage={10}
        rowsPerPageOptions={[]}
      />
    </Card>
  );
};

RequestListResults.propTypes = {
  customers: PropTypes.array.isRequired,
};
