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
import { SeverityPill } from "../severity-pill";
import StatusModal from "../StatusModal";

interface Props extends CardProps {
  data: any[];
  searchQuery?: string;
}

const Row = (props) => {
  const { row, handleRequest } = props;
  const [open, setOpen] = React.useState(false);

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
              handleRequest(row._id, REQUEST_STATUS.APPROVED);
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
              handleRequest(row._id, REQUEST_STATUS.REJECTED);
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
                          <TableRow>
                            <TableCell align="left">From</TableCell>
                            <TableCell align="left">{row.from}</TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell align="left">To</TableCell>
                            <TableCell align="left">{row.to}</TableCell>
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
                >
                  {/* <TextField
                    type="file"
                    onChange={(ev) => handleImageSelection(ev)}
                  /> */}
                </Box>
              </Card>

              {/* <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history?.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell>{historyRow.amount}</TableCell>
                      <TableCell>
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table> */}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export const RequestListResults = (props: Props) => {
  const { data, searchQuery } = props;
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [rowOpen, setRowopen] = useState(false);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRequest = async (requestId: string, status: string) => {
    try {
      setLoading(true);
      const loginRes = await handleRequestInteraction({
        requestId,
        status,
      });
      getRequests(() => {
        setLoading(false);
      });

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
      return data.slice(begin, end);
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
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>User</TableCell>
                    <TableCell>Request Type</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <Row
                      key={row.name}
                      row={row}
                      handleRequest={handleRequest}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Wallet Activation Status</TableCell>

                  <TableCell>Request Type</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataToDisplay.map((customer) => (
                  <TableRow
                    hover
                    key={customer._id}
                    selected={selectedCustomerIds.indexOf(customer._id) !== -1}
                  >
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setRowopen(!rowOpen)}
                      >
                        {rowOpen ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Avatar
                          src={customer.user.profilePicture}
                          sx={{ mr: 2 }}
                        >
                          {getInitials(customer.user.name)}
                        </Avatar>
                        <Typography color="textPrimary" variant="body1">
                          {customer.user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{customer.user.email}</TableCell>

                    <TableCell>
                      <SeverityPill
                        color={
                          (customer.user.isWalletActivated && "success") ||
                          "error"
                        }
                      >
                        {customer.user.isWalletActivated
                          ? "Activated"
                          : "Not Activated"}
                      </SeverityPill>
                    </TableCell>
                   
                    <TableCell>{getExplanationText(customer.type)}</TableCell>
                    <TableCell>
                      {moment(customer.createdAt).format("DD/MM/YYYY hh:mm A")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table> */}
          </Box>
        </Paper>
      </PerfectScrollbar>

      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
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

RequestListResults.propTypes = {
  customers: PropTypes.array.isRequired,
};
