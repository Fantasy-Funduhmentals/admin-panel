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
  Modal,
  TextareaAutosize,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import moment from "moment";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { getInitials } from "../../utils/get-initials";
import { SeverityPill } from "../severity-pill";
import { HTTP_CLIENT } from "../../utils/axiosClient";
import { handleBlock } from "../../services/userService";
import { getNormalizedError } from "../../utils/helpers";
import StatusModal from "../../components/StatusModal";

interface Props extends CardProps {
  data: any | {};
  selected: any;
  setSelected: any;
  status: any;
  page: number;
  total: number;
  setPage: any;
  handleRefresh: () => any;
}

export const UserListResults = (props: Props) => {
  const { data, selected, setSelected, handleRefresh, page, setPage } = props;
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [rejectShow, setrejectShow] = useState(false);
  const [signleUser, setsignleUser] = useState(null);
  const [reason, setReason] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [loading, setloading] = useState(false);

<<<<<<< HEAD
  const handleChange = (e) => {
    setSelected(e.target.value);
  };

=======
  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };
>>>>>>> 479735f9c643a25850edc450e734af2756134a32

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1);
  };

  const dataToDisplay = useMemo(() => {
<<<<<<< HEAD
    return data?.data;
  }, [data?.data]);
=======
    const begin = page * limit;
    const end = begin + limit;

    if (searchQuery.length > 0) {
      return data
        .filter(
          (user) =>
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(begin, end);
    } else {
      return data?.slice(begin, end);
    }
  }, [page, limit, data, searchQuery]);
>>>>>>> 479735f9c643a25850edc450e734af2756134a32

  const handleBlockUser = (data) => {
    if (data.isBlocked) {
      setsignleUser(data);
      handleSubmit(data);
    } else {
      setsignleUser(data);
      setrejectShow(true);
    }
  };

  const handleClose = () => {
    setrejectShow(false);
  };

  const handleTextAreaChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmit = async (data) => {
    let params;
    if (data?.isBlocked) {
      params = {
        userId: data?._id,
        isblocked: !data?.isBlocked,
      };
    } else {
      if (!reason) {
        setStatusData({
          type: "error",
          message: "please enter reason first",
        });
        return;
      }
      params = {
        userId: signleUser?._id,
        isblocked: !signleUser?.isBlocked,
        reasonToBlock: reason,
      };
    }

    try {
      setloading(true);
      const response = await handleBlock(params);
      handleRefresh();
      setStatusData({
        type: "success",
        message: response?.data?.message,
      });
      setloading(false);
      handleClose();
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setloading(false);
    }
  };


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
              <TableHead sx={{ background: "black" }}>
                <TableRow>
                  <TableCell style={{ color: "#fff" }}>Name</TableCell>
                  <TableCell style={{ color: "#fff" }}>Email</TableCell>
                  {/* <TableCell style={{ color: "#fff" }}>
                    Wallet Activation Status
                  </TableCell> */}
                  {/* <TableCell style={{ color: "#fff" }}>
                    Customer Status
                  </TableCell> */}
                  <TableCell style={{ color: "#fff" }}>Email Status</TableCell>
                  <TableCell style={{ color: "#fff" }}>Status</TableCell>
                  <TableCell style={{ color: "#fff" }}>User type</TableCell>
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
                        <Avatar src={customer.profilePicture} sx={{ mr: 2 }}>
                          {getInitials(customer.name)}
                        </Avatar>
                        <Typography color="textPrimary" variant="body1">
                          {customer.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    {/* 
                    <TableCell>
                      <SeverityPill
                        color={
                          (customer.isWalletActivated && "success") || "error"
                        }
                      >
                        {customer.isWalletActivated
                          ? "Activated"
                          : "Not Activated"}
                      </SeverityPill>
                    </TableCell> */}
                    {/* <TableCell>
                      <SeverityPill
                        color={(customer.isCustomer && "success") || "error"}
                      >
                        {customer.isCustomer ? "Verified" : "Not Verified"}
                      </SeverityPill>
                    </TableCell> */}
                    <TableCell>
                      <SeverityPill
                        color={
                          (customer?.isEmailVerified && "success") || "error"
                        }
                      >
                        {customer?.isEmailVerified
                          ? "Verified"
                          : "Not Verified"}
                      </SeverityPill>
                    </TableCell>
                    <TableCell onClick={() => handleBlockUser(customer)}>
                      <Button
                        sx={{
                          cursor: "pointer",
                          border: `${customer.isBlocked
                            ? "1px solid green"
                            : "1px solid rgb(209, 67, 67)"
                            }`,
                          color: `${customer.isBlocked ? "green" : "rgb(209, 67, 67)"
                            }`,
                          width: `${customer.isBlocked ? "auto" : "100%"}`,
                        }}
                      >
                        {customer.isBlocked ? "UnBlock" : "Block"}
                      </Button>
                    </TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {customer?.type}
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
      <Modal
        open={rejectShow}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 364,
            bgcolor: "background.paper",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            rowGap: 2,
            boxShadow: 60,
            padding: "1rem",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Please Describe Block reason
          </Typography>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={3}
            // placeholder="Minimum 3 rows"
            color="secondary"
            style={{
              width: "100%",
              resize: "none",
              height: "200px",
              border: "1px solid gray",
              background: "transparent",
              color: "#fff",
              padding: "0.5rem",
              borderRadius: "8px",
            }}
            onChange={(e) => handleTextAreaChange(e)}
          />
          <Box sx={{ width: "100%", textAlign: "center" }}>
            {loading ? (
              <Box>
                <CircularProgress color="inherit" />
              </Box>
            ) : (
              <Button
                style={{ width: "100%" }}
                color="primary"
                variant="contained"
                type="submit"
                fullWidth
                onClick={handleSubmit}
              >
                Submit
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </Card>
  );
};

UserListResults.propTypes = {
  data: PropTypes.array.isRequired,
};
