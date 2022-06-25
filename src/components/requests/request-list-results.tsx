import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
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
  handleRequestInteraction,
} from "../../services/requestService";
import { REQUEST_STATUS, REQUEST_TYPES } from "../../utils/enums/request.enum";
import { getInitials } from "../../utils/get-initials";
import { getNormalizedError } from "../../utils/helpers";
import NoDataFound from "../NoDataFound/NoDataFound";
import { SeverityPill } from "../severity-pill";
import StatusModal from "../StatusModal";

interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
}

const Row = (props) => {
  const { row, handleRequest } = props;
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <React.Fragment>
      {loading ? (
        <TableRow
          sx={{
            minHeight: "200px",
            display: "flex",
            width: "100%",
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
            <TableCell>{getExplanationText(row.type)}</TableCell>
            <TableCell align="center">
              {moment(row.createdAt).format("DD/MM/YYYY hh:mm A")}
            </TableCell>
            <TableCell>
              <Button
                variant="outlined"
                color="success"
                onClick={() => {
                  setLoading(true);
                  handleRequest(row._id, REQUEST_STATUS.APPROVED, () => {
                    setLoading(false);
                  });
                }}
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
                                <TableCell align="left">
                                  {Number(row.amount).toLocaleString()}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell align="left">From</TableCell>
                                <TableCell align="left">
                                  {row.fromName}
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell align="left">To</TableCell>
                                <TableCell align="left">{row.toName}</TableCell>
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
      await handleRequestInteraction({
        requestId,
        status,
      });
      getRequests(() => {
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
            <TableContainer component={Paper}>
              {dataToDisplay.length == 0 ? (
                <NoDataFound />
              ) : (
                <Table aria-label="collapsible table">
                  <TableHead sx={{ background: "#5a82d7" }}>
                    <TableRow>
                      <TableCell style={{ color: "#fff" }}>User</TableCell>
                      <TableCell style={{ color: "#fff" }}>
                        Request Type
                      </TableCell>
                      <TableCell style={{ color: "#fff" }}>
                        Created At
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataToDisplay.map((row) => (
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
