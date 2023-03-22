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
import EditIcon from "@mui/icons-material/Edit";
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

const PlayerList = (props: Props) => {
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
  } = usePlayerData(searchQuery, RefreshAdminUsersData, data, page, limit);

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
                        {/* <TableCell style={{ color: "#fff" }}>value</TableCell> */}
                        <TableCell style={{ color: "#fff" }}>Height</TableCell>
                        <TableCell style={{ color: "#fff" }}>Weight</TableCell>
                        <TableCell style={{ color: "#fff" }}>Age</TableCell>
                        <TableCell style={{ color: "#fff" }}>
                          Current Team
                        </TableCell>
                        <TableCell style={{ color: "#fff" }}>
                          Experience
                        </TableCell>
                        {/* <TableCell style={{ color: "#fff" }}>
                          Edit Value
                        </TableCell> */}
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
                            {/* <TableCell>
                              {customer?.value ? customer?.value : 0}
                            </TableCell> */}
                            <TableCell>{customer?.detail?.Height}</TableCell>
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
                            </TableCell>*/}
                            {/* <TableCell
                              onClick={() => handleEditPlayer(customer)}
                            >
                              <EditIcon />
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
            rowsPerPage={limit}
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
                  Update Player's Value
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
                />
                <TextField
                  error={Boolean(formik.touched.video && formik.errors.video)}
                  onChange={(ev: any) => {
                    if (ev?.target?.files)
                      formik.setFieldValue("video", ev?.target?.files);
                  }}
                  inputProps={{ accept: "video/*" }}
                  fullWidth
                  label="video"
                  margin="normal"
                  name="video"
                  color="success"
                  variant="outlined"
                  type="file"
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
export default PlayerList;
PlayerList.propTypes = {
  data: PropTypes.array.isRequired,
};
