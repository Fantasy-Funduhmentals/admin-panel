import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardProps,
  CircularProgress,
  FormControl,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import PropTypes from "prop-types";
import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { HTTP_CLIENT } from "../../utils/axiosClient";
import { getInitials } from "../../utils/get-initials";
import { getNormalizedError } from "../../utils/helpers";
import NoDataFound from "../NoDataFound/NoDataFound";
import StatusModal from "../StatusModal";
import usePlayerData from "./usePlayerData";
interface Props extends CardProps {
  searchQuery?: string;
  loadingApi?: boolean;
  handleLimitChange?: (prop?: any) => any;
  handlePageChange?: (event?: any, page?: any) => void;
  page?: number;
  limit?: number;
  count?: number;
  RefreshAdminUsersData?: () => any;
  onPressUpdate?: any;
  data?: any[];
}

export const PlayerList = (props: Props) => {
  const {
    searchQuery,
    RefreshAdminUsersData,
    loadingApi,
    handleLimitChange,
    handlePageChange,
    page,
    limit,
    count,
    data,
  } = props;
  const {
    dataToDisplay,
    selectedCustomerIds,
    handleBlockUser,

    rejectShow,
    handleClose,
    loading,
    handleTextAreaChange,
    handleSubmit,
    statusData,
    setStatusData,
    subadmin,
  } = usePlayerData(searchQuery, RefreshAdminUsersData, data, page, limit);

  console.log(page, "page");

  return (
    <>
      {loadingApi ? (
        <CircularProgress />
      ) : (
        <Card {...props}>
          <PerfectScrollbar>
            <Paper
              style={{
                width: "100%",
                // marginTop: theme.spacing.unit * 3,
                overflowX: "auto",
              }}
            >
              {dataToDisplay?.length === 0 ? (
                <NoDataFound />
              ) : (
                <Box>
                  <Table>
                    <TableHead>
                      <TableRow style={{ background: "black" }}>
                        <TableCell style={{ color: "#fff" }}>Name</TableCell>
                        <TableCell style={{ color: "#fff" }}>
                          player id
                        </TableCell>
                        <TableCell style={{ color: "#fff" }}>Height</TableCell>
                        <TableCell style={{ color: "#fff" }}>Weight</TableCell>
                        <TableCell style={{ color: "#fff" }}>Age</TableCell>
                        <TableCell style={{ color: "#fff" }}>
                          Current Team
                        </TableCell>
                        <TableCell style={{ color: "#fff" }}>
                          Experience
                        </TableCell>
                        {/* <TableCell style={{ color: "#fff" }}>Edit</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataToDisplay?.map((customer) => (
                        <>
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
                                  src={customer?.detail?.PhotoUrl}
                                  sx={{ mr: 2 }}
                                >
                                  {getInitials(customer?.detail?.Name)}
                                </Avatar>
                                <Typography color="textPrimary" variant="body1">
                                  {customer?.detail?.Name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{customer?.detail?.PlayerID}</TableCell>
                            <TableCell>
                              {customer?.detail?.HeightFeet}F
                            </TableCell>
                            <TableCell>{customer?.detail?.Weight} lb</TableCell>
                            <TableCell>{customer?.detail?.Age} </TableCell>
                            <TableCell>
                              {customer?.detail?.CurrentTeam
                                ? customer?.detail?.CurrentTeam
                                : "-"}{" "}
                            </TableCell>
                            <TableCell>
                              {customer?.detail?.Experience} Y
                            </TableCell>

                            {/* <TableCell
                              onClick={() => handleBlockUser(customer)}
                            >
                              <Button
                                sx={{
                                  cursor: "pointer",
                                  border: `${
                                    customer.isBlocked
                                      ? "1px solid green"
                                      : "1px solid rgb(209, 67, 67)"
                                  }`,
                                  color: `${
                                    customer.isBlocked
                                      ? "green"
                                      : "rgb(209, 67, 67)"
                                  }`,
                                  width: `${
                                    customer.isBlocked ? "auto" : "50%"
                                  }`,
                                }}
                              >
                                {customer.isBlocked ? "UnBlock" : "Block"}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <AlertDialog
                                id={customer?._id}
                                handleRefresh={RefreshAdminUsersData}
                              />
                            </TableCell> */}
                          </TableRow>
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Paper>
          </PerfectScrollbar>
          <TablePagination
            component="div"
            count={count}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={10}
            rowsPerPageOptions={[5, 10, 25]}
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
                rowGap: 4,
                boxShadow: 60,
                p: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Please Describe Block reason
              </Typography>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                // placeholder="Minimum 3 rows"
                style={{
                  width: 300,
                  resize: "none",
                  height: "200px",
                  border: "1px solid black",
                }}
                onChange={(e) => handleTextAreaChange(e)}
              />
              <Box sx={{ width: "90%", textAlign: "center" }}>
                {loading ? (
                  <Box>
                    <CircularProgress color="inherit" />
                  </Box>
                ) : (
                  <Button
                    style={{ width: 300 }}
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
      )}
    </>
  );
};

PlayerList.propTypes = {
  data: PropTypes.array.isRequired,
};

export default function AlertDialog({ id, handleRefresh }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const deleteAd = async () => {
    setLoading(true);
    try {
      await HTTP_CLIENT.delete(`/admin-auth/delete-subAdmin/${id}`);
      setLoading(false);
      handleRefresh();
      handleClose();
    } catch (err) {
      const error = getNormalizedError(err);
      setStatusData({
        type: "error",
        message: error,
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <DeleteIcon style={{ cursor: "pointer" }} onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to Delete
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {loading ? (
            <Button>Loading...</Button>
          ) : (
            <Button onClick={deleteAd} autoFocus>
              Ok
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <StatusModal
        statusData={statusData}
        onClose={() => setStatusData(null)}
      />
    </div>
  );
}
