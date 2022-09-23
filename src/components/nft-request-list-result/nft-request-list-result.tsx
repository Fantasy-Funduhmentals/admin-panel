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
  getNftRequests,
  handleRequestInteraction,
  handleRequestNftBalance,
  handleCheckbalance,
} from "../../services/requestService";
import { REQUEST_STATUS, REQUEST_TYPES } from "../../utils/enums/request.enum";
import { getInitials } from "../../utils/get-initials";
import { getNormalizedError } from "../../utils/helpers";
import { SeverityPill } from "../severity-pill";
import StatusModal from "../StatusModal";
import { GetNftBalanceContract } from "../../utils/contract/nftBalanceContract";
import { useWeb3 } from "@3rdweb/hooks";
import BigNumber from "big-number";
import NoDataFound from "../NoDataFound/NoDataFound";
import { saveNftRequests } from "../../store/reducers/nftRequestSlice";
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
  const dispatch = useDispatch()
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
    if (!row.isLoan) {
      const response = await handleCheckbalance(row.user._id);
      if (
        !(
          Number(response.data.balance) >
          Number(row.amount * row.assetPool.pricePerShare)
        )
      ) {
        setStatusData({
          type: "error",
          message: "Insufficient balance",
        });
        return;
      }
    }

    if (!address) {
      setStatusData({
        type: "error",
        message: "Please connect your wallet first",
      });
      return;
    }
    setLoading(true);
    /******** */
    try {
      if (row.isLoan) {
        let requestId = row._id;
        let status = REQUEST_STATUS.APPROVED;
        const response = await handleRequestNftBalance({ requestId, status });
        setStatusData({
          type: "success",
          message: "FNFT transfer successfully",
        });
        const walletRes = await getNftRequests(page);
        dispatch(saveNftRequests(walletRes.data));
      } else {
        let amount = row.amount;
        // let amount = web3.utils.toWei(row.amount, "ether");
        let id = row?.assetPool?.index;
        let from = address;
        let to = row?.userAddress;
        let data = [];

        // setStatusData({
        //   type: "success",
        //   message: "FNFT transfer successfully",
        // });
        // if (response) {
        const nftBalance = await GetNftBalanceContract();
        setLoading(true);
        const res = await nftBalance.methods
          .safeTransferFrom(from, to, id, amount, data)
          .send({ from: address });
        if (res) {
          let requestId = row._id;
          let status = REQUEST_STATUS.APPROVED;
          const response = await handleRequestNftBalance({ requestId, status });
        }

        const walletRes = await getNftRequests(page);
        dispatch(saveNftRequests(walletRes.data));
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
  // function numberWithCommas(n) {
  //   var parts = n ? n.toString().split(".") : "";
  //   return (
  //     parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
  //     (parts[1] ? "." + parts[1] : "")
  //   );
  // }
  return (
    <React.Fragment>
      {loading ? (
        <Box
          sx={{
            minHeight: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="secondary" />
        </Box>
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
            <TableCell>{row?.assetPool?.name}</TableCell>
            <TableCell align="center">{row?.amount}</TableCell>
            <TableCell align="center">{row?.assetPool?.index}</TableCell>
            <SeverityPill
              style={{ marginTop: "37px" }}
              color={(row.isLoan && "success") || "error"}
            >
              {row.isLoan ? "Loan request" : "Normal request "}
            </SeverityPill>
            <TableCell align="center">
              {row?.assetPool?.remainingSupply.toLocaleString()}
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
            <TableCell>
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
            </TableCell>
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
                                <TableCell align="left">Amount</TableCell>
                                <TableCell align="left">{row.amount}</TableCell>
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
                                  Price Per Unit
                                </TableCell>
                                <TableCell align="left">
                                  {row?.assetPool?.pricePerShare}
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell align="left">
                                  Remaining Units
                                </TableCell>
                                <TableCell align="left">
                                  {row?.assetPool?.remainingSupply?.toLocaleString()}
                                </TableCell >
                              </TableRow >
                              <TableRow>
                                <TableCell align="left">Total Supply</TableCell>
                                <TableCell align="left">
                                  {row?.assetPool?.totalSupply?.toLocaleString()}
                                </TableCell >
                              </TableRow >
                            </TableBody >
                          </Table >

                          {/* <Typography sx={{ textAlign: "left" }}>Amount</Typography>
                      <Typography sx={{ textAlign: "right" }}>
                        Amount
                      </Typography> */}
                        </Box >
                      </Box >
                    </CardContent >
                    <Divider />
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    ></Box>
                  </Card >
                </Box >
              </Collapse >
            </TableCell >
          </TableRow >
        </>
      )}
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </React.Fragment >
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
      await handleRequestNftBalance({
        requestId,
        status,
      });
      const walletRes = await getNftRequests(page, searchText);
      dispatch(saveNftRequests(walletRes.data));
      callback();
      setStatusData({
        type: "success",
        message: "Request handled successfully",
      });
      setLoading(false);
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
                      <TableCell style={{ color: "#fff" }}>Amount</TableCell>
                      <TableCell style={{ color: "#fff" }}>index</TableCell>
                      <TableCell style={{ color: "#fff" }}>
                        Loan Status
                      </TableCell>
                      <TableCell style={{ color: "#fff" }}>
                        remaining Units
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
                        page={page}
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
