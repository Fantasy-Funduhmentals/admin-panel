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
  TextField,
  Typography,
} from "@mui/material";
import EditOffIcon from "@mui/icons-material/EditOff";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
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
import useNftData from "./useNftData";
import EditIcon from "@mui/icons-material/Edit";
interface Props extends CardProps {
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

export const NftList = (props: Props) => {
  const {
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
    selectedCustomerIds,
    // handleBlockUser,
    handleEditPlayer,
    rejectShow,
    handleClose,
    formik,
    // handlePlayerValue,
    loading,
    handleTextAreaChange,
    // handleSubmit,
    statusData,
    setStatusData,
    subadmin,
  } = useNftData(RefreshAdminUsersData, data, page, limit);

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
              {data?.length === 0 ? (
                <NoDataFound />
              ) : (
                <Box>
                  <Table>
                    <TableHead>
                      <TableRow style={{ background: "black" }}>
                        <TableCell style={{ color: "#fff" }}>Name</TableCell>
                        <TableCell style={{ color: "#fff" }}>nft Id</TableCell>
                        <TableCell style={{ color: "#fff" }}>value</TableCell>
                        <TableCell style={{ color: "#fff" }}>Height</TableCell>
                        <TableCell style={{ color: "#fff" }}>Weight</TableCell>
                        <TableCell style={{ color: "#fff" }}>Age</TableCell>
                        <TableCell style={{ color: "#fff" }}>
                          position
                        </TableCell>
                        <TableCell style={{ color: "#fff" }}>
                          Experience
                        </TableCell>
                        <TableCell style={{ color: "#fff" }}>
                          Edit Value
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data?.map((customer) => (
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
                                  src={customer?.playerDetail?.PhotoUrl}
                                  sx={{ mr: 2 }}
                                >
                                  {getInitials(customer?.playerDetail?.Name)}
                                </Avatar>
                                <Typography color="textPrimary" variant="body1">
                                  {customer?.playerDetail?.Name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{customer?.nftId}</TableCell>
                            <TableCell>
                              {customer?.value ? customer?.value : 0}
                            </TableCell>
                            <TableCell>
                              {customer?.playerDetail?.Height
                                ? `${customer?.playerDetail?.Height}`
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {customer?.playerDetail?.Weight} lb
                            </TableCell>
                            <TableCell>
                              {customer?.playerDetail?.Age}{" "}
                            </TableCell>
                            <TableCell>
                              {customer?.playerDetail?.Position
                                ? customer?.playerDetail?.Position
                                : "-"}{" "}
                            </TableCell>
                            <TableCell>
                              {customer?.playerDetail?.Experience} Y
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
                            </TableCell>*/}

                            <TableCell
                              onClick={() =>
                                customer?.isListedOnMarketplace &&
                                handleEditPlayer(customer)
                              }
                            >
                              {customer?.isListedOnMarketplace ? (
                                <EditIcon sx={{ cursor: "pointer" }} />
                              ) : (
                                <EditOffIcon sx={{ cursor: "not-allowed" }} />
                              )}
                            </TableCell>
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
            sx={{ background: "rgba(0, 0, 0, 0.7)" }}
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
              <form onSubmit={formik.handleSubmit}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Update NFT Data
                </Typography>
                <TextField
                  error={Boolean(formik.touched.value && formik.errors.value)}
                  value={formik.values.value}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  fullWidth
                  label="Value"
                  margin="normal"
                  name="value"
                  color="success"
                  variant="outlined"
                  type="number"
                />

                {/* <TextField
                  error={Boolean(formik.touched.video && formik.errors.video)}
                  onChange={(ev: any) => {
                    if (ev?.target?.files)
                      formik.setFieldValue("video", ev?.target?.files);
                  }}
                  inputProps={{ accept: "video/*" }}
                  fullWidth
                  // label="video"
                  margin="normal"
                  name="video"
                  color="success"
                  variant="outlined"
                  type="file"
                /> */}

                <Box sx={{ width: "100%", textAlign: "center" }}>
                  {loading ? (
                    <Button
                      style={{ marginTop: 14 }}
                      color="primary"
                      variant="contained"
                      type="submit"
                      fullWidth
                    >
                      <CircularProgress color="inherit" size="35px" />
                    </Button>
                  ) : (
                    <Button
                      style={{ marginTop: 14 }}
                      color="primary"
                      variant="contained"
                      type="submit"
                      fullWidth
                    >
                      Submit
                    </Button>
                  )}
                </Box>
              </form>
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

NftList.propTypes = {
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
